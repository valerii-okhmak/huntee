import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ModalMini from './ModalMini';
import './ModalWindow.css';

// ДОДАНО: проп existingLevels
const ImportQuestionsModal = ({ isOpen, onClose, onImport, existingLevels = [] }) => {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [points, setPoints] = useState('1');
  const [level, setLevel] = useState(""); // ДОДАНО: стейт для рівня

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setPoints('1');
      setLevel(""); // Очищаємо рівень при відкритті
    }
  }, [isOpen]);

  // Логіка блокування балів, якщо рівень обрано
  const selectedLevelData = existingLevels.find(l => l.name === level);
  const isPointsLocked = !!selectedLevelData;

  const handleLevelChange = (e) => {
    const val = e.target.value;
    setLevel(val);
    
    // Якщо вибрано існуючий рівень, підтягуємо його вагу
    const lvl = existingLevels.find(l => l.name === val);
    if (lvl) {
      setPoints(String(lvl.points));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePointsChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setPoints(val);
    }
  };

  const handleSubmit = () => {
    if (!file) return;
    
    // ДОДАНО: передаємо рівень третім параметром (і заблоковані бали, якщо треба)
    const finalPoints = isPointsLocked ? selectedLevelData.points : points;
    onImport(file, finalPoints, level || null); 
    onClose();
  };

  const isSubmitDisabled = !file;

  return (
    <ModalMini 
      isOpen={isOpen} 
      onClose={onClose} 
      contentClassName="import-modal-half-width"
    >
      <button className="modal-close" onClick={onClose}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z"/>
        </svg>
      </button>

      <div className='import-modal'>
        <h3 className="modal-title" style={{ textAlign: 'center', fontSize: '32px', fontWeight: '700', marginBottom: '40px' }}>
          {t('testCreationCreator.importModalTitle', 'Імпорт питань')}
        </h3>

        {/* НОВА СЕКЦІЯ: Вибір рівня */}
        <div className="modal-section level-section">
          <label className="modal-label">
            {t('testCreationCreator.levelLabel', 'Рівень (опціонально)')}
          </label>
          <div className="modal-controls">
            <select
              value={level}
              onChange={handleLevelChange}
              className="points-input-mini" 
              style={{ cursor: 'pointer', width: '100%' }}
            >
              <option value="">{t('testCreationCreator.noLevel', 'Без рівня')}</option>
              {existingLevels.map((lvl, index) => (
                <option key={index} value={lvl.name}>
                  {lvl.name} (Балів: {lvl.points})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Секція файлу */}
        <div className="modal-section file-section">
          <label className="modal-label">
            {t('testCreationCreator.fileLabel', 'Оберіть файл (.xml, .txt)')}
          </label>
          <div className="modal-controls">
            <div className="custom-file-wrapper">
              <label htmlFor="file-upload" className="custom-file-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                {t('testCreationCreator.chooseFileBtn', 'Вибрати файл')}
              </label>
              <span className="custom-file-name">
                {file ? file.name : t('testCreationCreator.noFileChosen', 'Файл не вибрано')}
              </span>
              <input id="file-upload" type="file" accept=".xml,.txt" onChange={handleFileChange} className="hidden-file-input" />
            </div>
          </div>
        </div>

        {/* Секція балів */}
        <div className="modal-section points-section">
          <label className="modal-label">
            {t('testCreationCreator.pointsLabel', 'Кількість балів за правильну відповідь')}
          </label>
          <div className="modal-controls">
            <input 
              type="number" 
              step="0.1" 
              min="0"
              value={isPointsLocked ? selectedLevelData.points : points} 
              onChange={handlePointsChange}
              className={`points-input-mini ${isPointsLocked ? 'disabled-points' : ''}`}
              disabled={isPointsLocked}
              style={{ width: '100%' }}
            />
            {isPointsLocked && (
              <span style={{ display: 'block', marginTop: '4px', color: '#888', fontSize: '12px' }}>
                Синхронізовано з рівнем
              </span>
            )}
          </div>
        </div>

        {/* Кнопка дії */}
        <div className="modal-buttons"> 
          <button
            className={`modal-button modal-button-submit ${isSubmitDisabled ? "disabled" : "active"}`}
            disabled={isSubmitDisabled}
            onClick={() => !isSubmitDisabled && handleSubmit()}
          >
            {t('testCreationCreator.importBtnLabel', 'Імпорт')}
          </button>
        </div>
      </div>
    </ModalMini>
  );
};

export default ImportQuestionsModal;