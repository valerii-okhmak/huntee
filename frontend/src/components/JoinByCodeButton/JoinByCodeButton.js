import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActivateCodeModal from '../modal_windows/ActivateCodeModal'; 
import './JoinByCodeButton.css'; 

const JoinByCodeButton = ({ customStyle, customClass = "black-btn" }) => {
  const { t } = useTranslation();
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  return (
    <>
      <button 
        className={`join-by-code-btn ${customClass}`.trim()} 
        onClick={() => setIsActivateModalOpen(true)}
        style={customStyle} 
      >
        {t('testsBlock.joinByCode')}
      </button>

      <ActivateCodeModal 
        isOpen={isActivateModalOpen} 
        onClose={() => setIsActivateModalOpen(false)} 
      />
    </>
  );
};

export default JoinByCodeButton;