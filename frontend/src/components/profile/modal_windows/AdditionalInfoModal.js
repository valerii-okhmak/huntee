import React, { useState, useEffect, use } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';

const AdditionalInfoModal = ({ isOpen, onClose, profileData, fetchProfile }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setText(profileData?.about || '');
    }
  }, [isOpen, profileData]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const updateAbout = async (newAboutText) => {
    try {
      const token = getAccessToken();

      const response = await axios.patch(
        `${process.env.REACT_APP_BACKEND}/api/profile/about?token=${encodeURIComponent(token)}`,
        newAboutText,
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );

      console.log('Оновлено успішно:', response.data);

      if (fetchProfile) {
        fetchProfile(); // передати оновлені дані батьку
      }

      onClose(); // закрити модалку

      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Сервер повернув помилку:', error.response.data);
      }
      throw error;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">Додаткова інформація</h3>

      <label className="modal-label">Про вас</label>

      <div className="modal-section">
        <textarea
          className="modal-textarea"
          placeholder={
            !profileData?.about
              ? 'Додайте кілька коротких подробиць про себе. Наприклад, чим Ви найбільше любите займатися? Якими досягненнями ви пишаєтеся найбільше? Що відрізняє Вас від інших кандидатів?.'
              : ''
          }
          value={text}
          onChange={handleChange}
        />
      </div>

      <div className="modal-buttons">
        <button className="modal-button modal-button-cancel" onClick={onClose}>
          Скасувати
        </button>
        <button
          className="modal-button modal-button-submit"
          onClick={() => updateAbout(text)}
        >
          Зберегти
        </button>
      </div>
    </Modal>
  );
};

export default AdditionalInfoModal;
