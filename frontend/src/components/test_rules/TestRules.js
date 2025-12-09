import React, { useState } from "react";
import "./TestRules.css";
import { useNavigate, useLocation } from 'react-router-dom'; 
import axios from 'axios';
import { getAccessToken } from '../../utils/auth';

const TestRules = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  
  const navigate = useNavigate();
  const location = useLocation();
  const testId = location.state?.testId; 

  const onClose = () => {
    setShowModal(false);
  };

  const handleConfirmRegistration = async () => {
    if (!testId) {
        alert("Помилка: ID тесту не знайдено. Будь ласка, поверніться назад і спробуйте ще раз.");
        return;
    }

    setIsLoading(true);
    try {
        const token = getAccessToken();
        if (!token) {
            alert("Будь ласка, увійдіть у систему.");
            navigate('/login'); 
            return;
        }

        await axios.post(
            `${process.env.REACT_APP_BACKEND}/api/tests/${testId}/register`,
            {}, 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        setShowModal(true);

    } catch (error) {
        console.error("Помилка реєстрації:", error);
        const message = error.response?.data || "Не вдалося зареєструватися. Спробуйте пізніше.";
        alert(message); 
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="test-rules-main">
      <div className="test-rules-container">
        <p><strong>Правила проходження онлайн-тесту</strong></p>
        <ul>
          <li><strong>1. Не перемикайте вкладки та програми</strong> – якщо ви залишите тестове вікно, тест автоматично завершиться.</li>
          <li><strong>2. Формат тесту</strong> – питання та завдання відповідають вакансії й можуть включати тести, написання коду або логічні задачі.</li>
          <li><strong>3. Відстеження активності</strong> – система аналізує ваші рухи очей, щоб уникнути списування.</li>
          <li><strong>4. Проходьте тест самостійно</strong> – заборонено використання шпаргалок, пошукових систем та допомоги інших осіб.</li>
          <li><strong>5. Технічні вимоги</strong> – тест слід проходити на комп’ютері з увімкненою веб-камерою, мікрофоном та стабільним інтернетом.</li>
          <li><strong>6. Фінальне завершення тесту</strong> – після виходу із сторінки тест буде завершено без можливості повернення.</li>
        </ul>

        <div className="test-rules-button-container">
          <button 
              className="test-rules-button" 
              onClick={handleConfirmRegistration} 
              disabled={isLoading} 
          >
            {isLoading ? "Обробка..." : "Підтвердити реєстрацію"}
          </button>
        </div>
      </div>
      
      {showModal && (
        <div className="modal-overlay-test" onClick={onClose}>
          <div className="modal-content-test" onClick={e => e.stopPropagation()}>
            
            <button className="modal-close" onClick={onClose} aria-label="Закрити">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z"/>
              </svg>
            </button>

            <h1><strong>Вітаємо з успішною<br/>реєстрацією!</strong></h1>
            <p>Це твій перший крок до успішної IT-кар’єри!</p>

            <div className="modal-buttons-test">
              <button onClick={() => navigate('/')} className="test-rules-button"> 
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 38 24" style={{ marginRight: "8px", verticalAlign: "middle" }}>
                  <line x1="4" y1="12" x2="34" y2="12" />
                  <polyline points="12 6 4 12 12 18" />
                </svg>
                Перейти на головну
              </button>
              
              <button onClick={() => navigate('/mytests')} className="test-rules-button">
                Перейти в мої тести
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
