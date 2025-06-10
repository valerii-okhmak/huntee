import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axios from 'axios';
import { getAccessToken } from '../../../utils/auth';


const EditProfileModal = ({ isOpen, onClose, profileData, fetchProfile}) => {

     const [firstName, setFirstName] = useState('');
     const [lastName, setLastName] = useState('');
     const [birthDate, setBirthDate] = useState('');
    
      useEffect(() => {
        if (isOpen) {
            setFirstName(profileData?.firstName || '');
            setLastName(profileData?.lastName || '');
            setBirthDate(profileData?.birthDate || '');
        }
      }, [isOpen, profileData]);

  const updateData = async (newFirstName,newLastName,newBirthDate) => {
    try {
      const token = getAccessToken();
        if (newFirstName) {
            const response1 = await axios.patch(
                `${process.env.REACT_APP_BACKEND}/api/profile/first-name?token=${encodeURIComponent(token)}`,
                newFirstName,
                {
                headers: {
                    'Content-Type': 'text/plain',
                },
                }
            );
        }

        if (newLastName) {
            const response2 = await axios.patch(
                `${process.env.REACT_APP_BACKEND}/api/profile/last-name?token=${encodeURIComponent(token)}`,
                newLastName,
                {
                headers: {
                    'Content-Type': 'text/plain',
                },
                }
            );
        }

        if (newBirthDate) {
        const formattedDate = newBirthDate;

        await axios.patch(
            `${process.env.REACT_APP_BACKEND}/api/profile/birth-date?token=${encodeURIComponent(token)}`,
            formattedDate,
            {
            headers: {
                'Content-Type': 'text/plain',
            },
            }
        );
        }



      if (fetchProfile) {
        fetchProfile(); // передати оновлені дані батьку
      }

        console.log('Оновлено успішно профіль: ', {
            firstName: newFirstName,
            lastName: newLastName,
            birthDate: newBirthDate
        });
      onClose(); // закрити модалку
        } catch (error) {
        if (error.response) {
            console.error('Помилка від сервера:', error.response.status, error.response.data);
        } else {
            console.error('Помилка запиту:', error.message);
        }
        }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">Редагувати профіль</h3>

        <div className="modal-photo-section">
        <div className='change-photo-container'>
            {/* Ваш поточний контейнер для відображення фото, якщо є */}
        </div>
        {/* Прихований input для вибору файлу */}
        <input
            type="file"
            id="avatarUpload"
            accept="image/*"
            className="hidden-file-input" /* Додаємо клас для приховування */
        />
        {/* Label, який буде виглядати як посилання і активувати input */}
        <label htmlFor="avatarUpload" className="modal-photo-link">
            Змінити фото
        </label>
        </div>
      <div className='full-width-line'></div>
      <div className="modal-info-section">
        <label className="modal-label-subinfo">Ім'я</label>
        <input
          type="text"
          className="modal-info-input"
          placeholder={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className='full-width-line'></div>
            <div className="modal-info-section">
        <label className="modal-label-subinfo">Прізвище</label>
        <input
          type="text"
          className="modal-info-input"
          placeholder={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className='full-width-line'></div>
      <div className="modal-info-section">
        <label className="modal-label-subinfo">Дата народження</label>
        <input
          type="date"
          className="modal-info-input modal-calendar"
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>
      <div className='full-width-line'></div>

      <div className="modal-buttons">
        <button className="modal-button modal-button-cancel" onClick={onClose}>
          Скасувати
        </button>
        <button className="modal-button modal-button-submit" onClick={() => updateData(firstName, lastName, birthDate)}>
          Зберегти
        </button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
