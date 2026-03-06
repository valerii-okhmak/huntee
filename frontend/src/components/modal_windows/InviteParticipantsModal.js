import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import ModalMini from "./ModalMini";
import axios from "axios";
import { getAccessToken } from "../../utils/auth";
import "./ModalWindow.css";

const InviteParticipantsModal = ({ isOpen, onClose, testId }) => {
  const { t } = useTranslation();
  
  // Стани для базових методів
  const [inviteMethod, setInviteMethod] = useState("email"); 
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Стани для нової категорії (генерація кодів)
  const [tag, setTag] = useState("");
  const [count, setCount] = useState(30);
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const testLink = `${window.location.origin}/testpage/${testId}`;

  // Універсальна функція для показу повідомлень
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(testLink);
    showMessage(t('inviteModal.copied', 'Посилання скопійовано!'), "success");
  };

  const handleInvite = async () => {
    if (inviteMethod === "link") {
        handleCopyLink();
        return;
    }

    if (inviteMethod === "code") {
        onClose(); // Для кодів ми просто закриваємо модалку, бо коди вже згенеровані
        return;
    }

    if (!email.trim()) {
      showMessage(t('inviteModal.errors.emptyEmail', 'Введіть Email'), "error");
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = getAccessToken();
      
      await axios.post(
        `/api/tests/${testId}/invite`,
        { email: email.trim() }, 
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      showMessage(t('inviteModal.success', 'Запрошення надіслано!'), "success");
      setEmail("");
      setTimeout(onClose, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || t('inviteModal.errors.generic', 'Помилка надсилання');
      showMessage(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Логіка для генерації кодів
  const handleGenerateCodes = async () => {
    if (!tag.trim() || count < 1) {
        showMessage(t('inviteModal.errors.invalidData', 'Введіть коректну назву групи та кількість'), "error");
        return;
    }

    setIsGenerating(true);
    setMessage({ text: "", type: "" });

    try {
        const token = getAccessToken();
        const response = await axios.post(
            `/api/codes/test/${testId}/generate`, 
            { tag: tag.trim(), count: Number(count) },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );
        setGeneratedCodes(response.data);
        showMessage(t('inviteModal.codesGenerated', 'Коди успішно згенеровано!'), "success");
    } catch (error) {
        showMessage(t('inviteModal.errors.generate', 'Помилка при генерації кодів'), "error");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleCopyAllCodes = () => {
      navigator.clipboard.writeText(generatedCodes.join('\n'));
      showMessage(t('inviteModal.codesCopied', 'Усі коди скопійовано!'), "success");
  };

  const handleDownloadCSV = () => {
      const csvContent = "data:text/csv;charset=utf-8,Code\n" + generatedCodes.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `huntee_codes_${tag}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <ModalMini isOpen={isOpen} onClose={onClose}>
      <button className="modal-close" onClick={onClose} aria-label={t('inviteModal.close', 'Закрити')}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z" />
        </svg>
      </button>

      <div className="invite-modal">
        <h3 className="modalmini-title">{t('inviteModal.title', 'ЗАПРОСИТИ УЧАСНИКІВ')}</h3>
        
        <div className="invite-modal-text">
            <p className="modalmini-subtitle">{t('inviteModal.subtitle', 'Ви можете запросити учасників до проходження тесту зручним для вас способом:')}</p>
            <ul className="invite-modal-list">
                <li className="modalmini-subtitle">{t('inviteModal.options.email', 'Надіслати запрошення на пошту.')}</li>
                <li className="modalmini-subtitle">{t('inviteModal.options.link', 'Приєднання за посиланням.')}</li>
                {/* Новий пункт в списку */}
                <li className="modalmini-subtitle">{t('inviteModal.options.code', 'Генерація та приєднання за кодами (для груп).')}</li>
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
              <span className="modalmini-subtitle method-title">{t('inviteModal.methods.email', 'Надіслати на пошту')}</span>
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
              <span className="modalmini-subtitle method-title">{t('inviteModal.methods.link', 'Приєднання за посиланням')}</span>
            </div>
          </label>

          <label className="custom-radio">
            <input 
              type="radio" 
              name="inviteMethod" 
              checked={inviteMethod === "code"} 
              onChange={() => setInviteMethod("code")}
            />
            <span className="radio-circle-blue"></span>
            <div className="invite-method-info">
              <span className="modalmini-subtitle method-title">{t('inviteModal.methods.code', 'Генерація та приєднання за кодами')}</span>
            </div>
          </label>
        </div>

        <div className="invite-input-container">
            {inviteMethod === "email" && (
                <input
                    type="email"
                    className="modal-input"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            )}
            
            {inviteMethod === "link" && (
                <div className="modal-input invite-link-display" onClick={handleCopyLink}>
                    {testLink}
                </div>
            )}

            {inviteMethod === "code" && (
                <div className="generate-codes-box">
                    <h4 className="generate-codes-title">{t('inviteModal.generateTitle', 'ГЕНЕРАЦІЯ КОДІВ')}</h4>
                    
                    <div className="generate-codes-inputs">
                        <div className="generate-input-group">
                            <label>{t('inviteModal.generateLabels.tag', 'Тег групи')}</label>
                            <input 
                                value={tag} 
                                onChange={(e) => setTag(e.target.value)} 
                                placeholder="Напр. CS-101" 
                                className="modal-invite-input" 
                            />
                        </div>
                        
                        <div className="generate-input-group">
                            <label>{t('inviteModal.generateLabels.count', 'Кількість')}</label>
                        <div className="generate-count-wrapper">
                            <input 
                                type="number" 
                                value={count} 
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === '') {
                                        setCount('');
                                        return;
                                    }

                                    const num = Number(val);
                                    
                                    if (num > 100) {
                                        setCount(100);
                                    } else {
                                        setCount(num);
                                    }
                                }} 
                                onBlur={() => {
                                    if (count === '' || Number(count) < 1) {
                                        setCount(1);
                                    }
                                }}
                                className="modal-invite-input count-input" 
                                min="1" 
                                max="100"
                            />
                            <button 
                                onClick={handleGenerateCodes} 
                                className="generate-btn"
                                disabled={isGenerating}
                            >
                                {isGenerating ? "..." : t('inviteModal.generateBtn', 'Згенерувати')}
                            </button>
                        </div>
                        </div>
                    </div>

                    {generatedCodes.length > 0 && (
                        <div className="generated-results">
                            <p className="generated-subtitle">
                                {t('inviteModal.generatedListText', 'Згенеровані коди')} <strong className="tag-badge">{tag}</strong>
                            </p>
                            <div className="codes-grid">
                                {generatedCodes.map((code, index) => (
                                    <span className="code-badge" key={index}>{code}</span>
                                ))}
                            </div>
                            <div className="codes-actions">
                                <button className="action-btn-text" onClick={handleCopyAllCodes}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    {t('inviteModal.copyAll', 'Копіювати')}
                                </button>
                                <button className="action-btn-text" onClick={handleDownloadCSV}>
                                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    {t('inviteModal.downloadCsv', 'Завантажити CSV')}
                                </button>
                            </div>
                        </div>
                    )}
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
            {t('inviteModal.cancel', 'Скасувати')}
          </button>

          <button
            className="modalmini-button modalmini-button-submit"
            onClick={handleInvite}
            disabled={loading}
          >
            {loading ? t('inviteModal.sending', 'Надсилання...') : (
                inviteMethod === "email" ? t('inviteModal.sendBtn', 'Надіслати інвайт') : 
                inviteMethod === "link" ? t('inviteModal.copyBtn', 'Скопіювати') : 
                t('inviteModal.doneBtn', 'Готово')
            )}
          </button>
        </div>
      </div>
    </ModalMini>
  );
};

export default InviteParticipantsModal;