import React from 'react';
import "./ModalWindow.css"

const ModalMini = ({ isOpen, onClose, children, contentClassName = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modalmini-content ${contentClassName}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalMini;