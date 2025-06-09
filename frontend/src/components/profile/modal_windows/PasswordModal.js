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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return; // Уже показано повідомлення — нічого не робимо
    }
    const { sub } = jwtDecode(getAccessToken());
    const response = await axios.post(`${import.meta.env.BACKEND}/api/auth/change-password`, {
        email: sub,
        oldPassword: currentPassword,
        newPassword: newPassword,
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
              <button type="button" className="modal-button-password modal-button-cancel" onClick={onClose}>
                Скасувати
              </button>
              <button type="submit" className="modal-button-password modal-button-submit">
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
