import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import { useTranslation } from 'react-i18next';

const Welcome = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="welcome">
      
      <div className="container">
        <div className="welcome_content">
          <h1 className="main-title">
            <span className="title-line">{t('welcome.titleOnline')}</span>
            <span className="title-line outline-text">{t('welcome.titleTesting')}</span>
          </h1>
          
          <div className="action-area">
            <p className="subtitle">
              {t('welcome.subtitle')} <br />
            </p>
            
            <div className="action-buttons">
              <button className="btn primary-btn" onClick={() => navigate('/viewingtests')}>
                {t('welcome.btnCreate')}
              </button>
              <button className="btn secondary-btn" onClick={() => navigate('/alltests')}>
                {t('welcome.btnFind')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;