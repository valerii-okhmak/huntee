import React from 'react'
import { useTranslation } from 'react-i18next';
import './StartTest.css'
import { useNavigate } from 'react-router-dom';

const StartTest = ({text, gradienttext}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const handleGoTrialTest = () => {
        navigate('/test');
    };

  return (
    <>
      <div className='TrialMain-text-button'>
      <div className='TrialMain-text'> 
          <h2>{text}</h2>
      </div>
      <button className='trialStart_button' onClick={handleGoTrialTest}>{t('startTest.button')}</button>
      </div>
      <div className='gradient-container '> 
      <div className='container'>
        <div className='vertical-stick'></div>
        <p className='trial-text'>{gradienttext}</p>
      </div>
      </div>
    </>
  )
}

export default StartTest;