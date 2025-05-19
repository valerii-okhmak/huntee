import React from "react";
import "./TestRules.css";
import { useNavigate } from 'react-router-dom';

const TestRules = () => {

    const navigate = useNavigate();
    const handleGoHome = () => {
    navigate('/');
    };

  return (
    <div className="test-rules-main">
      <div className="test-rules-container">
        <h2>Вітаємо з успішною реєстрацією!</h2>
        <p><strong>Правила проходження онлайн-тесту</strong></p>
        <ul>
          <li><strong>1. Не перемикайте вкладки та програми</strong> – якщо ви залишите тестове вікно, тест автоматично завершиться.</li>
          <li><strong>2. Формат тесту</strong> – питання та завдання відповідають вакансії й можуть включати тести, написання коду або логічні задачі.</li>
          <li><strong>3. Відстеження активності</strong> – система аналізує ваші рухи очей, щоб уникнути списування.</li>
          <li><strong>4. Проходьте тест самостійно</strong> – заборонено використання шпаргалок, пошукових систем та допомоги інших осіб.</li>
          <li><strong>5. Технічні вимоги</strong> – тест слід проходити на комп’ютері з увімкненою веб-камерою, мікрофоном та стабільним інтернетом.</li>
          <li><strong>6. Фінальне завершення тесту</strong> – після виходу із сторінки тест буде завершено без можливості повернення, тож перевіряйте відповіді перед відправленням.</li>
        </ul>
        <div className="test-rules-button">
        <button onClick={handleGoHome}>
            Перейти на головну сторінку
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
        style={{ marginLeft: "8px", verticalAlign: "middle" }}
        >
        <line x1="4" y1="12" x2="34" y2="12" />
        <polyline points="26 6 34 12 26 18" />
        </svg>
        </button>
        </div>
      </div>
    </div>
  );
};

export default TestRules;
