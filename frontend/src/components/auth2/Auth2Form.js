import React, { useState } from 'react';
import './Auth2Form.css';
import SocialLogin from '../SocialLogin/SocialLogin';
import { Link } from 'react-router-dom';

const Auth2Form = () => {
  const [selectedRole, setSelectedRole] = useState('student');
    const [error, setError] = useState('');

  return (
    <div className="auth2-form-container">
      <form className="auth2-form">
        <div className="top-part-auth2">
          <div className="left-side-auth2">
            <h1>
              Авторизація на<br />
              Hun<span className="special-t">t</span>ee
            </h1>
            <div className="choose-who-i-am">
              <div
                className={`i-am-student ${selectedRole === 'student' ? 'active' : ''}`}
                onClick={() => setSelectedRole('student')}
              >
                Я студент
              </div>
              <div
                className={`i-am-company ${selectedRole === 'company' ? 'active' : ''}`}
                onClick={() => setSelectedRole('company')}
              >
                Я представник компанії
              </div>
            </div>
          </div>
          <div className="right-side-auth2">
            {selectedRole === 'student' ? (
                <>
                <div className="auth2-input-box">
                    <input type="email" id="email" className="auth2-input" required />
                    <label htmlFor="email" className="auth2-input-label">Пошта</label>
                </div>

                <div className="auth2-input-box">
                    <input type="password" id="password" className="auth2-input" required />
                    <label htmlFor="password" className="auth2-input-label">Пароль</label>
                </div>

                <button type="submit" className="auth2-submit-button">Зареєструватися</button>
                </>
            ) : (
                <>
                <div className="auth2-input-box">
                    <input type="email" id="companyEmail" className="auth2-input" required />
                    <label htmlFor="companyEmail" className="auth2-input-label">Корпоративна пошта</label>
                </div>

                <div className="auth2-input-box">
                    <input type="password" id="companyPassword" className="auth2-input" required />
                    <label htmlFor="companyPassword" className="auth2-input-label">Пароль</label>
                </div>

                <button type="submit" className="auth2-submit-button">Зареєструватися</button>
                </>
            )}
            </div>
        </div>
        <div className="horizontal-line-auth2"></div>
        <div className="bottom-part-auth2">
            <SocialLogin setError={setError} />
            <p className="auth2-footer">
                Уже є акаунт? <Link to="/login">Авторизуватися</Link>
            </p>
        </div>
      </form>
    </div>
  );
};

export default Auth2Form;
