import React,{ useState } from "react";
import "./TestRules.css";
import { useNavigate } from 'react-router-dom';

const TestRules = () => {

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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
          <li><strong>6. Фінальне завершення тесту</strong> – після виходу із сторінки тест буде завершено без можливості повернення, тож перевіряйте відповіді перед відправленням.</li>
        </ul>
        <div className="test-rules-button-container">
        <button className="test-rules-button" onClick={() => setShowModal(true)}>
            Підтвердити реєстрацію
        </button>
        </div>
      </div>
            {showModal && (
        <div className="modal-overlay-test">
          <div className="modal-content-test">
            <h1><strong>Вітаємо з успішною<br/>реєстрацією!</strong></h1>
            <p>Це твій перший крок до успішної IT-кар’єри!</p>
            <div className="modal-buttons-test">
              <button onClick={() => navigate('/')} className="test-rules-button"> 
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 38 24"
                style={{
                    marginRight: "8px",
                    verticalAlign: "middle"
                }}
                >
                <line x1="4" y1="12" x2="34" y2="12" />
                <polyline points="12 6 4 12 12 18" />
                </svg>Перейти на головну</button>
              <button onClick={() => navigate('/mytests')} className="test-rules-button">Перейти в мої тести<svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 38 24"
                style={{ marginLeft: "8px", verticalAlign: "middle" }}
                >
                <line x1="4" y1="12" x2="34" y2="12" />
                <polyline points="26 6 34 12 26 18" />
            </svg></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestRules;
