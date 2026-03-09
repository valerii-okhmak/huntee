import React from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom"; 
import "./RegisterButton.css";

const RegisterButton = ({ testId }) => { 
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleRegistration = () => {
        navigate('/testrules', { state: { testId: testId } }); 
    };

  return (
    <div className='reg-button'>
      <button className="reg-button" onClick={handleRegistration}>
          {t('workResponsibilities.register')}
      </button>
    </div>
  );
};

export default RegisterButton;