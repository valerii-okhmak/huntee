import React from 'react';
import './AuthForm.css'

const AuthForm = () => {
return (
<div className="auth-main">
<div className="auth-container">
  <h2>З поверненням!</h2>
  <form className="auth-form">
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
      Увійти
    </button>
  </form>
  <div className="social-login">
    <button className="social-btn google-btn">
      <img src="https://www.google.com/favicon.ico" alt="Google" />
      Авторизація через Google
    </button>
    <button className="social-btn linkedin-btn">
      <img src="https://www.linkedin.com/favicon.ico" alt="LinkedIn" />
      Авторизація через LinkedIn
    </button>
    <button className="social-btn facebook-btn">
      <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
      Авторизація через Facebook
    </button>
  </div>
  <p className="auth-footer">
    Вперше у нас? <a href="/reg">Зареєструватися</a>
  </p>
</div>
</div>
);
};

export default AuthForm;