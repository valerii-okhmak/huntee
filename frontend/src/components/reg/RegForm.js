import React, { useState } from 'react';
import axios from 'axios';
import './RegForm.css';

const RegForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [code, setCode] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });

      console.log(response.data);

      // Переходимо на етап підтвердження
      setConfirmationStep(true);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert(error.response?.data || 'Сталася помилка при реєстрації.');
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/confirm', {
        email,
        code,
      });

      console.log(response.data);
      alert('Реєстрація завершена успішно!');
      window.location.href = '/auth'; // Переадресація на сторінку авторизації
    } catch (error) {
      console.error('Confirmation error:', error.response?.data || error.message);
      alert(error.response?.data || 'Сталася помилка при підтвердженні.');
    }
  };

  return (
    <div className="reg-main">
      <div className="reg-container">
        <h2>Реєстрація!</h2>

        {!confirmationStep ? (
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
              <label>Електронна пошта <b>*</b></label>
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

            <button type="submit" className="submit-btn">
              Зареєструватися
            </button>
          </form>
        ) : (
          <form className="reg-form" onSubmit={handleConfirm}>
            <div className="form-group">
              <label>Код підтвердження</label>
              <input
                type="text"
                placeholder="Введіть код з пошти"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Підтвердити
            </button>
          </form>
        )}

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
