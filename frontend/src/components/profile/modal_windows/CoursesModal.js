import React from 'react';
import Modal from './Modal';

const CoursesModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">Додайте сертифікат</h3>
      <div className="modal-section">
        <label className="modal-label">Назва</label>
        <input type="text" className="modal-input" placeholder="" />
      </div>
      <div className="modal-section">
        <label className="modal-label">Посилання на сертифікат</label>
        <input type="text" className="modal-input" placeholder="https://" />
      </div>
      <div className="modal-section">
        <label className="modal-label">Опис</label>
        <textarea className="modal-textarea" placeholder=""></textarea>
      </div>
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

export default CoursesModal;