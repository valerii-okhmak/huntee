import React, { useState } from 'react';
import './Auth2Form.css';
import SocialLogin from '../SocialLogin/SocialLogin';
import { Link } from 'react-router-dom';
import { login } from '../../services/authService'; // перевір шлях
import { saveTokens } from '../../utils/auth'; // перевір шлях

const Auth2Form = () => {
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
    <div className="auth2-form-container">
      <form className="auth2-form" onSubmit={handleSubmit}>
        <div className="top-part-auth2">
          <div className="left-side-auth2">
            <h1>
              Авторизація на<br />
              Hun<span className="special-t">t</span>ee
            </h1>
          </div>
          <div className="right-side-auth2">
            <div className="auth2-input-box">
              <input
                type="email"
                id="email"
                className={`auth2-input ${email && isEmailValid(email) ? 'valid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={`auth2-input-label ${email ? 'filled' : ''}`}
              >
                Пошта
              </label>
            </div>

            <div className="auth2-input-box">
              <input
                type="password"
                id="password"
                className="auth2-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
              />
              <label htmlFor="password" className="auth2-input-label">
                Пароль
              </label>
            </div>

            {error && <p className="error-message" style={{ color: '#d93025' }}>{error}</p>}

            <button
              type="submit"
              className="auth2-submit-button"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting ? 'Вхід...' : 'Увійти'}
            </button>
          </div>
        </div>

        <div className="horizontal-line-auth2"></div>

        <div className="bottom-part-auth2">
          <SocialLogin setError={setError} />
          <p className="auth2-footer">
            Ще немає акаунту? <Link to="/register">Зареєструватися</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Auth2Form;
