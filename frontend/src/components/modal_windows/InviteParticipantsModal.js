import React, { useState } from "react";
import ModalMini from "./ModalMini";
import axios from "axios";
import { getAccessToken } from "../../utils/auth";
import "./ModalWindow.css";

const InviteParticipantsModal = ({ isOpen, onClose, testId }) => {
  const [inviteMethod, setInviteMethod] = useState("email"); 
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  if (!isOpen) return null;

  const testLink = `${window.location.origin}/testpage/${testId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(testLink);
    setMessage({ text: "Посилання скопійовано!", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleInvite = async () => {
    if (inviteMethod === "link") {
        handleCopyLink();
        return;
    }

    if (!email.trim()) {
      setMessage({ text: "Будь ласка, введіть email", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = getAccessToken();
      
      await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/tests/${testId}/invite`,
        { email: email.trim() }, 
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      setMessage({ text: "Запрошення успішно надіслано!", type: "success" });
      setEmail("");
      setTimeout(onClose, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Помилка при відправці";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalMini isOpen={isOpen} onClose={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Закрити">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z" />
        </svg>
      </button>

      <div className="invite-modal">
        <h3 className="modalmini-title">ЗАПРОСИТИ УЧАСНИКІВ</h3>
        
        <div className="invite-modal-text">
            <p className="modalmini-subtitle">Ви можете запросити учасників до проходження тесту зручним для вас способом:</p>
            <ul className="invite-modal-list">
                <li className="modalmini-subtitle">Надіслати запрошення на пошту.</li>
                <li className="modalmini-subtitle">Приєднання за посиланням.</li>
            </ul>
        </div>

        <div className="invite-methods">
          <label className="custom-radio">
            <input 
              type="radio" 
              name="inviteMethod" 
              checked={inviteMethod === "email"} 
              onChange={() => setInviteMethod("email")}
            />
            <span className="radio-circle-blue"></span>
            <div className="invite-method-info">
              <span className="modalmini-subtitle method-title">Надіслати на пошту</span>
            </div>
          </label>

          <label className="custom-radio">
            <input 
              type="radio" 
              name="inviteMethod" 
              checked={inviteMethod === "link"} 
              onChange={() => setInviteMethod("link")}
            />
            <span className="radio-circle-blue"></span>
            <div className="invite-method-info">
              <span className="modalmini-subtitle method-title">Приєднання за посиланням</span>
            </div>
          </label>
        </div>

        <div className="invite-input-container">
            {inviteMethod === "email" ? (
            <input
                type="email"
                className="modal-input"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            ) : (
            <div className="modal-input invite-link-display" onClick={handleCopyLink}>
                {testLink}
            </div>
            )}
        </div>

        {message.text && (
          <p className={`invite-message ${message.type}`}>
            {message.text}
          </p>
        )}

        <div className="modalmini-buttons">
          <button className="modalmini-button modalmini-button-cancel" onClick={onClose}>
            Скасувати
          </button>

          <button
            className="modalmini-button modalmini-button-submit"
            onClick={handleInvite}
            disabled={loading}
          >
            {loading ? "Надсилаємо..." : (inviteMethod === "email" ? "Надіслати інвайт" : "Скопіювати")}
          </button>
        </div>
      </div>
    </ModalMini>
  );
};

export default InviteParticipantsModal;