import React from 'react';
import Modal from './Modal';
import "./Profile.css"


const AdditionalInfoModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">Додаткова інформація</h3>
      <p id='help'>Допоможіть роботодавцям краще пізнати вас: додайте інші посилання й опишіть, що робить саме вас чудовим кандидатом на посаду.</p>
      <div className="modal-section">
        <label className="modal-label">Тип додаткової інформації</label>
        <select className="modal-select">
          <option value="linkedin">LinkedIn</option>
          <option value="github">GitHub</option>
        </select>
      </div>
      <div className="modal-section">
        <label className="modal-label">Посилання, обліковий запис у соц. мережах на посаду, якщо необхідно додати посаду</label>
        <input type="text" className="modal-input" placeholder="https://" />
      </div>
      <div className="modal-section">
        <label className="modal-label">Про Вас</label>
        <textarea
          className="modal-textarea"
          placeholder="Додайте сюди інформацію, наприклад, про хобі, нагороди, чим ви займаєтесь у вільний час тощо. Ви можете додати сюди інформацію, яка буде корисна для вашого резюме."
        ></textarea>
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

export default AdditionalInfoModal;