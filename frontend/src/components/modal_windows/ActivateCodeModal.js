import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalMini from './ModalMini'; 
import { getAccessToken } from '../../utils/auth';

const ActivateCodeModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  if (!isOpen) return null;

  const handleActivate = async () => {
    if (!accessCode.trim()) {
      setMessage({ text: t('activateCodeModal.emptyCodeError'), type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = getAccessToken();
      const response = await axios.post(
        '/api/codes/activate', 
        { code: accessCode.trim().toUpperCase() }, 
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      const testId = response.data.testId;
      
      setMessage({ text: t('activateCodeModal.success'), type: 'success' });
      
      setTimeout(() => {
        onClose();
        navigate(`/testpage/${testId}`);
      }, 1000);

    } catch (err) {
      const errorMsg = err.response?.data || t('activateCodeModal.defaultError');
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
        
        <div className="invite-input-container" style={{ marginTop: '15px' }}>
          <input 
            type="text" 
            className="modal-input code-input"
            style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontSize: '16px', letterSpacing: '1px' }}
            placeholder={t('activateCodeModal.placeholder')}
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
          />
        </div>

        {message.text && (
          <p className={`invite-message ${message.type}`}>
            {message.text}
          </p>
        )}

        <div className="modalmini-buttons" style={{ marginTop: '20px' }}>
          <button className="modalmini-button modalmini-button-cancel" onClick={onClose}>
            {t('activateCodeModal.cancel')}
          </button>

          <button
            className="modalmini-button modalmini-button-submit"
            onClick={handleActivate}
            disabled={loading}
          >
            {loading ? '...' : t('activateCodeModal.submitBtn')}
          </button>
        </div>
      </div>
    </ModalMini>
  );
};

export default ActivateCodeModal;