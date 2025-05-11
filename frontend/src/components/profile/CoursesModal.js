import React from 'react';
import Modal from './Modal';
import './Profile.css';

const CoursesModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">Додаткові курси</h3>
      <div className="modal-section">
        <label className="modal-label">Посилання/сертифікат</label>
        <input type="text" className="modal-input" placeholder="https://" />
      </div>
      <div className="modal-section">
        <label className="modal-label">Опис</label>
        <textarea className="modal-textarea" placeholder="Опис"></textarea>
      </div>
      <div className="modal-buttons">
      <button className="modal-button modal-button-cancel" onClick={onClose}>
          Скасувати
        </button>
        <button className="modal-button modal-button-submit">
          Додати
        </button>
      </div>
    </Modal>
  );
};

export default CoursesModal;