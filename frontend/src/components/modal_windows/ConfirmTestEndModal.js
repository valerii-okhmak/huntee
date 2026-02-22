import React from "react";
import { useTranslation } from 'react-i18next';
import ModalMini from "./ModalMini"; 
import "./ModalWindow.css";

const ConfirmTestEndModal = ({ isOpen, onClose, onConfirm, unansweredCount, unansweredLabels }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <ModalMini isOpen={isOpen} onClose={onClose}>
      <button className="modal-close" onClick={onClose} aria-label={t('confirmTestEndModal.close')}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z"/>
        </svg>
      </button>
      <div className="confirm-modal">
        <h3 className="modalmini-title">{t('confirmTestEndModal.title')}</h3>
        <div>
          <p className="modalmini-subtitle">{t('confirmTestEndModal.confirmText')}</p>
          <p className="modalmini-minisubtitle">{t('confirmTestEndModal.warning')}</p>
        </div>
        
        {unansweredCount > 0 && (
            <p className="modalmini-subtitle" style={{marginTop: '10px'}}>
            {t('confirmTestEndModal.unansweredCount')}: <strong>{unansweredCount}</strong>
            <span style={{ color: "#ff4d4f", fontWeight: "bold", display: 'block', fontSize: '14px' }}>
                {unansweredLabels}
            </span>
            </p>
        )}
        
        <p className="modalmini-minisubtitle" style={{marginTop: '15px'}}>
            {t('confirmTestEndModal.savedInfo')}
        </p>
        
        <div className="modalmini-buttons">
          <button className="modalmini-button modalmini-button-cancel" onClick={onClose}>
            {t('confirmTestEndModal.cancel')}
          </button>

          <button
            className="modalmini-button modalmini-button-submit"
            onClick={onConfirm}
          >
            {t('confirmTestEndModal.finish')}
          </button>
        </div>
      </div>
    </ModalMini>
  );
};

export default ConfirmTestEndModal;