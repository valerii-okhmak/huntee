import React, { useState, useEffect } from 'react'; 
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';

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

  const isSaveDisabled =
    text === (profileData?.about || "") &&
    (link === "" || url === "");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      
      <button className="modal-close" onClick={onClose} aria-label="Закрити">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z"/>
        </svg>
      </button>

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
      <button
        className={`modal-button modal-button-submit ${isSaveDisabled ? "disabled" : "active"}`}
        disabled={isSaveDisabled}
        onClick={() => !isSaveDisabled && updateAbout(text)}
      >
        Зберегти
      </button>
      </div>
    </Modal>
  );
};

export default AdditionalInfoModal;
