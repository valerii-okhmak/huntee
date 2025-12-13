import React from "react";
import Modal from "./Modal"; // твій існуючий базовий модал
import "./ModalWindow.css";

const ConfirmTestEndModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="confirm-modal">
        <h3 className="modal-title">Увага!</h3>
        <p>Чи ви впевнені, що хочете завершити спробу?</p>

        <div className="modal-buttons">
          <button
            className="modal-button modal-button-submit active"
            onClick={onConfirm}
          >
            Так
          </button>
          <button
            className="modal-button modal-button-submit active"
            onClick={onClose}
          >
            Ні
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmTestEndModal;
