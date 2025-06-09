import React, { useState } from 'react';
import './AuthForm.css';
import { saveTokens } from '../../utils/auth';
import { login } from '../../services/authService';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import SocialLogin from '../SocialLogin/SocialLogin';
import { Link } from 'react-router-dom';

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

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const credential = credentialResponse.credential;
      const decoded = jwtDecode(credential);

      const response = await axios.post(`${import.meta.env.BACKEND}/api/auth/google`, {
        providerUserId: decoded.sub,
        email: decoded.email,
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        profileImageUrl: decoded.picture,
        accessToken: credential,
        refreshToken: null,
        expiresAt: null
      });

      saveTokens(response.data);
      window.location.href = '/';
    } catch (err) {
      console.error('Google авторизація не вдалася:', err);
      setError('Не вдалося увійти через Google.');
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

        <SocialLogin setError={setError} />

        <p className="auth-footer">
          Вперше у нас? <Link to="/reg">Зареєструватися</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;


