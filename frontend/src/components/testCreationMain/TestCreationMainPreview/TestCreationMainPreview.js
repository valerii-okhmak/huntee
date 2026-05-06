import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import './TestCreationMainPreview.css';
import ConfirmDeleteQuestionModal from "../../modal_windows/ConfirmDeleteQuestionModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faBars, faPlus, faChevronDown, faChevronRight, faFolderTree, faXmark, faCheck, faCircle, faRobot, faFileImport } from '@fortawesome/free-solid-svg-icons'; 

const TestCreationMainPreview = ({ 
  questions = [], levels = [], onAddLevel, onEditLevel, onDeleteLevel, 
  onDeleteQuestion, onEditQuestion, onReorderQuestions, onDeleteMultipleQuestions, 
  onAddQuestionClick, onOpenAiModal, onOpenImportModal, showError 
}) => {
  const { t } = useTranslation();
  
  const [isCreatingTopLevel, setIsCreatingTopLevel] = useState(false);
  const [creatingLevelBelow, setCreatingLevelBelow] = useState(null);
  const [editingLevelName, setEditingLevelName] = useState(null);
  
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelPoints, setNewLevelPoints] = useState("1");
  const [newLevelDisplayCount, setNewLevelDisplayCount] = useState("");
  
  const [collapsedLevels, setCollapsedLevels] = useState(new Set());
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [selectedQuestions, setSelectedQuestions] = useState(new Set()); 
  const [targetLevelForMove, setTargetLevelForMove] = useState("");

  const [dragOverLevel, setDragOverLevel] = useState(null);
  const [dragOverQuestion, setDragOverQuestion] = useState(null);

  const toggleLevelCollapse = (e, levelName) => {
    e.stopPropagation();
    setCollapsedLevels(prev => { const newSet = new Set(prev); newSet.has(levelName) ? newSet.delete(levelName) : newSet.add(levelName); return newSet; });
  };

  const toggleQuestionExpand = (index) => {
    setExpandedQuestions(prev => { const newSet = new Set(prev); newSet.has(index) ? newSet.delete(index) : newSet.add(index); return newSet; });
  };

  const closeAllLevelForms = () => {
    setIsCreatingTopLevel(false); setCreatingLevelBelow(null); setEditingLevelName(null);
    setNewLevelName(""); setNewLevelPoints("1"); setNewLevelDisplayCount("");
  };

  const handleSelectQuestion = (originalIndex) => {
    setSelectedQuestions(prev => { const newSet = new Set(prev); newSet.has(originalIndex) ? newSet.delete(originalIndex) : newSet.add(originalIndex); return newSet; });
  };

  const handleSelectLevel = (levelQuestions) => {
    const allIds = levelQuestions.map(q => q.originalIndex);
    const areAllSelected = allIds.length > 0 && allIds.every(id => selectedQuestions.has(id));
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (areAllSelected) allIds.forEach(id => newSet.delete(id)); else allIds.forEach(id => newSet.add(id));
      return newSet;
    });
  };

  const handleBulkMoveAction = () => {
    if (selectedQuestions.size === 0 || !targetLevelForMove) return;
    const newLevel = targetLevelForMove === 'no_level' ? "" : targetLevelForMove;
    if (onReorderQuestions) onReorderQuestions(Array.from(selectedQuestions), newLevel, null);
    setSelectedQuestions(new Set()); setTargetLevelForMove("");
  };

  const handleDragStart = (e, index) => {
    setExpandedQuestions(prev => { const newSet = new Set(prev); newSet.delete(index); return newSet; });
    let dragIndices = selectedQuestions.has(index) ? Array.from(selectedQuestions) : [index];
    if(!selectedQuestions.has(index)) setSelectedQuestions(new Set([index])); 
    e.dataTransfer.setData("draggedIndices", JSON.stringify(dragIndices));
    e.dataTransfer.effectAllowed = "move";
    const dragIcon = document.createElement('div');
    dragIcon.innerHTML = `📦 ${dragIndices.length} питань`;
    dragIcon.className = "drag-ghost"; 
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 10, 10);
    setTimeout(() => document.body.removeChild(dragIcon), 0);
  };

  const handleDragOverLevel = (e, levelName) => { e.preventDefault(); setDragOverLevel(levelName); setDragOverQuestion(null); };
  const handleDragOverQuestion = (e, qIndex) => { e.preventDefault(); e.stopPropagation(); setDragOverLevel(null); setDragOverQuestion(qIndex); };

  const handleDropOnLevel = (e, targetLevelName) => {
    e.preventDefault(); e.stopPropagation(); setDragOverLevel(null); setDragOverQuestion(null);
    const indicesStr = e.dataTransfer.getData("draggedIndices"); if(!indicesStr) return;
    const newLevel = targetLevelName === 'Без рівня' ? "" : targetLevelName;
    if(onReorderQuestions) onReorderQuestions(JSON.parse(indicesStr), newLevel, null);
    setSelectedQuestions(new Set());
  };

  const handleDropOnQuestion = (e, targetIndex, targetLevelName) => {
    e.preventDefault(); e.stopPropagation(); setDragOverLevel(null); setDragOverQuestion(null);
    const indicesStr = e.dataTransfer.getData("draggedIndices"); if(!indicesStr) return;
    const newLevel = targetLevelName === 'Без рівня' ? "" : targetLevelName;
    if(onReorderQuestions) onReorderQuestions(JSON.parse(indicesStr), newLevel, targetIndex);
    setSelectedQuestions(new Set());
  };

  const openDeleteModal = (index) => { setDeleteTargetIndex(index); setIsModalOpen(true); };
  const handleConfirmDelete = () => { if (deleteTargetIndex !== null) onDeleteQuestion(deleteTargetIndex); setIsModalOpen(false); };
  const handleConfirmBulkDelete = () => {
    const idsToDelete = Array.from(selectedQuestions).sort((a, b) => b - a);
    if(onDeleteMultipleQuestions) onDeleteMultipleQuestions(idsToDelete); else idsToDelete.forEach(id => onDeleteQuestion(id));
    setSelectedQuestions(new Set()); setIsBulkDeleteModalOpen(false);
  };

  const renderLevelForm = (isEditing = false) => (
    <div className="preview-create-level-form" onClick={(e) => e.stopPropagation()}>
        <input type="text" className="preview-input-name" placeholder={t('testCreationPreview.levelNamePlaceholder', 'Назва рівня')} value={newLevelName} onChange={e => setNewLevelName(e.target.value)} autoFocus />
        <div className="preview-points-wrapper"><label className="preview-points-label">Бали:</label><input type="number" className="preview-input-points" step="0.1" min="0" value={newLevelPoints} onChange={e => setNewLevelPoints(e.target.value)} /></div>
        <div className="preview-points-wrapper"><label className="preview-points-label">Ліміт (опц.):</label><input type="number" className="preview-input-points" step="1" min="1" placeholder="Всі" value={newLevelDisplayCount} onChange={e => setNewLevelDisplayCount(e.target.value)} /></div>
        <button onClick={handleSaveLevel} className="preview-btn-save">{isEditing ? t('testCreationPreview.update', 'Оновити') : t('testCreationPreview.save', 'Зберегти')}</button>
        <button onClick={closeAllLevelForms} className="preview-btn-cancel">{t('testCreationPreview.cancel', 'Скасувати')}</button>
    </div>
  );

  const handleEditLevelClick = (level) => {
    closeAllLevelForms(); setEditingLevelName(level.name); setNewLevelName(level.name);
    setNewLevelPoints(String(level.points)); setNewLevelDisplayCount(level.questionsLimit ? String(level.questionsLimit) : "");
  };

  const handleSaveLevel = () => {
    if (!newLevelName.trim()) return;
    const isDuplicate = levels.some(l => l.name.toLowerCase() === newLevelName.trim().toLowerCase() && l.name !== editingLevelName);
    if (isDuplicate) { alert(t('testCreationPreview.levelExists', 'Рівень з такою назвою вже існує!')); return; }
    const levelData = { name: newLevelName.trim(), points: parseFloat(newLevelPoints) || 1, questionsLimit: newLevelDisplayCount ? parseInt(newLevelDisplayCount, 10) : null };
    if (editingLevelName) onEditLevel(editingLevelName, levelData); else onAddLevel(levelData);
    closeAllLevelForms();
  };

  const renderQuestionDetails = (q) => {
    if (q.questionType === 'SINGLE_CHOICE' || q.questionType === 'MULTIPLE_CHOICE') {
      return (
        <div className="q-preview-options">
          {q.choiceOptions?.map((opt, i) => (
            <div key={i} className={`q-preview-opt ${opt.isCorrect ? 'correct' : ''}`}>
              <FontAwesomeIcon icon={opt.isCorrect ? faCheck : faCircle} style={{ color: opt.isCorrect ? '#28a745' : '#ccc', width: '14px' }} />
              <span>{opt.optionText}</span>
            </div>
          ))}
        </div>
      );
    }
    if (q.questionType === 'TEXT') return <div><b>Правильна відповідь:</b> {q.textAnswer?.correctText || 'Не задано'}</div>;
    if (q.questionType === 'CODE') return (<div><div><b>Мова:</b> {q.codeAnswer?.language || 'java'}</div><div className="q-preview-code">{q.codeAnswer?.templateCode || '// Немає шаблону'}</div></div>);
    return <div style={{ color: '#aaa' }}>Прев'ю недоступне</div>;
  };

  const groupedQuestions = {}; levels.forEach(l => { groupedQuestions[l.name] = []; }); groupedQuestions['Без рівня'] = [];
  questions.forEach((q, index) => { const lvlName = q.level && levels.some(l => l.name === q.level) ? q.level : 'Без рівня'; groupedQuestions[lvlName].push({ ...q, originalIndex: index }); });

  return (
    <div className="testCreationMainPreview" onDragLeave={() => {setDragOverLevel(null); setDragOverQuestion(null)}}>
      <div className='container'>
        
        {selectedQuestions.size > 0 && (
          <div className="bulk-actions-panel">
            <span className="bulk-count-text">Вибрано: {selectedQuestions.size}</span>
            <div className="bulk-controls">
              <select value={targetLevelForMove} onChange={(e) => setTargetLevelForMove(e.target.value)} className="bulk-select-level">
                <option value="" disabled>Перемістити в...</option>
                <option value="no_level">Без рівня</option>
                {levels.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
              </select>
              <button className="bulk-btn-move" onClick={handleBulkMoveAction} disabled={!targetLevelForMove}><FontAwesomeIcon icon={faFolderTree} /> {t('testCreationPreview.move', 'Перемістити')}</button>
              <button className="bulk-btn-delete" onClick={() => setIsBulkDeleteModalOpen(true)}><FontAwesomeIcon icon={faTrashCan} /> {t('testCreationPreview.delete', 'Видалити')}</button>
              <button className="bulk-btn-cancel" onClick={() => setSelectedQuestions(new Set())}><FontAwesomeIcon icon={faXmark} /> {t('testCreationPreview.cancel', 'Скасувати')}</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button className="preview-add-level-btn" style={{flex: 1, textAlign: 'center', borderColor: '#8e24aa', color: '#8e24aa'}} onClick={onOpenAiModal}>
                <FontAwesomeIcon icon={faRobot} className="icon-plus-margin" /> AI Генерація
            </button>
            <button className="preview-add-level-btn" style={{flex: 1, textAlign: 'center', borderColor: '#2e7d32', color: '#2e7d32'}} onClick={onOpenImportModal}>
                <FontAwesomeIcon icon={faFileImport} className="icon-plus-margin" /> Імпорт з файлу
            </button>
            {!isCreatingTopLevel ? (
                <button className="preview-add-level-btn" style={{flex: 1, textAlign: 'center'}} onClick={() => {closeAllLevelForms(); setIsCreatingTopLevel(true);}}>
                    <FontAwesomeIcon icon={faPlus} className="icon-plus-margin" /> {t('testCreationPreview.createLevel', 'Створити рівень')}
                </button>
            ) : (
                <div style={{width: '100%'}}>{renderLevelForm(false)}</div>
            )}
        </div>

        {questions.length === 0 && levels.length === 0 && (
            <h2 className={`preview-no-questions ${showError ? 'error' : ''}`}>{t('testCreationPreview.noQuestionsOrLevels', 'Немає доданих питань або рівнів')}</h2>
        )}

        {Object.keys(groupedQuestions).map((levelName) => {
          const items = groupedQuestions[levelName];
          const isNoLevel = levelName === 'Без рівня';
          const isCollapsed = collapsedLevels.has(levelName);
          if (isNoLevel && items.length === 0 && levels.length > 0) return null;

          const levelData = levels.find(l => l.name === levelName);
          const isAllLevelSelected = items.length > 0 && items.every(q => selectedQuestions.has(q.originalIndex));
          const isCurrentlyEditingThis = editingLevelName === levelName && !isNoLevel;

          return (
            <React.Fragment key={levelName}>
              <div 
                className={`preview-level-group ${dragOverLevel === levelName ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOverLevel(e, levelName)}
                onDrop={(e) => handleDropOnLevel(e, levelName)}
              >
                {isCurrentlyEditingThis ? (
                    <div style={{padding: '10px', background: '#fff', border: '1px solid #dcdcdc', borderRadius: '8px 8px 0 0'}}>
                      {renderLevelForm(true)}
                    </div>
                ) : (
                  <div className={`preview-level-title ${isNoLevel ? 'no-level-header' : ''}`} onClick={(e) => toggleLevelCollapse(e, levelName)}>
                    <div className="level-title-left">
                      {items.length > 0 && (<input type="checkbox" className="level-checkbox" checked={isAllLevelSelected} onChange={() => handleSelectLevel(items)} onClick={(e) => e.stopPropagation()} />)}
                      <button className="collapse-btn"><FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronDown} className="collapse-icon" /></button>
                      <span className="level-name-text">{isNoLevel ? t('testCreationPreview.noLevel', 'Питання без рівня') : levelName}</span>
                      <span className="preview-level-points-info">({t('testCreationPreview.points', 'Балів')}: {levelData?.points || 1} {levelData?.questionsLimit ? ` | Рандом: ${levelData.questionsLimit} з ${items.length}` : ''})</span>
                    </div>
                    {!isNoLevel && (
                      <div className="level-title-right" onClick={(e) => e.stopPropagation()}>
                          <button className="icon-btn" onClick={() => handleEditLevelClick(levelData)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                          <button className="icon-btn" onClick={() => onDeleteLevel(levelName)}><FontAwesomeIcon icon={faTrashCan} /></button>
                      </div>
                    )}
                  </div>
                )}

                {!isCollapsed && (
                  <div className="preview-level-items">
                    {items.length === 0 ? (
                        <div className="preview-level-empty-msg">Перетягніть питання сюди...</div>
                    ) : (
                        items.map((q) => {
                          const isExpanded = expandedQuestions.has(q.originalIndex);
                          const isSelected = selectedQuestions.has(q.originalIndex);
                          
                          return (
                            <div 
                              key={q.originalIndex} 
                              className={`preview-list-item-container ${isSelected ? 'selected' : ''} ${dragOverQuestion === q.originalIndex ? 'drop-target' : ''}`}
                              draggable onDragStart={(e) => handleDragStart(e, q.originalIndex)} onDragOver={(e) => handleDragOverQuestion(e, levelName, q.originalIndex)} onDrop={(e) => handleDropOnQuestion(e, q.originalIndex, levelName)}
                            >
                              <div className="preview-list-item" onClick={() => toggleQuestionExpand(q.originalIndex)}>
                                  <div className="preview-item-left">
                                    <input type="checkbox" className="item-checkbox" checked={isSelected} onChange={() => handleSelectQuestion(q.originalIndex)} onClick={(e) => e.stopPropagation()} />
                                    <FontAwesomeIcon icon={faBars} className="icon-drag" style={{cursor: 'grab'}} />
                                    <span className="q-number">#{q.originalIndex + 1}</span>
                                    <span className="q-text">{q.questionText}</span>
                                  </div>
                                  <div className="preview-item-right" onClick={e => e.stopPropagation()}>
                                    <button className="btn-edit-list" onClick={() => onEditQuestion(q.originalIndex)}><FontAwesomeIcon icon={faPenToSquare} className="btn-icon-margin" /> {t('testCreationPreview.edit', 'Редагувати')}</button>
                                    <button className="btn-delete-list" onClick={() => openDeleteModal(q.originalIndex)}><FontAwesomeIcon icon={faTrashCan} className="btn-icon-margin" /> {t('testCreationPreview.delete', 'Видалити')}</button>
                                  </div>
                              </div>
                              {isExpanded && (<div className="question-preview-content">{renderQuestionDetails(q)}</div>)}
                            </div>
                          );
                        })
                    )}
                  </div>
                )}
                
                {!isCollapsed && (
                   <div className="quick-add-zone">
                      <div className="quick-add-line"></div>
                      <button className="quick-add-btn" onClick={() => { if(onAddQuestionClick) onAddQuestionClick(isNoLevel ? "" : levelName); }}>
                          <FontAwesomeIcon icon={faPlus} /> Додати питання
                      </button>
                      <button className="quick-add-btn" onClick={() => {closeAllLevelForms(); setCreatingLevelBelow(levelName);}}>
                          <FontAwesomeIcon icon={faFolderTree} /> Створити рівень
                      </button>
                   </div>
                )}
              </div>

              {creatingLevelBelow === levelName && (
                  <div style={{marginBottom: '24px'}}>{renderLevelForm(false)}</div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <ConfirmDeleteQuestionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} questionNumber={deleteTargetIndex !== null ? deleteTargetIndex + 1 : ''} />
      <ConfirmDeleteQuestionModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={handleConfirmBulkDelete} questionNumber={`цих ${selectedQuestions.size} питань`} />
    </div>
  );
};

export default TestCreationMainPreview;