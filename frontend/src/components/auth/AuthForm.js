import React, { useState } from 'react';
import './AuthForm.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Не даємо формі перезавантажувати сторінку

    const credentials = { email, password };

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Збереження токена та даних користувача в localStorage
        localStorage.setItem('authToken', data.token); 
        localStorage.setItem('userData', JSON.stringify(data.user));  

        window.location.href = '/'; 
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Щось пішло не так');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Помилка підключення до сервера');
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
