import React, { useState } from 'react';
import './Reg2Form.css';
import SocialLogin from '../SocialLogin/SocialLogin';
import { Link } from 'react-router-dom';

const Reg2Form = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    // простий regex для перевірки формату e-mail
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.target);
    if (selectedRole === 'student') {
      const email = formData.get('email') || '';
      const password = formData.get('password') || '';

      if (!validateEmail(email)) {
        setError('Введіть коректну пошту.');
        return;
      }
      if (password.length < 6) {
        setError('Пароль повинен містити щонайменше 6 символів.');
        return;
      }

      // Тут можеш викликати API або продовжити логіку реєстрації
      console.log('Register student:', {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        age: formData.get('age'),
        email,
      });
    } else {
      const companyEmail = formData.get('companyEmail') || '';
      const companyPassword = formData.get('companyPassword') || '';

      if (!validateEmail(companyEmail)) {
        setError('Введіть коректну пошту компанії.');
        return;
      }
      if (companyPassword.length < 6) {
        setError('Пароль компанії повинен містити щонайменше 6 символів.');
        return;
      }

      console.log('Register company:', {
        companyName: formData.get('companyName'),
        email: companyEmail,
      });
    }

    // Якщо все ок — очистити помилки і продовжити
    setError('');
    // наприклад, відправка на сервер...
  };

  return (
    <div className="reg2-form-container">
      <form className="reg2-form" onSubmit={handleSubmit} noValidate>
        <div className="top-part-reg2">
          <div className="left-side-reg2">
            <h1>
              Реєстрація на<br />
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

          <div className="right-side-reg2">
            {selectedRole === 'student' ? (
              <>
                <div className="reg2-input-box">
                  <input name="firstName" type="text" id="firstName" className="reg2-input" required placeholder=" " />
                  <label htmlFor="firstName" className="reg2-input-label">Ім’я</label>
                </div>

                <div className="reg2-input-box">
                  <input name="lastName" type="text" id="lastName" className="reg2-input" required placeholder=" " />
                  <label htmlFor="lastName" className="reg2-input-label">Прізвище</label>
                </div>

                <div className="reg2-input-box">
                  <input name="age" type="number" id="age" className="reg2-input" required placeholder=" " />
                  <label htmlFor="age" className="reg2-input-label">Вік</label>
                </div>

                <div className="reg2-input-box">
                  <input name="email" type="email" id="email" className="reg2-input" required placeholder=" " />
                  <label htmlFor="email" className="reg2-input-label">Пошта</label>
                </div>

                <div className="reg2-input-box">
                  <input name="password" type="password" id="password" className="reg2-input" required placeholder=" " />
                  <label htmlFor="password" className="reg2-input-label">Пароль</label>
                </div>

                <button type="submit" className="reg2-submit-button">Зареєструватися</button>
              </>
            ) : (
              <>
                <div className="reg2-input-box">
                  <input name="companyName" type="text" id="companyName" className="reg2-input" required placeholder=" " />
                  <label htmlFor="companyName" className="reg2-input-label">Назва компанії</label>
                </div>

                <div className="reg2-input-box">
                  <input name="companyEmail" type="email" id="companyEmail" className="reg2-input" required placeholder=" " />
                  <label htmlFor="companyEmail" className="reg2-input-label">Пошта</label>
                </div>

                <div className="reg2-input-box">
                  <input name="companyPassword" type="password" id="companyPassword" className="reg2-input" required placeholder=" " />
                  <label htmlFor="companyPassword" className="reg2-input-label">Пароль</label>
                </div>

                <button type="submit" className="reg2-submit-button">Зареєструватися</button>
              </>
            )}
          </div>
        </div>

        <div className="horizontal-line-reg2"></div>

        <div className="bottom-part-reg2">
          {/* показ помилки на формі */}
          {error && <p style={{ color: '#d93025', marginBottom: 12 }}>{error}</p>}
          <SocialLogin setError={setError} />
          <p className="reg2-footer">
            Уже є акаунт? <Link to="/login">Авторизуватися</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Reg2Form;
