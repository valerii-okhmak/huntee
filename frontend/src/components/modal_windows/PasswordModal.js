import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import PasswordInput from './PasswordInput';
import { AiFillInfoCircle } from 'react-icons/ai';
import { jwtDecode } from 'jwt-decode'; 
import { getAccessToken, getRefreshToken, saveAccessToken } from '../../utils/auth';
import axios from 'axios';

const PasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

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
      await axios.post(`/api/auth/change-password`, {
        email: sub,
        oldPassword: currentPassword,
        newPassword: newPassword,
      });

      resetForm(); 
      onClose();   
    } catch (err) {
      setError('Не вдалося змінити пароль. Перевірте введені дані.');
    }
  };

  const handleCancel = () => {
    resetForm();  
    onClose();    
  };

const isSaveDisabled =
  !currentPassword || !newPassword || !confirmPassword || error !== '';

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <button className="modal-close" onClick={onClose} aria-label="Закрити">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z"/>
        </svg>
      </button>
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
          className={`modal-button modal-button-submit ${isSaveDisabled ? "disabled" : "active"}`}
          disabled={isSaveDisabled}
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
