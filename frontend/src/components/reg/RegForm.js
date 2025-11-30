import React, { useState, useRef, useEffect } from 'react';
import './RegForm.css';
import SocialLogin from '../SocialLogin/SocialLogin';
import { Link, useNavigate } from 'react-router-dom';
import { register, verifyEmail } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const RegForm = () => {
  const navigate = useNavigate();

  // Поля реєстрації
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // Підтвердження пошти
  const [confirmationStep, setConfirmationStep] = useState(false);
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Помилки та стани
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: '',
    confirmpassword: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

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
    setErrors({ firstName: '', email: '', password: '', confirmpassword: '', general: '' });

    let tempErrors = { firstName: '', email: '', password: '', confirmpassword: '', general: '' };
    let hasError = false;

    if (!firstName.trim()) {
      tempErrors.firstName = "Імʼя обовʼязкове.";
      hasError = true;
    }
    if (!lastName.trim()) {
      tempErrors.lastName = "Прізвище обовʼязкове.";
      hasError = true;
    }
    if (!age || isNaN(age) || age <= 0) {
      tempErrors.age = 'Введіть коректний вік.';
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
      const status = err.response?.status;
      const message = err.response?.data?.message;
      let generalMsg = '';

      switch (status) {
        case 400:
          generalMsg = message || 'Некоректні дані. Перевірте всі поля.';
          break;
        case 403:
          generalMsg = message || 'Доступ заборонено. Дозволено лише пошти @lpnu.ua.';
          break;
        case 409:
          generalMsg = message || 'Користувач з такою поштою вже зареєстрований.';
          break;
        case 500:
          generalMsg = 'Помилка сервера. Спробуйте пізніше.';
          break;
        default:
          generalMsg = 'Невідома помилка. Спробуйте ще раз.';
      }

      setErrors((prev) => ({ ...prev, general: generalMsg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, general: '' }));

    const code = codeDigits.join('');
    if (code.length !== 6) {
      setErrors((prev) => ({ ...prev, general: 'Введіть 6-значний код підтвердження.' }));
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyEmail({ email, code });
      navigate('/login');
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      let generalMsg = '';

      switch (status) {
        case 400:
          generalMsg = message || 'Невірний код підтвердження або електронна пошта.';
          break;
        case 500:
          generalMsg = 'Помилка сервера. Спробуйте ще раз пізніше.';
          break;
        default:
          generalMsg = 'Помилка підтвердження. Спробуйте знову.';
      }

      setErrors((prev) => ({ ...prev, general: generalMsg }));
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
    <div className="reg-form-container">
      <form
        className="reg-form"
        onSubmit={confirmationStep ? handleConfirm : handleRegister}
        noValidate
      >
        <div className="top-part-reg">
          <div className="left-side-reg">
            <h1>
              Реєстрація на
              <br />
              Hun<span className="special-t">t</span>ee
            </h1>
          </div>

          <div className="right-side-reg">
            {!confirmationStep ? (
              <>
                {/* Ім'я */}
                <div className="reg-input-box">
                  <input
                    name="firstName"
                    type="text"
                    id="firstName"
                    className={`reg-input ${errors.firstName ? 'input-error' : ''}`}
                    placeholder=" "
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <label htmlFor="firstName" className="reg-input-label">Ім’я</label>
                  {errors.firstName && <span className="input-error-message">{errors.firstName}</span>}
                </div>

                {/* Прізвище */}
                <div className="reg-input-box">
                  <input
                    name="lastName"
                    type="text"
                    id="lastName"
                    className={`reg-input ${errors.lastName ? 'input-error' : ''}`}
                    placeholder=" "
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  <label htmlFor="lastName" className="reg-input-label">Прізвище</label>
                  {errors.lastName && <span className="input-error-message">{errors.lastName}</span>}
                </div>

                {/* Вік */}
                <div className="reg-input-box">
                  <input
                    name="age"
                    type="number"
                    id="age"
                    className={`reg-input ${errors.age ? 'input-error' : ''}`}
                    placeholder=" "
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="0"
                  />
                  <label htmlFor="age" className="reg-input-label">Вік</label>
                  {errors.age && <span className="input-error-message">{errors.age}</span>}
                </div>

                {/* Пошта */}
                <div className="reg-input-box">
                  <input
                    name="email"
                    type="email"
                    id="email"
                    className={`reg-input ${errors.email ? 'input-error' : ''}`}
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email" className="reg-input-label">Пошта</label>
                  {errors.email && <span className="input-error-message">{errors.email}</span>}
                </div>

                {/* Пароль */}
                <div className="reg-input-box password-box">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`reg-input ${errors.password ? 'input-error' : ''}`}
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="password" className="reg-input-label">Пароль</label>

                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>

                  {errors.password && <span className="input-error-message">{errors.password}</span>}
                </div>

                {/* Підтвердження пароля */}
                <div className="reg-input-box password-box">
                  <input
                    name="confirmpassword"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmpassword"
                    className={`reg-input ${errors.confirmpassword ? 'input-error' : ''}`}
                    placeholder=" "
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label htmlFor="confirmpassword" className="reg-input-label">Підтвердіть пароль</label>

                  <span
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </span>

                  {errors.confirmpassword && <span className="input-error-message">{errors.confirmpassword}</span>}
                </div>

                {/* Загальна помилка */}
                {errors.general && <span className="input-error-message">{errors.general}</span>}

                <button
                  type="submit"
                  className="reg-submit-button"
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

                {/* Помилка підтвердження */}
                {errors.general && <span className="input-error-message">{errors.general}</span>}

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button
                    type="submit"
                    className="reg-submit-button"
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

        <div className="horizontal-line-reg"></div>

        <div className="bottom-part-reg">
          <SocialLogin setError={(msg) => setErrors((prev) => ({ ...prev, general: msg }))} />
          <p className="reg-footer">
            Уже є акаунт? <Link to="/login">Авторизуватися</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegForm;
