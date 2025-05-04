import React, { useState, useRef } from 'react';
import './RegForm.css';
import { register, verifyEmail } from '../../services/authService';

const RegForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ firstName, lastName, email, password });
      setConfirmationStep(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Помилка підключення до сервера';
      setError(msg);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    const code = codeDigits.join('');
    try {
      await verifyEmail({ email, code });
      window.location.href = '/';
    } catch (err) {
      const msg = err.response?.data?.message || 'Невірний код або помилка сервера';
      setError(msg);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 1) return;
    const updatedDigits = [...codeDigits];
    updatedDigits[index] = value;
    setCodeDigits(updatedDigits);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleGoBack = () => {
    setConfirmationStep(false);
    setCodeDigits(['', '', '', '', '', '']);
    setEmail('');
  };

  return (
    <div className="reg-main">
      <div className="reg-container">
        <h2>Реєстрація</h2>

        {!confirmationStep ? (
          <>
            <form className="reg-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label>Ім'я <b>*</b></label>
                <input
                  type="text"
                  placeholder="Ім'я"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Прізвище</label>
                <input
                  type="text"
                  placeholder="Прізвище (необов'язково)"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email <b>*</b></label>
                <input
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Пароль <b>*</b></label>
                <input
                  type="password"
                  placeholder="Введіть пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="error-message">{error}</p>}

              <button type="submit" className="submit-btn">
                Зареєструватися
              </button>
            </form>

            <div className="social-login">
              <button className="social-btn google-btn" onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}>
                <img src="https://www.google.com/favicon.ico" alt="Google" />
                Реєстрація через Google
              </button>
              <button className="social-btn linkedin-btn" onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/linkedin'}>
                <img src="https://www.linkedin.com/favicon.ico" alt="LinkedIn" />
                Реєстрація через LinkedIn
              </button>
              <button className="social-btn facebook-btn" onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/facebook'}>
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" />
                Реєстрація через Facebook
              </button>
            </div>
          </>
        ) : (
          <form className="reg-form" onSubmit={handleConfirm}>
            <p className="confirm-text">Ми надіслали код підтвердження на <b>{email}</b></p>
            <div className="code-inputs">
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  className="code-input"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  required
                />
              ))}
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="submit-btn">
              Підтвердити
            </button>
            <button type="button" className="back-btn" onClick={handleGoBack}>
              Назад
            </button>
          </form>
        )}

        <p className="reg-footer">
          Уже є акаунт? <a href="/login">Авторизуватися</a>
        </p>
      </div>
    </div>
  );
};

export default RegForm;
