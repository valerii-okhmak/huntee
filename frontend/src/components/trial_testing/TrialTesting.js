import React from 'react';
import { useTranslation } from 'react-i18next';
import './TrialTesting.css';
import backgroundVideo from '../../video/trialtestingvideo.webm';
import { Link } from 'react-router-dom';

const TrialTesting = () => {
  const { t } = useTranslation();
  return (
    <div className="trial-testing">
      <video className="background-video" autoPlay loop muted>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="trial-testing-container">
        <h1 className="trial-testing-title" dangerouslySetInnerHTML={{ __html: t('trialTesting.title') }}></h1>
        <h2 className="trial-testing-subtitle">{t('trialTesting.subtitle')}</h2>
        <div className="trial-testing-info">
          <Link to="/starttest" className="trial-testing-link">{t('trialTesting.link')}</Link>
        </div>
      </div>
    </div>
  );
};

export default TrialTesting;