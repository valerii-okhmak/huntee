import React, { useState, useEffect } from 'react'; 
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
        `${process.env.REACT_APP_BACKEND}/api/profile/about`,
        { about: newAboutText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (fetchProfile) {
        fetchProfile();
      }
    }

      if (link && url) {
        const linkPayload = { type: link, url };

        await axios.post(
          `${process.env.REACT_APP_BACKEND}/api/profile/links`,
          linkPayload, 
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          }
        );

        if (fetchMediaLinks) {
          fetchMediaLinks();
        }
      }

      onClose(); 

    } catch (error) {
      console.error('Сервер повернув помилку:', error);
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
          onChange={handleSelect}
        >
          <option value="">Виберіть платформу</option>
          {options.map((option, index) => (
            <option className="modal-select-option" key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

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