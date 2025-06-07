import React from 'react';
import Modal from './Modal';




const AdditionalInfoModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="modal-title">Додаткова інформація</h3>
      <label className='modal-text'>Допоможіть роботодавцям краще пізнати вас: додайте інші посилання й опишіть, що робить саме вас чудовим кандидатом на посаду.</label>
      <div className="modal-section">
        <label className="modal-label">Додаткові посилання</label>
              <label className='modal-text'>У вас уже є профіль на LinkedIn, обліковий запис на GitHub або персональне портфоліо? Додайте до 5 посилань, щоб роботодавцям було зручніше переглядати ваші роботи.</label>
      </div>
      <div className='linkes'>
        <select className="modal-select">
          <option className='value' value="linkedin">LinkedIn</option>
          <option className='value' value="github">GitHub</option>
          <option className='value' value="github">Facebook</option>
        </select>
        <input type="text" className="modal-input" placeholder="https://" />
        </div>
        <div class="custom-line"></div>
      <label className='modal-label'>Про вас</label>
      
      <div className="modal-section">
        <textarea
          className="modal-textarea"
          placeholder="Додайте кілька коротких подробиць про себе. Наприклад, чим Ви найбільше любите займатися? Якими досягненнями ви пишаєтеся найбільше? Що відрізняє Вас від інших кандидатів?."
        ></textarea>
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

export default AdditionalInfoModal;