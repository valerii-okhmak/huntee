import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';

const DEFAULT_AVATAR = '/img/avatar.png'; // Виправлено шлях (краще починати з '/')

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

      if (profileData.profileImage) {
        setAvatarPreview(`${profileData.profileImage}`);
        console.log('Avatar URL:', `${process.env.REACT_APP_BACKEND}/api/profile/avatar/${profileData.profileImage}`);
      } 

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
      formData.append('token', token);

      await axios.post(`${process.env.REACT_APP_BACKEND}/api/profile/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error('Помилка завантаження аватара:', error.response?.data || error.message);
    }
  };

  const updateData = async () => {
    const token = getAccessToken();

    try {
      const updates = [];

      if (firstName) {
          await axios.patch(
            `${process.env.REACT_APP_BACKEND}/api/profile/first-name?token=${encodeURIComponent(token)}`,
            firstName,
            { headers: { 'Content-Type': 'text/plain' } }
          )
      }

      if (lastName) {
          await axios.patch(
            `${process.env.REACT_APP_BACKEND}/api/profile/last-name?token=${encodeURIComponent(token)}`,
            lastName,
            { headers: { 'Content-Type': 'text/plain' } }
          )
      }

      if (birthDate) {
          await axios.patch(
            `${process.env.REACT_APP_BACKEND}/api/profile/birth-date?token=${encodeURIComponent(token)}`,
            birthDate,
            { headers: { 'Content-Type': 'text/plain' } }
          )
      }


        await uploadAvatar();




      if (fetchProfile) fetchProfile();
      onClose();
    } catch (error) {
      console.error('Помилка оновлення профілю:', error.response?.data || error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
        <button className="modal-button modal-button-cancel" onClick={onClose}>
          Скасувати
        </button>
        <button className="modal-button modal-button-submit" onClick={updateData}>
          Зберегти
        </button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
