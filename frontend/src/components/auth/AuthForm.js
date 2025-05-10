import React, { useState } from 'react';
import './AuthForm.css';
import { saveTokens } from '../../utils/auth'; 
import { login } from '../../services/authService'; 

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await login({ email, password });
      saveTokens(response.data);
      window.location.href = '/';
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
  
      switch (status) {
        case 400:
          setError(message || 'Некоректні дані. Перевірте введене.');
          break;
        case 401:
          setError(message || 'Невірна електронна пошта або пароль.');
          break;
        case 500:
          setError('Помилка сервера. Спробуйте пізніше.');
          break;
        default:
          setError('Сталася невідома помилка. Спробуйте ще раз.');
      }
    }
  };
  

  return (
    <div className="auth-main">
      <div className="auth-container">
        <h2>З поверненням!</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Електронна пошта <b>*</b></label>
            <input
              type="email"
              id="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль <b>*</b></label>
            <input
              type="password"
              id="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-btn">
            Увійти
          </button>
        </form>
        <div className="social-login">
          <button className="social-btn google-btn" onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}>
            <img src="https://www.google.com/favicon.ico" alt="Google" />
            Авторизація через Google
          </button>
          <button className="social-btn linkedin-btn" onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/linkedin'}>
            <img src="https://www.linkedin.com/favicon.ico" alt="LinkedIn" />
            Авторизація через LinkedIn
          </button>
          <button className="social-btn facebook-btn" onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/facebook'}>
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
