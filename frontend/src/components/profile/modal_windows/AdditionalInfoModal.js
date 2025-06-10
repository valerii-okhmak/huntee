import React, { useState, useEffect, use } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';

const AdditionalInfoModal = ({ isOpen, onClose, profileData, fetchProfile, fetchMediaLinks }) => {
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [url, setUrl] = useState('');

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

      const response1 = await axios.patch(
        `${process.env.REACT_APP_BACKEND}/api/profile/about?token=${encodeURIComponent(token)}`,
        newAboutText,
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );

      if (fetchProfile) {
        fetchProfile(); // передати оновлені дані батьку
      }

      if (link && url) {
      const response2 = await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/profile/links?token=${encodeURIComponent(token)}`,
        {link,url},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (fetchMediaLinks) {
        fetchMediaLinks(); // передати оновлені дані батьку
      }
    }
      onClose(); // закрити модалку

    } catch (error) {
      if (error) {
        console.error('Сервер повернув помилку:', error);
      }
      throw error;
    }
  };

const handleSelect = (e) => {
  const selectedValue = e.target.value;
  console.log('Selected:', selectedValue);
  setLink(selectedValue);
};

  const options = [
    'Instagram',
    'LinkedIn',
    'GitHub',
    'Telegram',
    'YouTube',
    'Facebook',
    'X',
    'Twitch',
    'TikTok',
    'Gmail',
    'Discord',
    'WhatsApp'
  ];

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

      <label className="modal-label">Додаткові посилання</label>

      <div className="modal-section">
        <select
          className="modal-select"
          value={link}
          onChange={handleSelect}
          onSelect={handleSelect}
        >
          <option value="">Виберіть платформу</option>
          {options.map((option, index) => (
            <option className="modal-select-option" key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Показати input, якщо вибрано платформу */}
      {link && (
        <div className="modal-section">
          <label className="modal-label">Посилання</label>
          <input
            type="text"
            className="modal-input"
            placeholder={`Введіть посилання на ${link} наприклад: https://`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      )}

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
