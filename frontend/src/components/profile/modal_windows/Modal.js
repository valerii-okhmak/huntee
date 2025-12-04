import React from 'react';
import "./ModalWindow.css"

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}  // блокує клік всередині
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
