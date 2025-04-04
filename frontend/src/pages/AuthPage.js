import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import '../index.css';

const AuthPage = () => {
  return (
    <div className="page">
      <Header />
      <div className="auth-main">
        <div className="auth-container">
          <h2>Реєстрація</h2>
          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Повне ім'я *</label>
              <input
                type="text"
                id="name"
                placeholder="Романів Святослав"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Електронна пошта *</label>
              <input
                type="email"
                id="email"
                placeholder="example@domain.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль *</label>
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
          <p className="auth-footer">
            Вже зареєстровані? <a href="/login">Увійти</a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
