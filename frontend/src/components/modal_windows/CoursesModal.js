import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';

const CoursesModal = ({ isOpen, onClose, fetchSertificates, sertificatesData }) => {

  const [description, setDescription] = useState('');
  const [course_name, setCourseName] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCourseName('');
      setCertificateUrl('');
      setDescription('');
    }
  }, [isOpen, sertificatesData]);

  const handleSave = async () => {
    try {
      const token = getAccessToken();

      const body = {
        course_name,
        certificateUrl,
        description,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/profile/courses`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      console.log('Сертифікат збережено:', response.data);

      if (fetchSertificates) {
        fetchSertificates(); 
      }

      onClose(); 
    } catch (error) {
      console.error('Помилка збереження сертифікату:', error.response?.data || error.message);
    }
  };

  // Логіка активації кнопки
  const isSaveDisabled =
    !course_name.trim() || !certificateUrl.trim() || !description.trim();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>

      <button className="modal-close" onClick={onClose} aria-label="Закрити">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z"/>
        </svg>
      </button>

      <h3 className="modal-title">Додайте сертифікат</h3>

      <div className="modal-section">
        <label className="modal-label">Назва</label>
        <input
          type="text"
          className="modal-input"
          placeholder="Наприклад: React Developer"
          value={course_name}
          onChange={(e) => setCourseName(e.target.value)}
        />
      </div>

      <div className="modal-section">
        <label className="modal-label">Посилання на сертифікат</label>
        <input
          type="text"
          className="modal-input"
          placeholder="https://..."
          value={certificateUrl}
          onChange={(e) => setCertificateUrl(e.target.value)}
        />
      </div>

      <div className="modal-section">
        <label className="modal-label">Опис</label>
        <textarea
          className="modal-textarea"
          placeholder="Короткий опис сертифікату"
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
          Зберегти
        </button>
      </div>
    </Modal>
  );
};

export default CoursesModal;
