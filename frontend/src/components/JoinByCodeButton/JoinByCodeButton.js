import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActivateCodeModal from '../modal_windows/ActivateCodeModal'; 

const JoinByCodeButton = ({ customStyle, customClass = "black-btn" }) => {
  const { t } = useTranslation();
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

  return (
    <>
      <button 
        className={customClass} 
        onClick={() => setIsActivateModalOpen(true)}
        style={{ 
            whiteSpace: 'nowrap', 
            fontFamily: 'Montserrat, sans-serif',
            color: 'white',
            fontSize: 'clamp(14px, 2vw, 20px)',
            fontWeight: 700, 
            ...customStyle 
        }}
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