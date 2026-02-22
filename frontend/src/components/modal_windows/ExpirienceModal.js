import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';

const ExperienceModal = ({ isOpen, onClose, fetchExperience, experienceData }) => {
  const { t } = useTranslation();
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setProjectName('');
      setProjectUrl('');
      setDescription('');
    }
  }, [isOpen, experienceData]);

  const handleSave = async () => {
    try {
      const token = getAccessToken();

      const body = { projectName, projectUrl, description };

      const response = await axios.post(
        `/api/profile/experiences`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      console.log('Проєкт збережено:', response.data);

      if (fetchExperience) fetchExperience();
      onClose();
    } catch (error) {
      console.error('Помилка збереження проєкту:', error.response?.data || error.message);
    }
  };

  const isSaveDisabled = !projectName.trim() || !projectUrl.trim() || !description.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>

      <button className="modal-close" onClick={onClose} aria-label={t('experienceModal.close')}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z"/>
        </svg>
      </button>

      <h3 className="modal-title">{t('experienceModal.title')}</h3>

      <div className="modal-section">
        <label className="modal-label">{t('experienceModal.labels.name')}</label>
        <input
          type="text"
          className="modal-input"
          placeholder={t('experienceModal.placeholders.name')}
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <div className="modal-section">
        <label className="modal-label">{t('experienceModal.labels.link')}</label>
        <input
          type="text"
          className="modal-input"
          placeholder="https://..."
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
        />
      </div>

      <div className="modal-section">
        <label className="modal-label">{t('experienceModal.labels.desc')}</label>
        <textarea
          className="modal-textarea"
          placeholder={t('experienceModal.placeholders.desc')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="modal-buttons">
      <button
        className={`modal-button modal-button-submit ${isSaveDisabled ? "disabled" : "active"}`}
        disabled={isSaveDisabled}
        onClick={() => !isSaveDisabled && handleSave()}
      >
        {t('experienceModal.save')}
      </button>
      </div>
    </Modal>
  );
};

export default ExperienceModal;