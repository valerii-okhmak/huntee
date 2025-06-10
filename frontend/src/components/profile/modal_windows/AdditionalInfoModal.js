import React, { useState, useEffect } from 'react'; // Видалено 'use', оскільки він не використовувався
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';

const AdditionalInfoModal = ({ isOpen, onClose, profileData, fetchProfile, fetchMediaLinks }) => {
  const [text, setText] = useState('');
  const [link, setLink] = useState(''); // Це буде 'name' для посилання, наприклад 'Instagram'
  const [url, setUrl] = useState('');   // Це буде сама URL-адреса

  useEffect(() => {
    if (isOpen) {
      setText(profileData?.about || '');
      // Скидаємо поля для посилання при кожному відкритті модального вікна
      setLink('');
      setUrl('');
    }
  }, [isOpen, profileData]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const updateAbout = async (newAboutText) => {
    try {
      const token = getAccessToken();

      if (newAboutText) {
      await axios.patch(
        `${process.env.REACT_APP_BACKEND}/api/profile/about?token=${encodeURIComponent(token)}`,
        newAboutText,
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );

      if (fetchProfile) {
        fetchProfile();
      }
    }

      // Запит на додавання нового посилання, якщо поля заповнені
      if (link && url) {
        // --- ОСНОВНЕ ВИПРАВЛЕННЯ ТУТ ---
        // Бекенд очікує об'єкт з полями `name` та `url`.
        const linkPayload = { type: link, url };

        await axios.post(
          `${process.env.REACT_APP_BACKEND}/api/profile/links?token=${encodeURIComponent(token)}`,
          linkPayload, // Надсилаємо виправлений об'єкт
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (fetchMediaLinks) {
          fetchMediaLinks();
        }
      }

      onClose(); // Закрити модальне вікно після успішного виконання

    } catch (error) {
      console.error('Сервер повернув помилку:', error);
      // Можна додати сповіщення для користувача про помилку
    }
  };

  const handleSelect = (e) => {
    const selectedValue = e.target.value;
    setLink(selectedValue);
  };

  const options = [
    'Instagram', 'LinkedIn', 'GitHub', 'Telegram', 'YouTube', 'Facebook',
    'X', 'Twitch', 'TikTok', 'Gmail', 'Discord', 'WhatsApp'
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
              ? 'Додайте кілька коротких подробиць про себе...'
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
          onChange={handleSelect} // Видалено зайвий onSelect, onChange достатньо
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
            placeholder={`Введіть посилання на ${link}, наприклад: https://...`}
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