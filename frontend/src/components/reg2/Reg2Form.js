import React, { useState, useRef, useEffect } from 'react';
import './Reg2Form.css';
import SocialLogin from '../SocialLogin/SocialLogin';
import { Link } from 'react-router-dom';
import { register, verifyEmail } from '../../services/authService'; // перевір шлях

const Reg2Form = () => {
  // поля реєстрації
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  // підтвердження пошти
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // помилки та стани
  const [errors, setErrors] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmpassword: ''
  });
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // простий regex для перевірки e-mail
  const validateEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

  // Перевірка пароля на співпадіння
  useEffect(() => {
    if (!confirmpassword) {
      setErrors((prev) => ({ ...prev, confirmpassword: '' }));
      return;
    }
    if (password !== confirmpassword) {
      setErrors((prev) => ({ ...prev, confirmpassword: 'Паролі не співпадають.' }));
    } else {
      setErrors((prev) => ({ ...prev, confirmpassword: '' }));
    }
  }, [password, confirmpassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setGeneralError('');

    // локальна валідація
    let tempErrors = {
      firstName: '',
      email: '',
      password: '',
      confirmpassword: ''
    };
    let hasError = false;

    if (!firstName.trim()) {
      tempErrors.firstName = "Імʼя обовʼязкове.";
      hasError = true;
    }
    if (!validateEmail(email)) {
      tempErrors.email = 'Введіть коректну пошту.';
      hasError = true;
    }
    if (!password || password.length < 6) {
      tempErrors.password = 'Пароль повинен містити щонайменше 6 символів.';
      hasError = true;
    }
    if (password !== confirmpassword) {
      tempErrors.confirmpassword = 'Паролі не співпадають.';
      hasError = true;
    }

    setErrors(tempErrors);
    if (hasError) return;

    setIsSubmitting(true);
    try {
      await register({ firstName, lastName, email, password, age });
      setConfirmationStep(true);
    } catch (err) {
      console.error('Register error:', err);
      const status = err.response?.status;
      const message = err.response?.data?.message;

      switch (status) {
        case 400:
          setGeneralError(message || 'Некоректні дані. Перевірте всі поля.');
          break;
        case 409:
          setGeneralError(message || 'Користувач з такою поштою вже зареєстрований.');
          break;
        case 500:
          setGeneralError('Помилка сервера. Спробуйте пізніше.');
          break;
        default:
          setGeneralError('Невідома помилка. Спробуйте ще раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setGeneralError('');
    const code = codeDigits.join('');
    if (code.length !== 6) {
      setGeneralError('Введіть 6-значний код підтвердження.');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyEmail({ email, code });
      window.location.href = '/';
    } catch (err) {
      console.error('Verify error:', err);
      const status = err.response?.status;
      const message = err.response?.data?.message;

      switch (status) {
        case 400:
          setGeneralError(message || 'Невірний код підтвердження або електронна пошта.');
          break;
        case 500:
          setGeneralError('Помилка сервера. Спробуйте ще раз пізніше.');
          break;
        default:
          setGeneralError('Помилка підтвердження. Спробуйте знову.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeDigit = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 1) return;
    const updated = [...codeDigits];
    updated[index] = value;
    setCodeDigits(updated);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDownDigit = (e, index) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleGoBack = () => {
    setConfirmationStep(false);
    setCodeDigits(['', '', '', '', '', '']);
    setEmail('');
  };

  return (
    <div className="reg2-form-container">
      <form
        className="reg2-form"
        onSubmit={confirmationStep ? handleConfirm : handleRegister}
        noValidate
      >
        <div className="top-part-reg2">
          <div className="left-side-reg2">
            <h1>
              Реєстрація на
              <br />
              Hun<span className="special-t">t</span>ee
            </h1>
          </div>

          <div className="right-side-reg2">
            {!confirmationStep ? (
              <>
                <div className="reg2-input-box">
                  <input
                    name="firstName"
                    type="text"
                    id="firstName"
                    className="reg2-input"
                    placeholder=" "
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <label htmlFor="firstName" className="reg2-input-label">Ім’я</label>
                  {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                </div>

                <div className="reg2-input-box">
                  <input
                    name="lastName"
                    type="text"
                    id="lastName"
                    className="reg2-input"
                    placeholder=" "
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <label htmlFor="lastName" className="reg2-input-label">Прізвище</label>
                </div>

                <div className="reg2-input-box">
                  <input
                    name="age"
                    type="number"
                    id="age"
                    className="reg2-input"
                    placeholder=" "
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="0"
                  />
                  <label htmlFor="age" className="reg2-input-label">Вік</label>
                </div>

                <div className="reg2-input-box">
                  <input
                    name="email"
                    type="email"
                    id="email"
                    className="reg2-input"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email" className="reg2-input-label">Пошта</label>
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                <div className="reg2-input-box">
                  <input
                    name="password"
                    type="password"
                    id="password"
                    className="reg2-input"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="password" className="reg2-input-label">Пароль</label>
                  {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                <div className="reg2-input-box">
                  <input
                    name="confirmpassword"
                    type="password"
                    id="confirmpassword"
                    className="reg2-input"
                    placeholder=" "
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label htmlFor="confirmpassword" className="reg2-input-label">Підтвердіть пароль</label>
                  {errors.confirmpassword && <p className="error-message">{errors.confirmpassword}</p>}
                </div>

                {generalError && <p className="error-message">{generalError}</p>}

                <button
                  type="submit"
                  className="reg2-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Відправка...' : 'Зареєструватися'}
                </button>
              </>
            ) : (
              <>
                <p className="confirm-text">
                  Ми надіслали код підтвердження на <b>{email}</b>
                </p>

                <div className="code-inputs" style={{ display: 'flex', gap: '10px' }}>
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      className="code-input"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChangeDigit(e, index)}
                      onKeyDown={(e) => handleKeyDownDigit(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      required
                      style={{
                        width: '44px',
                        height: '56px',
                        textAlign: 'center',
                        fontSize: '20px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                      }}
                    />
                  ))}
                </div>

                {generalError && <p className="error-message">{generalError}</p>}

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button
                    type="submit"
                    className="reg2-submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Перевірка...' : 'Підтвердити'}
                  </button>
                  <button
                    type="button"
                    className="back-btn"
                    onClick={handleGoBack}
                    disabled={isSubmitting}
                  >
                    Назад
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="horizontal-line-reg2"></div>

        <div className="bottom-part-reg2">
          <SocialLogin setError={setGeneralError} />
          <p className="reg2-footer">
            Уже є акаунт? <Link to="/login">Авторизуватися</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Reg2Form;
