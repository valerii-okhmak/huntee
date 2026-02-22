import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import ModalMini from "./ModalMini";
import axios from "axios";
import { getAccessToken } from "../../utils/auth";
import Loader from "../loader/Loader"; 
import "./ModalWindow.css";

const SendMessageModal = ({ isOpen, onClose, student, allStudents = [] }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isSingleMode = !!student;

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setMessage("");
      setSelectedRecipientId(student ? student.userId : "");
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, student]);

  const handleSend = async () => {
    setError(null);
    setSuccess(false);

    if (!title.trim() || !message.trim()) {
      setError(t('sendMessageModal.errors.emptyFields'));
      return;
    }

    if (!isSingleMode && !selectedRecipientId) {
      setError(t('sendMessageModal.errors.noRecipient'));
      return;
    }

    setLoading(true);
    const token = getAccessToken();
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain' 
      }
    };

    try {
      if (!isSingleMode && selectedRecipientId === "all") {
        const promises = allStudents.map(s => 
          axios.post(
            `/api/notifications/send?recipientId=${s.userId}&title=${encodeURIComponent(title)}`,
            message,
            config
          )
        );
        await Promise.all(promises);
      } else {
        const id = isSingleMode ? student.userId : selectedRecipientId;
        await axios.post(
          `/api/notifications/send?recipientId=${id}&title=${encodeURIComponent(title)}`,
          message,
          config
        );
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Error sending message:", error);
      setError(t('sendMessageModal.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalMini isOpen={isOpen} onClose={onClose}>
      <button className="modal-close" onClick={onClose} aria-label={t('sendMessageModal.close')}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z" />
        </svg>
      </button>

      <div className="invite-modal">
        <h3 className="modalmini-title">
          {isSingleMode 
            ? t('sendMessageModal.titleSingle', { name: student.fullName })
            : t('sendMessageModal.titleBulk')}
        </h3>

        {error && (
          <div className="error-message" style={{ color: "red", marginTop: "10px", fontSize: "14px", textAlign: "center", width: "100%" }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{ color: "green", marginTop: "10px", fontSize: "14px", textAlign: "center", width: "100%" }}>
            {t('sendMessageModal.success')}
          </div>
        )}

        <div className="invite-input-container" style={{ marginTop: '20px' }}>
          <label className="modal-label" style={{ fontSize: '16px' }}>{t('sendMessageModal.labels.subject')}</label>
          <input
            type="text"
            className="modal-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('sendMessageModal.placeholders.subject')}
            disabled={loading || success}
          />
        </div>

        {!isSingleMode && (
          <div className="invite-input-container" style={{ marginTop: '15px' }}>
            <label className="modal-label" style={{ fontSize: '16px' }}>{t('sendMessageModal.labels.recipient')}</label>
            <select
              className="modal-select"
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              disabled={loading || success}
            >
              <option value="" disabled>{t('sendMessageModal.placeholders.select')}</option>
              <option value="all">{t('sendMessageModal.options.all')}</option>
              {allStudents.map(s => (
                <option key={s.userId} value={s.userId}>{s.fullName}</option>
              ))}
            </select>
          </div>
        )}

        <div className="invite-input-container" style={{ marginTop: '15px' }}>
          <label className="modal-label" style={{ fontSize: '16px' }}>{t('sendMessageModal.labels.message')}</label>
          <textarea
            className="modal-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('sendMessageModal.placeholders.message')}
            style={{ height: '120px' }}
            disabled={loading || success}
          />
        </div>

        <div className="modalmini-buttons" style={{ marginTop: '20px' }}>
          <button
            className="modalmini-button modalmini-button-submit"
            onClick={handleSend}
            disabled={loading || success}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '45px' }}
          >
            {loading ? (
              <Loader />
            ) : (
              t('sendMessageModal.buttons.send')
            )}
          </button>
        </div>
        
      </div>
    </ModalMini>
  );
};

export default SendMessageModal;