import React, { useState } from 'react';
import './Reg2Form.css';
import SocialLogin from '../SocialLogin/SocialLogin';

const Reg2Form = () => {
  const [selectedRole, setSelectedRole] = useState('student');
    const [error, setError] = useState('');

  return (
    <div className="reg2-form-container">
      <form className="reg2-form">
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
                    <input type="text" id="firstName" className="reg2-input" required />
                    <label htmlFor="firstName" className="reg2-input-label">Ім’я</label>
                </div>

                <div className="reg2-input-box">
                    <input type="text" id="lastName" className="reg2-input" required />
                    <label htmlFor="lastName" className="reg2-input-label">Прізвище</label>
                </div>

                <div className="reg2-input-box">
                    <input type="number" id="age" className="reg2-input" required />
                    <label htmlFor="age" className="reg2-input-label">Вік</label>
                </div>

                <div className="reg2-input-box">
                    <input type="email" id="email" className="reg2-input" required />
                    <label htmlFor="email" className="reg2-input-label">Пошта</label>
                </div>

                <div className="reg2-input-box">
                    <input type="password" id="password" className="reg2-input" required />
                    <label htmlFor="password" className="reg2-input-label">Пароль</label>
                </div>

                <button type="submit" className="reg2-submit-button">Зареєструватися</button>
                </>
            ) : (
                <>
                <div className="reg2-input-box">
                    <input type="text" id="companyName" className="reg2-input" required />
                    <label htmlFor="companyName" className="reg2-input-label">Назва компанії</label>
                </div>

                <div className="reg2-input-box">
                    <input type="email" id="companyEmail" className="reg2-input" required />
                    <label htmlFor="companyEmail" className="reg2-input-label">Пошта</label>
                </div>

                <div className="reg2-input-box">
                    <input type="password" id="companyPassword" className="reg2-input" required />
                    <label htmlFor="companyPassword" className="reg2-input-label">Пароль</label>
                </div>

                <button type="submit" className="reg2-submit-button">Зареєструватися</button>
                </>
            )}
            </div>
        </div>
        <div className="horizontal-line-reg2"></div>
        <div className="bottom-part-reg2">
            <SocialLogin setError={setError} />
        </div>
      </form>
    </div>
  );
};

export default Reg2Form;
