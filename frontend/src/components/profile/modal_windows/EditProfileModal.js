import React, { useState, useEffect } from 'react';
import Modal from './Modal';


const EditProfileModal = ({ isOpen, onClose}) => {

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
          placeholder="https://..."
        />
      </div>
      <div className='full-width-line'></div>
            <div className="modal-info-section">
        <label className="modal-label-subinfo">Прізвище</label>
        <input
          type="text"
          className="modal-info-input"
          placeholder="https://..."
        />
      </div>
      <div className='full-width-line'></div>
      <div className="modal-info-section">
        <label className="modal-label-subinfo">Дата народження</label>
        <input
          type="date"
          className="modal-info-input modal-calendar"
          placeholder="https://..."
        />
      </div>
      <div className='full-width-line'></div>

      <div className="modal-buttons">
        <button className="modal-button modal-button-cancel" onClick={onClose}>
          Скасувати
        </button>
        <button className="modal-button modal-button-submit">
          Зберегти
        </button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
