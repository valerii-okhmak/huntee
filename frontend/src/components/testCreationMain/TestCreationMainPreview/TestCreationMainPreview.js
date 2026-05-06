import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import './TestCreationMainPreview.css';
import ConfirmDeleteQuestionModal from "../../modal_windows/ConfirmDeleteQuestionModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faBars, faPlus } from '@fortawesome/free-solid-svg-icons'; 

const TestCreationMainPreview = ({ questions = [], levels = [], onAddLevel, onEditLevel, onDeleteLevel, onDeleteQuestion, onEditQuestion, showError }) => {
  const { t } = useTranslation();
  const [deleteTargetIndex, setDeleteTargetIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isCreatingLevel, setIsCreatingLevel] = useState(false);
  const [editingLevelName, setEditingLevelName] = useState(null); // Стейт для збереження оригінальної назви при редагуванні
  
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelPoints, setNewLevelPoints] = useState("1");
  const [newLevelDisplayCount, setNewLevelDisplayCount] = useState(""); // Новий стейт для к-сті питань

  const handleConfirmDelete = () => {
    if (deleteTargetIndex !== null) {
      onDeleteQuestion(deleteTargetIndex);
    }
    setIsModalOpen(false);
    setDeleteTargetIndex(null);
  };

  const openDeleteModal = (index) => {
    setDeleteTargetIndex(index);
    setIsModalOpen(true);
  };

  // Відкриття форми в режимі редагування
  const handleEditLevelClick = (level) => {
    setEditingLevelName(level.name);
    setNewLevelName(level.name);
    setNewLevelPoints(String(level.points));
    setNewLevelDisplayCount(level.displayCount ? String(level.displayCount) : "");
    setIsCreatingLevel(true);
  };

  const handleSaveLevel = () => {
    if (!newLevelName.trim()) return;
    
    // Перевірка на дублікати (ігноруємо поточну назву, якщо ми її ж і редагуємо)
    const isDuplicate = levels.some(l => 
        l.name.toLowerCase() === newLevelName.trim().toLowerCase() && 
        l.name !== editingLevelName
    );

    if (isDuplicate) {
        alert(t('testCreationPreview.levelExists', 'Рівень з такою назвою вже існує!'));
        return;
    }
    
    const levelData = { 
        name: newLevelName.trim(), 
        points: parseFloat(newLevelPoints) || 1,
        displayCount: newLevelDisplayCount ? parseInt(newLevelDisplayCount, 10) : null
    };

    if (editingLevelName) {
        // Якщо редагуємо
        onEditLevel(editingLevelName, levelData);
    } else {
        // Якщо створюємо новий
        onAddLevel(levelData);
    }

    resetLevelForm();
  };

  const resetLevelForm = () => {
    setNewLevelName("");
    setNewLevelPoints("1");
    setNewLevelDisplayCount("");
    setEditingLevelName(null);
    setIsCreatingLevel(false);
  };

  const groupedQuestions = {};
  
  levels.forEach(l => {
    groupedQuestions[l.name] = [];
  });
  
  groupedQuestions['Без рівня'] = [];

  questions.forEach((q, index) => {
    const lvlName = q.level && levels.some(l => l.name === q.level) ? q.level : 'Без рівня';
    groupedQuestions[lvlName].push({ ...q, originalIndex: index });
  });

  return (
    <div className="testCreationMainPreview">
      <div className='container'>
        
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
                            type="number" 
                            step="0.1"
                            min="0"
                            value={newLevelPoints} 
                            onChange={e => setNewLevelPoints(e.target.value)}
                            className="preview-input-points"
                        />
                    </div>
                    <div className="preview-points-wrapper">
                        <label className="preview-points-label">К-ть питань для показу (опц.):</label>
                        <input 
                            type="number" 
                            step="1"
                            min="1"
                            placeholder="Всі"
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

        {questions.length === 0 && levels.length === 0 && (
            <h2 className={`preview-no-questions ${showError ? 'error' : ''}`}>
              {t('testCreationPreview.noQuestionsOrLevels', 'Немає доданих питань або рівнів')}
            </h2>
        )}

        {Object.keys(groupedQuestions).map((levelName) => {
          const items = groupedQuestions[levelName];
          const isNoLevel = levelName === 'Без рівня';
          
          if (isNoLevel && items.length === 0 && levels.length > 0) return null;

          const levelData = levels.find(l => l.name === levelName);

          return (
            <div key={levelName} className="preview-level-group">
              
              {!isNoLevel && (
                <div className="preview-level-title">
                  <div>
                      <span className="level-dot">•</span> {levelName} 
                      <span className="preview-level-points-info">
                          ({t('testCreationPreview.points', 'Балів')}: {levelData?.points} 
                          {levelData?.displayCount ? ` | Випадкових: ${levelData.displayCount} з ${items.length}` : ''})
                      </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="icon-btn" onClick={() => handleEditLevelClick(levelData)} title={t('testCreationPreview.editLevel', 'Редагувати рівень')}>
                          <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button className="icon-btn" onClick={() => onDeleteLevel(levelName)} title={t('testCreationPreview.deleteLevel', 'Видалити рівень')}>
                          <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                  </div>
                </div>
              )}
              
              <div className="preview-level-items">
                {items.length === 0 ? (
                    <div className="preview-level-empty-msg">
                        {t('testCreationPreview.emptyLevel', 'У цьому рівні ще немає питань. Вони з\'являться тут після додавання.')}
                    </div>
                ) : (
                    items.map((q) => (
                    <div key={q.originalIndex} className="preview-list-item">
                        <div className="preview-item-left">
                        <FontAwesomeIcon icon={faBars} className="icon-drag" />
                        <span className="q-number">#{q.originalIndex + 1}</span>

                        <span className="q-text">{q.questionText}</span>
                        </div>

                        <div className="preview-item-right">
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
            </div>
          );
        })}

      </div>

      <ConfirmDeleteQuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        questionNumber={deleteTargetIndex !== null ? deleteTargetIndex + 1 : ''}
      />
    </div>
  );
};

export default TestCreationMainPreview;