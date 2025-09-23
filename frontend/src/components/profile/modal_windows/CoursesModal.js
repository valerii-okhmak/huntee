import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';

const CoursesModal = ({ isOpen, onClose, fetchSertificates, sertificatesData }) => {

  const [description, setDescription] = useState('');
  const [course_name, setCourseName] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');


  useEffect(() => {
    if (isOpen) {
      setCourseName('');
      setCertificateUrl('');
      setDescription( '');
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
        `${process.env.REACT_APP_BACKEND}/api/profile/courses?token=${encodeURIComponent(token)}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Сертифікат збережено:', response.data);

      if (fetchSertificates) {
        fetchSertificates(); // оновити список сертифікатів
      }

      onClose(); // закрити модалку
    } catch (error) {
      console.error('Помилка збереження сертифікату:', error.response?.data || error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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

export default CoursesModal;
