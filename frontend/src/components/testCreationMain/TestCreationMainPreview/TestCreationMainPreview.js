import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import './TestCreationMainPreview.css';
import ConfirmDeleteQuestionModal from "../../modal_windows/ConfirmDeleteQuestionModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faBars, faPlus, faChevronDown, faChevronRight, faFolderTree } from '@fortawesome/free-solid-svg-icons'; 

const TestCreationMainPreview = ({ 
  questions = [], 
  levels = [], 
  onAddLevel, 
  onEditLevel, 
  onDeleteLevel, 
  onDeleteQuestion, 
  onEditQuestion, 
  onMoveQuestionToLevel, 
  onDeleteMultipleQuestions, // <--- Новий проп для масового видалення
  showError 
}) => {
  const { t } = useTranslation();
  
  // --- Стани для рівнів ---
  const [isCreatingLevel, setIsCreatingLevel] = useState(false);
  const [editingLevelName, setEditingLevelName] = useState(null);
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelPoints, setNewLevelPoints] = useState("1");
  const [newLevelDisplayCount, setNewLevelDisplayCount] = useState("");
  
  // Стан для згортання/розгортання рівнів (зберігає імена згорнутих рівнів)
  const [collapsedLevels, setCollapsedLevels] = useState(new Set());

  // --- Стани для видалення ---
  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // --- Стани для масових дій ---
  const [selectedQuestions, setSelectedQuestions] = useState(new Set()); // Зберігає originalIndex вибраних питань
  const [targetLevelForMove, setTargetLevelForMove] = useState(""); // Для дропдауна масового переміщення

  // --- Логіка згортання ---
  const toggleLevelCollapse = (levelName) => {
    setCollapsedLevels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(levelName)) {
        newSet.delete(levelName);
      } else {
        newSet.add(levelName);
      }
      return newSet;
    });
  };

  // --- Масові дії (Чекбокси) ---
  const handleSelectQuestion = (originalIndex) => {
    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(originalIndex)) newSet.delete(originalIndex);
      else newSet.add(originalIndex);
      return newSet;
    });
  };

  const handleSelectLevel = (levelName, levelQuestions) => {
    const allIds = levelQuestions.map(q => q.originalIndex);
    const areAllSelected = allIds.every(id => selectedQuestions.has(id));

    setSelectedQuestions(prev => {
      const newSet = new Set(prev);
      if (areAllSelected) {
        allIds.forEach(id => newSet.delete(id)); // Знімаємо виділення
      } else {
        allIds.forEach(id => newSet.add(id)); // Виділяємо всі
      }
      return newSet;
    });
  };

  const handleBulkMove = () => {
    if (selectedQuestions.size === 0) return;
    const newLevel = targetLevelForMove === 'no_level' ? "" : targetLevelForMove;
    
    // Переміщуємо кожне питання (виклик батьківської функції)
    selectedQuestions.forEach(index => {
      if (onMoveQuestionToLevel) onMoveQuestionToLevel(index, newLevel);
    });
    
    // Очищаємо виділення після дії
    setSelectedQuestions(new Set());
    setTargetLevelForMove("");
  };

  const handleConfirmBulkDelete = () => {
    if (onDeleteMultipleQuestions) {
      // Конвертуємо Set у масив і сортуємо по спаданню (щоб індекси не зсувалися при видаленні)
      const idsToDelete = Array.from(selectedQuestions).sort((a, b) => b - a);
      onDeleteMultipleQuestions(idsToDelete);
    } else {
      // Фоллбек: якщо проп не передано, видаляємо по одному (не дуже безпечно для індексів)
      const idsToDelete = Array.from(selectedQuestions).sort((a, b) => b - a);
      idsToDelete.forEach(id => onDeleteQuestion(id));
    }
    
    setSelectedQuestions(new Set());
    setIsBulkDeleteModalOpen(false);
  };

  // --- Drag and Drop Logic (Одиночний) ---
  const handleDragStart = (e, originalIndex) => {
    e.dataTransfer.setData("questionIndex", originalIndex.toString());
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, targetLevelName) => {
    e.preventDefault();
    const questionIndex = parseInt(e.dataTransfer.getData("questionIndex"), 10);
    const newLevel = targetLevelName === 'Без рівня' ? "" : targetLevelName;

    if (onMoveQuestionToLevel) {
      onMoveQuestionToLevel(questionIndex, newLevel);
    }
  };

  // --- Логіка одиничного видалення та створення рівня ---
  const handleConfirmDelete = () => {
    if (deleteTargetIndex !== null) onDeleteQuestion(deleteTargetIndex);
    setIsModalOpen(false);
    setDeleteTargetIndex(null);
  };

  const openDeleteModal = (index) => {
    setDeleteTargetIndex(index);
    setIsModalOpen(true);
  };

  const handleEditLevelClick = (level) => {
    setEditingLevelName(level.name);
    setNewLevelName(level.name);
    setNewLevelPoints(String(level.points));
    setNewLevelDisplayCount(level.questionsLimit ? String(level.questionsLimit) : "");
    setIsCreatingLevel(true);
  };

  const handleSaveLevel = () => {
    if (!newLevelName.trim()) return;
    const isDuplicate = levels.some(l => l.name.toLowerCase() === newLevelName.trim().toLowerCase() && l.name !== editingLevelName);
    if (isDuplicate) {
        alert(t('testCreationPreview.levelExists', 'Рівень з такою назвою вже існує!'));
        return;
    }
    const levelData = { 
        name: newLevelName.trim(), 
        points: parseFloat(newLevelPoints) || 1,
        questionsLimit: newLevelDisplayCount ? parseInt(newLevelDisplayCount, 10) : null
    };
    if (editingLevelName) onEditLevel(editingLevelName, levelData);
    else onAddLevel(levelData);
    
    resetLevelForm();
  };

  const resetLevelForm = () => {
    setNewLevelName("");
    setNewLevelPoints("1");
    setNewLevelDisplayCount("");
    setEditingLevelName(null);
    setIsCreatingLevel(false);
  };

  // --- Групування питань ---
  const groupedQuestions = {};
  levels.forEach(l => { groupedQuestions[l.name] = []; });
  groupedQuestions['Без рівня'] = [];

  questions.forEach((q, index) => {
    const lvlName = q.level && levels.some(l => l.name === q.level) ? q.level : 'Без рівня';
    groupedQuestions[lvlName].push({ ...q, originalIndex: index });
  });

  return (
    <div className="testCreationMainPreview">
      <div className='container'>
        
        {/* Панель створення рівня */}
        <div className="preview-level-actions">
            {!isCreatingLevel ? (
                <button className="preview-add-level-btn" onClick={() => setIsCreatingLevel(true)}>
                    <FontAwesomeIcon icon={faPlus} className="icon-plus-margin" />
                    {t('testCreationPreview.createLevel', 'Створити рівень')}
                </button>
            ) : (
                <div className="preview-create-level-form">
                    <input 
                        type="text" 
                        placeholder={t('testCreationPreview.levelNamePlaceholder', 'Назва рівня (напр. Вступ)')}
                        value={newLevelName} 
                        onChange={e => setNewLevelName(e.target.value)}
                        className="preview-input-name"
                        autoFocus
                    />
                    <div className="preview-points-wrapper">
                        <label className="preview-points-label">Бали:</label>
                        <input 
                            type="number" step="0.1" min="0"
                            value={newLevelPoints} 
                            onChange={e => setNewLevelPoints(e.target.value)}
                            className="preview-input-points"
                        />
                    </div>
                    <div className="preview-points-wrapper">
                        <label className="preview-points-label">К-ть питань для показу (опц.):</label>
                        <input 
                            type="number" step="1" min="1" placeholder="Всі"
                            value={newLevelDisplayCount} 
                            onChange={e => setNewLevelDisplayCount(e.target.value)}
                            className="preview-input-points"
                        />
                    </div>
                    <button onClick={handleSaveLevel} className="preview-btn-save">
                        {editingLevelName ? t('testCreationPreview.update', 'Оновити') : t('testCreationPreview.save', 'Зберегти')}
                    </button>
                    <button onClick={resetLevelForm} className="preview-btn-cancel">
                        {t('testCreationPreview.cancel', 'Скасувати')}
                    </button>
                </div>
            )}
        </div>

        {/* Панель МАСОВИХ ДІЙ (з'являється, якщо вибрано >= 1 питання) */}
        {selectedQuestions.size > 0 && (
          <div className="bulk-actions-panel">
            <span className="bulk-count-text">
              Вибрано питань: {selectedQuestions.size}
            </span>
            <div className="bulk-controls">
              <select 
                value={targetLevelForMove} 
                onChange={(e) => setTargetLevelForMove(e.target.value)}
                className="bulk-select-level"
              >
                <option value="" disabled>Перемістити в рівень...</option>
                <option value="no_level">Без рівня</option>
                {levels.map(l => (
                  <option key={l.name} value={l.name}>{l.name}</option>
                ))}
              </select>
              <button 
                className="bulk-btn-move" 
                onClick={handleBulkMove}
                disabled={!targetLevelForMove}
              >
                <FontAwesomeIcon icon={faFolderTree} /> Перемістити
              </button>
              <button 
                className="bulk-btn-delete" 
                onClick={() => setIsBulkDeleteModalOpen(true)}
              >
                <FontAwesomeIcon icon={faTrashCan} /> Видалити
              </button>
              <button 
                className="bulk-btn-cancel" 
                onClick={() => setSelectedQuestions(new Set())}
              >
                Скасувати виділення
              </button>
            </div>
          </div>
        )}

        {questions.length === 0 && levels.length === 0 && (
            <h2 className={`preview-no-questions ${showError ? 'error' : ''}`}>
              {t('testCreationPreview.noQuestionsOrLevels', 'Немає доданих питань або рівнів')}
            </h2>
        )}

        {/* Рендер рівнів і питань */}
        {Object.keys(groupedQuestions).map((levelName) => {
          const items = groupedQuestions[levelName];
          const isNoLevel = levelName === 'Без рівня';
          if (isNoLevel && items.length === 0 && levels.length > 0) return null;

          const levelData = levels.find(l => l.name === levelName);
          const isCollapsed = collapsedLevels.has(levelName);
          
          // Перевірка чи всі питання в цьому рівні виділені
          const allLevelIds = items.map(q => q.originalIndex);
          const isAllLevelSelected = items.length > 0 && allLevelIds.every(id => selectedQuestions.has(id));

          return (
            <div 
              key={levelName} 
              className="preview-level-group"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, levelName)}
            >
              <div className={`preview-level-title ${isNoLevel ? 'no-level-header' : ''}`}>
                <div className="level-title-left">
                  {/* Чекбокс рівня для масового виділення */}
                  {items.length > 0 && (
                    <input 
                      type="checkbox"
                      className="level-checkbox"
                      checked={isAllLevelSelected}
                      onChange={() => handleSelectLevel(levelName, items)}
                      title="Вибрати всі питання рівня"
                    />
                  )}
                  
                  {/* Кнопка згортання */}
                  <button className="collapse-btn" onClick={() => toggleLevelCollapse(levelName)}>
                    <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronDown} />
                  </button>

                  <span className="level-name-text">{levelName}</span>
                  
                  {!isNoLevel && (
                    <span className="preview-level-points-info">
                      ({t('testCreationPreview.points', 'Балів')}: {levelData?.points} 
                      {levelData?.questionsLimit ? ` | Рандом: ${levelData.questionsLimit} з ${items.length}` : ''})
                    </span>
                  )}
                </div>

                {!isNoLevel && (
                  <div className="level-title-right">
                      <button className="icon-btn" onClick={() => handleEditLevelClick(levelData)} title={t('testCreationPreview.editLevel', 'Редагувати рівень')}>
                          <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button className="icon-btn" onClick={() => onDeleteLevel(levelName)} title={t('testCreationPreview.deleteLevel', 'Видалити рівень')}>
                          <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                  </div>
                )}
              </div>

              {/* Рендер питань (якщо не згорнуто) */}
              {!isCollapsed && (
                <div className="preview-level-items">
                  {items.length === 0 ? (
                      <div className="preview-level-empty-msg">
                          {t('testCreationPreview.emptyLevel', 'Перетягніть питання сюди...')}
                      </div>
                  ) : (
                      items.map((q) => (
                      <div 
                        key={q.originalIndex} 
                        className={`preview-list-item ${selectedQuestions.has(q.originalIndex) ? 'selected' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, q.originalIndex)}
                        onClick={(e) => {
                          // Дозволяємо клік по карточці для швидкого виділення (якщо не клікнули по кнопках)
                          if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'path' && e.target.tagName !== 'svg') {
                            handleSelectQuestion(q.originalIndex);
                          }
                        }}
                      >
                          <div className="preview-item-left">
                            <input 
                              type="checkbox"
                              className="item-checkbox"
                              checked={selectedQuestions.has(q.originalIndex)}
                              onChange={() => handleSelectQuestion(q.originalIndex)}
                              onClick={(e) => e.stopPropagation()} // Запобігаємо подвійному кліку
                            />
                            <FontAwesomeIcon icon={faBars} className="icon-drag" style={{cursor: 'grab'}} />
                            <span className="q-number">#{q.originalIndex + 1}</span>
                            <span className="q-text">{q.questionText}</span>
                          </div>

                          <div className="preview-item-right" onClick={e => e.stopPropagation()}>
                            <button className="btn-edit-list" onClick={() => onEditQuestion(q.originalIndex)}>
                                <FontAwesomeIcon icon={faPenToSquare} className="btn-icon-margin" /> 
                                {t('testCreationPreview.edit', 'Редагувати')}
                            </button>
                            <button className="btn-delete-list" onClick={() => openDeleteModal(q.originalIndex)}>
                                <FontAwesomeIcon icon={faTrashCan} className="btn-icon-margin" /> 
                                {t('testCreationPreview.delete', 'Видалити')}
                            </button>
                          </div>
                      </div>
                      ))
                  )}
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* Модалка одиничного видалення */}
      <ConfirmDeleteQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        questionNumber={deleteTargetIndex !== null ? deleteTargetIndex + 1 : ''}
      />

      {/* Модалка масового видалення (Можна використати ту саму компоненту, але з іншим текстом) */}
      <ConfirmDeleteQuestionModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        questionNumber={`цих ${selectedQuestions.size} питань`} // Хай буде такий текст для тесту
      />
    </div>
  );
};

export default TestCreationMainPreview;