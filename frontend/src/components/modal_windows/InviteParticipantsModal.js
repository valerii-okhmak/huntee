import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import ModalMini from "./ModalMini";
import axios from "axios";
import { getAccessToken } from "../../utils/auth";
import "./ModalWindow.css";


const InviteParticipantsModal = ({ isOpen, onClose, testId, isPrivate }) => {
  const { t } = useTranslation();
  
  const [inviteMethod, setInviteMethod] = useState("email"); 
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [tag, setTag] = useState("");
  const [count, setCount] = useState(30);
  
  const [allCodes, setAllCodes] = useState([]); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingCodes, setIsLoadingCodes] = useState(false);

  const testLink = `${window.location.origin}/testpage/${testId}`;

  useEffect(() => {
    if (isOpen && isPrivate && inviteMethod === "link") {
      setInviteMethod("email");
    }
    
    if (isOpen && inviteMethod === "code") {
        fetchExistingCodes();
    }
  }, [isOpen, inviteMethod, testId, isPrivate]);

  const fetchExistingCodes = async () => {
    setIsLoadingCodes(true);
    try {
        const token = getAccessToken();
        const response = await axios.get(`/api/codes/test/${testId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setAllCodes(response.data || []);
    } catch (error) {
        console.error("Не вдалося завантажити існуючі коди", error);
    } finally {
        setIsLoadingCodes(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(testLink);
    showMessage(t('inviteModal.copied', 'Посилання скопійовано!'), "success");
  };

  const handleInvite = async () => {
    if (inviteMethod === "link" || inviteMethod === "code") {
        onClose(); 
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
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
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
        setAllCodes(prev => [...response.data, ...prev]);
        setTag("");
        showMessage(t('inviteModal.codesGenerated', 'Коди успішно згенеровано!'), "success");
    } catch (error) {
        showMessage(t('inviteModal.errors.generate', 'Помилка при генерації кодів'), "error");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleCopyAllCodes = (codesList) => {
      const textToCopy = codesList.map(c => c.code).join('\n');
      navigator.clipboard.writeText(textToCopy);
      showMessage(t('inviteModal.codesCopied', 'Усі коди скопійовано!'), "success");
  };

  const handleDownloadCSV = (groupTag, codesList) => {
      const header = "Code,Status,Used By Email,Used By Name\n";
      const rows = codesList.map(c => 
          `${c.code},${c.isUsed ? 'Used' : 'Available'},${c.usedByEmail || ''},${c.usedByName || ''}`
      ).join("\n");
      
      const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + header + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `huntee_codes_${groupTag}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  if (!isOpen) return null;

  const groupedCodes = allCodes.reduce((acc, code) => {
      const groupTag = code.tag || "Загальні";
      if (!acc[groupTag]) acc[groupTag] = [];
      acc[groupTag].push(code);
      return acc;
  }, {});

  return (
    <ModalMini isOpen={isOpen} onClose={onClose}>
      <button className="modal-close" onClick={onClose}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z" />
        </svg>
      </button>

      <div className="invite-modal" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <h3 className="modalmini-title">{t('inviteModal.title', 'ЗАПРОСИТИ УЧАСНИКІВ')}</h3>
        
        <div className="invite-modal-text">
            <p className="modalmini-subtitle">{t('inviteModal.subtitle', 'Ви можете запросити учасників до проходження тесту зручним для вас способом:')}</p>
            <ul className="invite-modal-list" style={{ marginLeft: '20px', marginBottom: '20px', fontSize: '14px', color: '#666' }}>
                <li>{t('inviteModal.options.email', 'Надіслати запрошення на пошту.')}</li>
                {!isPrivate && (
                    <li>{t('inviteModal.options.link', 'Приєднання за посиланням.')}</li>
                )}
                <li>{t('inviteModal.options.code', 'Генерація та приєднання за кодами (для груп).')}</li>
            </ul>
        </div>

        <div className="invite-methods">
          <label className="custom-radio">
            <input type="radio" name="inviteMethod" checked={inviteMethod === "email"} onChange={() => setInviteMethod("email")} />
            <span className="radio-circle-blue"></span>
            <div className="invite-method-info">
              <span className="modalmini-subtitle method-title">{t('inviteModal.methods.email', 'Надіслати на пошту')}</span>
            </div>
          </label>

          {!isPrivate && (
              <label className="custom-radio">
                <input type="radio" name="inviteMethod" checked={inviteMethod === "link"} onChange={() => setInviteMethod("link")} />
                <span className="radio-circle-blue"></span>
                <div className="invite-method-info">
                  <span className="modalmini-subtitle method-title">{t('inviteModal.methods.link', 'Приєднання за посиланням')}</span>
                </div>
              </label>
          )}

          <label className="custom-radio">
            <input type="radio" name="inviteMethod" checked={inviteMethod === "code"} onChange={() => setInviteMethod("code")} />
            <span className="radio-circle-blue"></span>
            <div className="invite-method-info">
              <span className="modalmini-subtitle method-title">{t('inviteModal.methods.code', 'Генерація та приєднання за кодами')}</span>
            </div>
          </label>
        </div>

        <div className="invite-input-container">
            {inviteMethod === "email" && (
                <input type="email" className="modal-input" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            )}
            
            {!isPrivate && inviteMethod === "link" && (
                <div className="modal-input invite-link-display" onClick={handleCopyLink}>{testLink}</div>
            )}

            {inviteMethod === "code" && (
                <div className="generate-codes-box">
                    <h4 className="generate-codes-title">{t('inviteModal.generateTitle', 'ГЕНЕРАЦІЯ КОДІВ')}</h4>
                    
                    <div className="generate-codes-inputs">
                        <div className="generate-input-group">
                            <label>{t('inviteModal.generateLabels.tag', 'Тег групи')}</label>
                            <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Напр. CS-101" className="modal-invite-input" />
                        </div>
                        
                        <div className="generate-input-group">
                            <label>{t('inviteModal.generateLabels.count', 'Кількість')}</label>
                            <div className="generate-count-wrapper">
                                <input 
                                    type="number" value={count} 
                                    onChange={(e) => {
                                        const num = Number(e.target.value);
                                        setCount(num > 100 ? 100 : (e.target.value === '' ? '' : num));
                                    }} 
                                    onBlur={() => { if (count === '' || Number(count) < 1) setCount(1); }}
                                    className="modal-invite-input count-input" min="1" max="100"
                                />
                                <button onClick={handleGenerateCodes} className="generate-btn" disabled={isGenerating}>
                                    {isGenerating ? "..." : t('inviteModal.generateBtn', 'Згенерувати')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        {isLoadingCodes ? (
                            <p style={{ textAlign: 'center', color: '#666' }}>Завантаження кодів...</p>
                        ) : Object.keys(groupedCodes).length > 0 ? (
                            Object.entries(groupedCodes).map(([groupTag, codesList]) => {
                                const usedCount = codesList.filter(c => c.isUsed).length;
                                return (
                                    <div key={groupTag} className="code-group-container" style={{ marginBottom: '15px', border: '1px solid #eaeaea', borderRadius: '8px', padding: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <strong style={{ fontSize: '15px', color: '#333' }}>Група: {groupTag}</strong>
                                            <span style={{ fontSize: '12px', color: '#666' }}>Використано: {usedCount} / {codesList.length}</span>
                                        </div>
                                        
                                        <div style={{ maxHeight: '150px', overflowY: 'auto', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                            {codesList.map((c, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', backgroundColor: c.isUsed ? '#f8d7da' : '#e6f4ea', borderRadius: '6px', fontSize: '13px' }}>
                                                    <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{c.code}</span>
                                                    {c.isUsed ? (
                                                        <span style={{ color: '#721c24' }} title={c.usedByEmail}>{c.usedByName || c.usedByEmail || 'Використано'}</span>
                                                    ) : (
                                                        <span style={{ color: '#155724' }}>Доступно</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="codes-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                            <button className="action-btn-text" onClick={() => handleCopyAllCodes(codesList)} style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '13px' }}>
                                                Копіювати всі
                                            </button>
                                            <button className="action-btn-text" onClick={() => handleDownloadCSV(groupTag, codesList)} style={{ background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontSize: '13px' }}>
                                                Завантажити CSV
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p style={{ textAlign: 'center', color: '#888', fontSize: '13px' }}>Для цього тесту ще не згенеровано жодного коду.</p>
                        )}
                    </div>
                </div>
            )}
        </div>

        {message.text && (<p className={`invite-message ${message.type}`}>{message.text}</p>)}

        <div className="modalmini-buttons">
          <button className="modalmini-button modalmini-button-cancel" onClick={onClose}>{t('inviteModal.cancel', 'Скасувати')}</button>
          <button className="modalmini-button modalmini-button-submit" onClick={handleInvite} disabled={loading}>
            {loading ? t('inviteModal.sending', 'Надсилання...') : (inviteMethod === "email" ? t('inviteModal.sendBtn', 'Надіслати інвайт') : (!isPrivate && inviteMethod === "link") ? t('inviteModal.copyBtn', 'Скопіювати') : t('inviteModal.doneBtn', 'Готово'))}
          </button>
        </div>
      </div>
    </ModalMini>
  );
};

export default InviteParticipantsModal;