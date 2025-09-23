import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';

const ExperienceModal = ({ isOpen, onClose, fetchExperience, experienceData }) => {
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

      const body = {
        projectName,
        projectUrl,
        description,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/profile/experiences?token=${encodeURIComponent(token)}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Проєкт збережено:', response.data);

      if (fetchExperience) {
        fetchExperience(); // оновити список досвіду
      }

      onClose(); // закрити модалку
    } catch (error) {
      console.error('Помилка збереження проєкту:', error.response?.data || error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">Додайте проєкт</h3>

      <div className="modal-section">
        <label className="modal-label">Назва</label>
        <input
          type="text"
          className="modal-input"
          placeholder="Наприклад: My Portfolio App"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <div className="modal-section">
        <label className="modal-label">Посилання на проєкт</label>
        <input
          type="text"
          className="modal-input"
          placeholder="https://..."
          value={projectUrl}
          onChange={(e) => setProjectUrl(e.target.value)}
        />
      </div>

      <div className="modal-section">
        <label className="modal-label">Опис</label>
        <textarea
          className="modal-textarea"
          placeholder="Короткий опис проєкту"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="modal-buttons">
        <button className="modal-button modal-button-cancel" onClick={onClose}>
          Скасувати
        </button>
        <button className="modal-button modal-button-submit" onClick={handleSave}>
          Зберегти
        </button>
      </div>
    </Modal>
  );
};

export default ExperienceModal;
