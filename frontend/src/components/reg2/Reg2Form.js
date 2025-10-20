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
  const [error, setError] = useState(''); 
  const [passwordError, setPasswordError] = useState(''); // окрема помилка для паролів
  const [isSubmitting, setIsSubmitting] = useState(false);

  // простий regex для перевірки e-mail
  const validateEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

  // Якщо користувач змінює пароль або підтвердження — перевірка збігу (не чіпаємо глобальний error)
  useEffect(() => {
    if (!confirmpassword) {
      setPasswordError('');
      return;
    }

    if (password === confirmpassword) {
      setPasswordError('');
    } else {
      setPasswordError('Паролі не співпадають.');
    }
  }, [password, confirmpassword]);

  const CheckPasswordMatch = (confirm) => {
    setConfirmPassword(confirm);
    if (!confirm) {
      setPasswordError('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // локальна валідація полів — виставляємо відповідні помилки в потрібні стани
    if (!firstName.trim()) {
      setError("Імʼя обовʼязкове.");
      return;
    }
    if (!validateEmail(email)) {
      setError('Введіть коректну пошту.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Пароль повинен містити щонайменше 6 символів.');
      return;
    }
    if (password !== confirmpassword) {
      setPasswordError('Паролі не співпадають. Перевірте поле підтвердження пароля.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ firstName, lastName, email, password, age });
      setConfirmationStep(true);
      // setError('');
    } catch (err) {
      console.error('Register error:', err);
      const status = err.response?.status;
      const message = err.response?.data?.message;

      switch (status) {
        case 400:
          setError(message || 'Некоректні дані. Перевірте всі поля.');
          break;
        case 409:
          setError(message || 'Користувач з такою поштою вже зареєстрований.');
          break;
        case 500:
          setError('Помилка сервера. Спробуйте пізніше.');
          break;
        default:
          setError('Невідома помилка. Спробуйте ще раз.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError('');
    const code = codeDigits.join('');
    if (code.length !== 6) {
      setError('Введіть 6-значний код підтвердження.');
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
          setError(message || 'Невірний код підтвердження або електронна пошта.');
          break;
        case 500:
          setError('Помилка сервера. Спробуйте ще раз пізніше.');
          break;
        default:
          setError('Помилка підтвердження. Спробуйте знову.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // код підтвердження: дозволяємо тільки цифри, автоматично фокус на наступне поле
  const handleChangeDigit = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 1) return;
    const updated = [...codeDigits];
    updated[index] = value;
    setCodeDigits(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
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
    // залишаємо email для зручності редагування
  };

  // чи можна відправляти форму (кнопка активна)
  const isFormValid =
    firstName.trim() &&
    validateEmail(email) &&
    password.length >= 6 &&
    password === confirmpassword &&
    !passwordError;

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
                    required
                    placeholder=" "
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    aria-invalid={!!(error && !firstName.trim())}
                  />
                  <label htmlFor="firstName" className="reg2-input-label">
                    Ім’я
                  </label>
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
                  <label htmlFor="lastName" className="reg2-input-label">
                    Прізвище
                  </label>
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
                    aria-invalid={false}
                  />
                  <label htmlFor="age" className="reg2-input-label">
                    Вік
                  </label>
                </div>

                <div className="reg2-input-box">
                  <input
                    name="email"
                    type="email"
                    id="email"
                    className="reg2-input"
                    required
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!(error && !validateEmail(email))}
                  />
                  <label htmlFor="email" className="reg2-input-label">
                    Пошта
                  </label>
                </div>

                <div className="reg2-input-box">
                  <input
                    name="password"
                    type="password"
                    id="password"
                    className="reg2-input"
                    required
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!(passwordError || (error && password.length < 6))}
                    aria-describedby="password-help"
                  />
                  <label htmlFor="password" className="reg2-input-label">
                    Пароль
                  </label>
                </div>

                <div className="reg2-input-box">
                  <input
                    name="confirmpassword"
                    type="password"
                    id="confirmpassword"
                    className="reg2-input"
                    required
                    placeholder=" "
                    value={confirmpassword}
                    onChange={(e) => CheckPasswordMatch(e.target.value)}
                    aria-invalid={!!passwordError}
                  />
                  <label htmlFor="confirmpassword" className="reg2-input-label">
                    Підтвердіть пароль
                  </label>
                </div>

                {/* показуємо помилку пароля окремо від загальної помилки */}
                {passwordError && (
                  <p
                    className="error-message"
                    role="alert"
                    aria-live="assertive"
                    style={{ color: '#d93025', marginTop: 8 }}
                  >
                    {passwordError}
                  </p>
                )}

                {error && (
                  <p
                    className="error-message"
                    role="alert"
                    aria-live="polite"
                    style={{ color: '#d93025', marginTop: 8 }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="reg2-submit-button"
                  disabled={isSubmitting || !isFormValid}
                  aria-disabled={isSubmitting || !isFormValid}
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

                {error && (
                  <p className="error-message" style={{ color: '#d93025'}}>
                    {error}
                  </p>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button
                    type="submit"
                    className="reg2-submit-button"
                    disabled={isSubmitting}
                    aria-disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Перевірка...' : 'Підтвердити'}
                  </button>
                  <button type="button" className="back-btn" onClick={handleGoBack} disabled={isSubmitting}>
                    Назад
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="horizontal-line-reg2"></div>

        <div className="bottom-part-reg2">
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
