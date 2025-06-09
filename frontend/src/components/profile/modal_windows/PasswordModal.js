import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import PasswordInput from './PasswordInput';
import { AiFillInfoCircle } from 'react-icons/ai';
import { jwtDecode } from 'jwt-decode'; 
import { getAccessToken, getRefreshToken, saveAccessToken } from '../../../utils/auth';
import axios from 'axios';

const PasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // 🔁 Автоматична перевірка під час введення
  useEffect(() => {
    if (confirmPassword.length > 0 && newPassword !== confirmPassword) {
      setError('Ваші нові паролі не співпадають');
    } else {
      setError('');
    }
  }, [newPassword, confirmPassword]);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return;
    }

    const { sub } = jwtDecode(getAccessToken());

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}/api/auth/change-password`, {
        email: sub,
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      resetForm(); // 🧹 очищення після збереження
      onClose();   // закриття модалки
    } catch (err) {
      setError('Не вдалося змінити пароль. Перевірте введені дані.');
    }
  };

  const handleCancel = () => {
    resetForm();  // 🧹 очищення при скасуванні
    onClose();    // закриття модалки
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <div className="modal-content-wrapper">
        <div className="left-side-modal">
          <h3 className="modal-label-password">Змінити пароль</h3>
          <p className="modal-text-password">
            Ми рекомендуємо вам періодично оновлювати пароль, щоб запобігти несанкціонованому доступу до вашого облікового запису.
          </p>
        </div>

        <div className="right-side-modal">
          <form className="modal-form" onSubmit={handleSubmit}>
            <PasswordInput
              placeholder="Поточний пароль"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <PasswordInput
              placeholder="Новий пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <PasswordInput
              placeholder="Підтвердіть новий пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <p className="error-message">
                <AiFillInfoCircle className="error-znak" />
                {error}
              </p>
            )}
            <div className="modal-buttons">
              <button
                type="button"
                className="modal-button-password modal-button-cancel"
                onClick={handleCancel}
              >
                Скасувати
              </button>
              <button
                type="submit"
                className="modal-button-password modal-button-submit"
              >
                Зберегти
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordModal;
