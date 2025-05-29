import React from 'react';
import Modal from './Modal';

const EducationModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">Освіта</h3>
      <div className="modal-section">
        <label className="modal-label">Навчальний заклад</label>
        <select className="modal-select">
          <option value="lviv-polytechnic">Національний університет "Львівська політехніка"</option>
          <option value="other">Інший</option>
        </select>
      </div>
      <div className="modal-section">
        <label className="modal-label">Додайте свої спеціальності</label>
        <textarea className="modal-textarea" placeholder="Додайте свої спеціальності"></textarea>
      </div>
      <div className="modal-buttons">
        <button className="modal-button modal-button-cancel" onClick={onClose}>
          Скасувати
        </button>
        <button className="modal-button modal-button-submit">
          Завершити
        </button>
      </div>
    </Modal>
  );
};

export default EducationModal;