import React from 'react';
import './TrialTesting.css';
import backgroundVideo from '../../video/trialtestingvideo.mp4';
import { Link } from 'react-router-dom';

const TrialTesting = () => {
  return (
    <div className="trial-testing">
      <video className="background-video" autoPlay loop muted>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="trial-testing-container">
        <h1 className="trial-testing-title">Пробне<br/>тестування</h1>
        <h2 className="trial-testing-subtitle">Дізнайся як проходить тестування!</h2>
        <div className="trial-testing-info">
          <Link to="/starttest" className="trial-testing-link">Спробувати</Link>
        </div>
      </div>
    </div>
  );
};

export default TrialTesting;
