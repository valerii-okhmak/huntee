import React from 'react';
import './RegForm.css'

const RegForm = () => {
return (
<div className="reg-main">
<div className="reg-container">
  <h2>Реєстрація!</h2>
  <form className="reg-form">
  <div className="form-group">
      <label htmlFor="text">Ім'я <b>*</b></label>
      <input
        type="text"
        id="text"
        placeholder="Прізвище ім'я"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="number">Вік <b>*</b></label>
      <input
        type="number"
        id="number"
        placeholder="Напр: 18"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="email">Електронна пошта <b>*</b></label>
      <input
        type="email"
        id="email"
        placeholder="example@domain.com"
        required
      />
    </div>
    <div className="form-group">
      <label htmlFor="password">Пароль <b>*</b></label>
      <input
        type="password"
        id="password"
        placeholder="Введіть пароль"
        required
      />
    </div>
    <button type="submit" className="submit-btn">
      Зареєструватися
    </button>
  </form>
  <div className="social-login">
    <button className="social-btn google-btn">
      <img src="https://www.google.com/favicon.ico" alt="Google" />
      Реєстрація через Google
    </button>
    <button className="social-btn linkedin-btn">
      <img src="https://www.linkedin.com/favicon.ico" alt="LinkedIn" />
      Реєстрація через LinkedIn
    </button>
    <button className="social-btn facebook-btn">
      <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
      Реєстрація через Facebook
    </button>
  </div>
  <p className="reg-footer">
    Уже є обліковий запис? <a href="/auth">Авторизуватись</a>
  </p>
</div>
</div>
);
};

export default RegForm;