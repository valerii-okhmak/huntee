import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome">
      
      <div className="container">
        <div className="welcome_content">
          <h1 className="main-title">
            <span className="title-line">ОНЛАЙН</span>
            <span className="title-line outline-text">ТЕСТУВАННЯ</span>
          </h1>
          
          {/* Зона дії: опис + кнопки тепер разом */}
          <div className="action-area">
            <p className="subtitle">
              Платформа для створення та проходження тестів. <br />
            </p>
            
            <div className="action-buttons">
              <button className="btn primary-btn" onClick={() => navigate('/create-test')}>
                Створити тест
              </button>
              <button className="btn secondary-btn" onClick={() => navigate('/tests')}>
                Знайти тести
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;