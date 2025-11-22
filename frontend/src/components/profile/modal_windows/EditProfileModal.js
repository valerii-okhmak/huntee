import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';

const DEFAULT_AVATAR = '/img/avatar.png'; 

const EditProfileModal = ({ isOpen, onClose, profileData, fetchProfile }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);

  useEffect(() => {
    if (isOpen && profileData) {
      setFirstName(profileData.firstName || '');
      setLastName(profileData.lastName || '');
      setBirthDate(profileData.birthDate || '');
      setAvatarPreview(profileData.profileImage ? profileData.profileImage : DEFAULT_AVATAR);
      setSelectedAvatarFile(null);
    }
  }, [isOpen, profileData]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); 
    }
  };

  const uploadAvatar = async () => {
    if (!selectedAvatarFile) return;

    try {
      const token = getAccessToken();
      const formData = new FormData();
      formData.append('file', selectedAvatarFile);

      await axios.post(`${process.env.REACT_APP_BACKEND}/api/profile/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
    } catch (error) {
      console.error('Помилка завантаження аватара:', error.response?.data || error.message);
    }
  };

  const updateData = async () => {
    try {
      const token = getAccessToken();

      if (firstName) {
        await axios.patch(`${process.env.REACT_APP_BACKEND}/api/profile/first-name`, { firstName }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (lastName) {
        await axios.patch(`${process.env.REACT_APP_BACKEND}/api/profile/last-name`, { lastName }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (birthDate) {
        await axios.patch(`${process.env.REACT_APP_BACKEND}/api/profile/birth-date`, { birthDate }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      await uploadAvatar();

      fetchProfile && fetchProfile();
      onClose();
    } catch (error) {
      console.error('Помилка оновлення профілю:', error.response?.data || error.message);
    }
  };

  // Кнопка активна, якщо хоча б одне поле змінилось або обрано аватар
  const isSaveDisabled =
    firstName === (profileData?.firstName || '') &&
    lastName === (profileData?.lastName || '') &&
    birthDate === (profileData?.birthDate || '') &&
    !selectedAvatarFile;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>

      <button className="modal-close" onClick={onClose} aria-label="Закрити">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z"/>
        </svg>
      </button>

      <h3 className="modal-title">Редагувати профіль</h3>

      <div className="modal-photo-section">
        <div className="change-photo-container">
          <img
            src={avatarPreview}
            alt="Аватар"
            className="profile-avatar"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1px solid #ccc',
            }}
          />
        </div>
        <input
          type="file"
          id="avatarUpload"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden-file-input"
        />
        <label htmlFor="avatarUpload" className="modal-photo-link">
          Змінити фото
        </label>
      </div>

      <div className="full-width-line"></div>

      <div className="modal-info-section">
        <label className="modal-label-subinfo">Ім'я</label>
        <input
          type="text"
          className="modal-info-input"
          placeholder="Ім'я"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div className="full-width-line"></div>

      <div className="modal-info-section">
        <label className="modal-label-subinfo">Прізвище</label>
        <input
          type="text"
          className="modal-info-input"
          placeholder="Прізвище"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <div className="full-width-line"></div>

      <div className="modal-info-section">
        <label className="modal-label-subinfo">Дата народження</label>
        <input
          type="date"
          className="modal-info-input modal-calendar"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <div className="full-width-line"></div>

      <div className="modal-buttons">
        <button
          className={`modal-button modal-button-submit ${isSaveDisabled ? "disabled" : ""}`}
          disabled={isSaveDisabled}
          onClick={() => !isSaveDisabled && updateData()}
        >
          Зберегти
        </button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
