import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalMini from './ModalMini'; 
import { getAccessToken } from '../../utils/auth';
import './ModalWindow.css'; 

const ActivateCodeModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [codeValues, setCodeValues] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setCodeValues(Array(6).fill(""));
      setMessage({ text: "", type: "" });
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index, e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); 
    if (!value && e.target.value !== "") return; 

    const newCodeValues = [...codeValues];
    newCodeValues[index] = value.slice(-1);
    setCodeValues(newCodeValues);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!codeValues[index] && index > 0) {
        const newCodeValues = [...codeValues];
        newCodeValues[index - 1] = "";
        setCodeValues(newCodeValues);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCodeValues = [...codeValues];
        newCodeValues[index] = "";
        setCodeValues(newCodeValues);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6);

    if (!pastedText) return;

    const newCodeValues = [...codeValues];
    for (let i = 0; i < 6; i++) {
      newCodeValues[i] = pastedText[i] || "";
    }
    setCodeValues(newCodeValues);

    const focusIndex = Math.min(pastedText.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

const handleActivate = async () => {
    const rawCode = codeValues.join("");

    if (rawCode.length < 6) {
      setMessage({ text: t('activateCodeModal.emptyCodeError', 'Введіть код повністю'), type: 'error' });
      return;
    }

    const fullCode = `${rawCode.slice(0, 3)}-${rawCode.slice(3)}`;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = getAccessToken();
      const response = await axios.post(
        '/api/codes/activate', 
        { code: fullCode },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const testId = response.data.testId;
      
      setMessage({ text: t('activateCodeModal.success', 'Успішно! Перенаправлення...'), type: 'success' });
      
      setTimeout(() => {
        onClose();
        navigate(`/testpage/${testId}`);
      }, 1000);

    } catch (err) {
      const errorMsg = err.response?.data || t('activateCodeModal.defaultError', 'Помилка активації');
      setMessage({ text: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalMini isOpen={isOpen} onClose={onClose}>
      <button className="modal-close" onClick={onClose} aria-label={t('activateCodeModal.close')}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z" />
        </svg>
      </button>

      <div className="invite-modal">
        <h3 className="modalmini-title">{t('activateCodeModal.title')}</h3>
        
        <div className="segmented-input-wrapper">
          {codeValues.map((val, index) => (
            <React.Fragment key={index}>
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                className="segmented-input-cell"
                value={val}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoComplete="off"
              />
              {index === 2 && <span className="segmented-input-separator">-</span>}
            </React.Fragment>
          ))}
        </div>

        {message.text && (
          <p className={`invite-message ${message.type}`}>
            {message.text}
          </p>
        )}

        <div className="modalmini-buttons">
          <button className="modalmini-button modalmini-button-cancel" onClick={onClose} disabled={loading}>
            {t('activateCodeModal.cancel')}
          </button>

          <button
            className="modalmini-button modalmini-button-submit"
            onClick={handleActivate}
            disabled={loading || codeValues.join("").length < 6}
          >
            {loading ? '...' : t('activateCodeModal.submitBtn')}
          </button>
        </div>
      </div>
    </ModalMini>
  );
};

export default ActivateCodeModal;