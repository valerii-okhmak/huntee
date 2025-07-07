import React from 'react'
import './StartTest.css'
import { useNavigate } from 'react-router-dom';

const StartTest = ({text, gradienttext}) => {

    const navigate = useNavigate();
    const handleGoTrialTest = () => {
    navigate('/test');
    };

  return (
    <>
      <div className='container TrialMain-text-button'>
      <div className='TrialMain-text'> 
          <h2>{text}</h2>
      </div>
      <button className='trialStart_button' onClick={handleGoTrialTest}>Пройти тестування</button>
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