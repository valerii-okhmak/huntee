import React, { useState } from 'react';
import './AuthForm.css';
import SocialLogin from '../SocialLogin/SocialLogin';
import { Link } from 'react-router-dom';
import { login } from '../../services/authService'; // перевір шлях
import { saveTokens } from '../../utils/auth'; // перевір шлях

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmailValid = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isEmailValid(email)) {
      setError('Введіть коректну пошту.');
      return;
    }
    if (!password) {
      setError('Введіть пароль.');
      return;
    }

    setIsSubmitting(true);
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
        case 403: 
          setError(message || 'Доступ заборонено. Дозволено лише пошти @lpnu.ua.');
          break;
        case 500:
          setError('Помилка сервера. Спробуйте пізніше.');
          break;
        default:
          setError('Сталася невідома помилка. Спробуйте ще раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="top-part-auth">
          <div className="left-side-auth">
            <h1>
              Авторизація на<br />
              Hun<span className="special-t">t</span>ee
            </h1>
          </div>
          <div className="right-side-auth">
            <div className="auth-input-box">
              <input
                type="email"
                id="email"
                className={`auth-input ${email && isEmailValid(email) ? 'valid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={`auth-input-label ${email ? 'filled' : ''}`}
              >
                Пошта
              </label>
            </div>

            <div className="auth-input-box">
              <input
                type="password"
                id="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
              />
              <label htmlFor="password" className="auth-input-label">
                Пароль
              </label>
            </div>

            {error && <p className="error-message" style={{ color: '#d93025' }}>{error}</p>}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? 'Вхід...' : 'Увійти'}
            </button>
          </div>
        </div>

        <div className="horizontal-line-auth"></div>

        <div className="bottom-part-auth">
          <SocialLogin setError={setError} />
          <p className="auth-footer">
            Ще немає акаунту? <Link to="/reg">Зареєструватися</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
