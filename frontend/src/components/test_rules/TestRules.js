import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import "./TestRules.css";
import { useNavigate, useLocation } from 'react-router-dom'; 
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';

const TestRules = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const testId = location.state?.testId; 

  const onClose = () => {
    setShowModal(false);
    setIsAlreadyRegistered(false);
  };

  const handleConfirmRegistration = async () => {
    if (!testId) {
        console.log("Error: Test ID not found.");
        return;
    }

    setIsLoading(true);
    try {
        const token = getAccessToken();
        if (!token) {
            navigate('/login'); 
            return;
        }

        await axios.post(
            `/api/tests/${testId}/register`,
            {}, 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        setShowModal(true);
        setIsAlreadyRegistered(false);

    } catch (error) {
        console.error("Registration error:", error);
          
        if (error.response && error.response.status === 409) {
            setIsAlreadyRegistered(true);
            setShowModal(true);
        } else {
            alert(t('testRules.errors.failed'));
        } 
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="test-rules-main">
      <div className="test-rules-container">
        <p><strong>{t('testRules.title')}</strong></p>
        <ul>
          {[...Array(10)].map((_, i) => (
            <li key={i}>
              <strong>{t(`testRules.rule${i + 1}.bold`)}</strong> {t(`testRules.rule${i + 1}.text`)}
            </li>
          ))}
        </ul>

        <div className="test-rules-button-container">
          <button 
              className="test-rules-button" 
              onClick={handleConfirmRegistration} 
              disabled={isLoading} 
          >
            {isLoading ? t('testRules.buttons.processing') : t('testRules.buttons.confirm')}
          </button>
        </div>
      </div>
      
      {showModal && (
        <div className="modal-overlay-test" onClick={onClose}>
          <div className="modal-content-test" onClick={e => e.stopPropagation()}>
            
            <button className="modal-close" onClick={onClose} aria-label={t('testRules.modal.close')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z"/>
              </svg>
            </button>

            <h1 dangerouslySetInnerHTML={{ 
              __html: isAlreadyRegistered 
                ? t('testRules.modal.alreadyRegisteredTitle') 
                : t('testRules.modal.title') 
            }}></h1>
            <p>
              {isAlreadyRegistered 
                ? t('testRules.modal.alreadyRegisteredSubtitle') 
                : t('testRules.modal.subtitle')}
            </p>

            <div className="modal-buttons-test">
              <button onClick={() => navigate('/')} className="test-rules-button"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 38 24" style={{ marginRight: "8px", verticalAlign: "middle" }}>
                  <line x1="4" y1="12" x2="34" y2="12" />
                  <polyline points="12 6 4 12 12 18" />
                </svg>
                {t('testRules.modal.toMain')}
              </button>
              
              <button onClick={() => navigate('/mytests')} className="test-rules-button">
                {t('testRules.modal.toMyTests')}
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 38 24" style={{ marginLeft: "8px", verticalAlign: "middle" }}>
                  <line x1="4" y1="12" x2="34" y2="12" />
                  <polyline points="26 6 34 12 26 18" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TestRules;