import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';
import './ModalWindow.css';

const DEFAULT_AVATAR = '/img/avatar.png'; 

const EditProfileModal = ({ isOpen, onClose, profileData, fetchProfile }) => {
  const { t } = useTranslation();
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
      await axios.post(`/api/profile/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
    } catch (error) {
      console.error('Помилка завантаження аватара:', error);
    }
  };

  const updateData = async () => {
    try {
      const token = getAccessToken();
      const headers = { 'Authorization': `Bearer ${token}` };

      const promises = [];
      if (firstName !== profileData?.firstName) {
        promises.push(axios.patch(`/api/profile/first-name`, { firstName }, { headers }));
      }
      if (lastName !== profileData?.lastName) {
        promises.push(axios.patch(`/api/profile/last-name`, { lastName }, { headers }));
      }
      if (birthDate !== profileData?.birthDate) {
        promises.push(axios.patch(`/api/profile/birth-date`, { birthDate }, { headers }));
      }
      
      await Promise.all(promises);
      await uploadAvatar();

      fetchProfile && fetchProfile();
      onClose();
    } catch (error) {
      console.error('Помилка оновлення профілю:', error);
    }
  };

  const isSaveDisabled =
    firstName === (profileData?.firstName || '') &&
    lastName === (profileData?.lastName || '') &&
    birthDate === (profileData?.birthDate || '') &&
    !selectedAvatarFile;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="ep-modern-content">
        
        <div className="ep-modern-header">
          <h2 className="ep-modern-title">{t('editProfileModal.title', 'Особисті дані')}</h2>
          <button className="modal-close" onClick={onClose} aria-label={t('inviteModal.close', 'Закрити')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z" />
            </svg>
          </button>
        </div>

        <p className="ep-modern-subtitle">Оновіть своє фото та особисту інформацію.</p>

        <div className="ep-modern-avatar-section">
          <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            onChange={handleAvatarChange}
            className="ep-modern-hidden-input"
          />
          <label htmlFor="avatarUpload" className="ep-modern-avatar-label">
            <img src={avatarPreview} alt="Аватар" className="ep-modern-avatar-img" />
            <div className="ep-modern-avatar-overlay">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              <span>Змінити</span>
            </div>
          </label>
        </div>

        <div className="ep-modern-form">
          <div className="ep-modern-form-row">
            <div className="ep-modern-input-group">
              <label>{t('editProfileModal.firstName', "Ім'я")}</label>
              <input
                type="text"
                placeholder={t('editProfileModal.placeholders.firstName', "Введіть ім'я")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="ep-modern-input-group">
              <label>{t('editProfileModal.lastName', 'Прізвище')}</label>
              <input
                type="text"
                placeholder={t('editProfileModal.placeholders.lastName', 'Введіть прізвище')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="ep-modern-input-group">
            <label>{t('editProfileModal.birthDate', 'Дата народження')}</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
        </div>

        <div className="ep-modern-footer">
          <button
            className={`ep-modern-save-btn ${isSaveDisabled ? "disabled" : ""}`}
            disabled={isSaveDisabled}
            onClick={() => !isSaveDisabled && updateData()}
          >
            {t('editProfileModal.save', 'Зберегти зміни')}
          </button>
        </div>

      </div>
    </Modal>
  );
};

export default EditProfileModal;