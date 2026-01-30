import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './AuthForm.css';
import SocialLogin from '../SocialLogin/SocialLogin';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import { login } from '../../services/authService';
import { saveTokens } from '../../utils/auth';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AuthForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); 

  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', general: '' });

    let hasError = false;
    const newErrors = { email: '', password: '', general: '' };

    if (!isEmailValid(email)) {
      newErrors.email = t('authForm.errors.invalidEmail');
      hasError = true;
    }
    if (!password) {
      newErrors.password = t('authForm.errors.passwordRequired');
      hasError = true;
    }
    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login({ email, password });
      saveTokens(response.data);
      
      navigate(from, { replace: true });
      
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      switch (status) {
        case 400:
          newErrors.general = message || t('authForm.errors.badRequest');
          break;
        case 401:
          newErrors.general = message || t('authForm.errors.unauthorized');
          break;
        case 403:
          newErrors.general = message || t('authForm.errors.forbidden');
          break;
        case 500:
          newErrors.general = t('authForm.errors.serverError');
          break;
        default:
          newErrors.general = t('authForm.errors.unknown');
      }
      setErrors(newErrors);
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
              {t('authForm.title')}<br />
              Hun<span className="special-t">t</span>ee
            </h1>
          </div>

          <div className="right-side-auth">
            <div className="auth-input-box">
              <input
                type="email"
                id="email"
                className={`auth-input ${errors.email ? 'input-error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
              />
              <label htmlFor="email" className={`auth-input-label ${email ? 'filled' : ''}`}>
                {t('authForm.email')}
              </label>
              {errors.email && <span className="input-error-message">{errors.email}</span>}
            </div>

            <div className="auth-input-box password-box">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`auth-input ${errors.password ? 'input-error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
              />
              <label htmlFor="password" className="auth-input-label">
                {t('authForm.password')}
              </label>

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>

              {errors.password && <span className="input-error-message">{errors.password}</span>}
            </div>

            {errors.general && (
              <span className="input-error-message">{errors.general}</span>
            )}

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('authForm.buttons.loggingIn') : t('authForm.buttons.login')}
            </button>
          </div>
        </div>

        <div className="horizontal-line-auth"></div>

        <div className="bottom-part-auth">
          <SocialLogin setError={(msg) => setErrors({ ...errors, general: msg })} />
          <p className="auth-footer">
            {t('authForm.noAccount')} <Link to="/reg" state={{ from: location.state?.from }}>{t('authForm.register')}</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;