import React from 'react'
import './TrialTest.css'
import { useNavigate } from 'react-router-dom';

const TrialTest = () => {

    const navigate = useNavigate();
    const handleGoTrialTest = () => {
    navigate('/test');
    };

  return (
    <div className='TrialMain container'> 
        <h2>Пробне тестування створене для попереднього розуміння формату екзамену. 
        Воно не впливає на Ваш прогрес та не містить питань з реальних тестів. </h2>
        <button className='trialStart_button' onClick={handleGoTrialTest}>Пройти пробне тестування</button>
    </div>
  )
}

export default TrialTest;