import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ModalMini from './ModalMini';
import Loader from '../loader/Loader';
import './AiGenerationModal.css'; 

const AiGenerationModal = ({ isOpen, onClose, onGenerate, loading, defaultTopic, defaultLevel, existingLevels = [] }) => {
    const { t } = useTranslation();
    
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState(5);
    const [difficulty, setDifficulty] = useState('JUNIOR');
    const [type, setType] = useState('MIXED');
    const [language, setLanguage] = useState('java');
    
    const [points, setPoints] = useState('1');
    const [levelStrategy, setLevelStrategy] = useState('auto'); 
    const [targetLevel, setTargetLevel] = useState('');
    const [customInstructions, setCustomInstructions] = useState('');

    useEffect(() => {
        if (isOpen) {
            setTopic(defaultTopic || '');
            setDifficulty(defaultLevel || 'JUNIOR');
            setCustomInstructions('');
            
            if (defaultLevel && existingLevels.some(l => l.name === defaultLevel)) {
                 setLevelStrategy('specific');
                 setTargetLevel(defaultLevel);
                 const lvl = existingLevels.find(l => l.name === defaultLevel);
                 if (lvl) setPoints(String(lvl.points));
            } else {
                 setLevelStrategy('auto');
                 setTargetLevel('');
                 setPoints('1');
            }
        }
    }, [isOpen]); 

    const handleLevelChange = (e) => {
        const val = e.target.value;
        setTargetLevel(val);
        if (val) {
            const lvl = existingLevels.find(l => l.name === val);
            if (lvl) setPoints(String(lvl.points));
        }
    };

    const handleGenerateClick = () => {
        if (!topic.trim()) {
            alert(t('aiGenerationModal.alertTopic', 'Будь ласка, введіть тему тесту')); 
            return;
        }
        if (levelStrategy === 'specific' && !targetLevel) {
            alert('Виберіть рівень, у який хочете додати питання');
            return;
        }
        
        onGenerate({ 
            topic, 
            count: parseInt(count, 10), 
            difficulty, 
            type, 
            language, 
            points: parseFloat(points) || 1,
            levelStrategy, 
            targetLevel,
            customInstructions
        });
    };

    if (!isOpen) return null;

    const isLevelSelected = targetLevel !== '' && levelStrategy === 'specific';

    return (
        <ModalMini isOpen={isOpen} onClose={loading ? null : onClose}>
             <button className="modal-close" onClick={onClose} disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z" />
                </svg>
            </button>
            
            <div className="ai-modal-container" style={{ backgroundColor: '#fff', borderRadius: '12px' }}>
                <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                    <h3 className="modalmini-title" style={{ margin: 0, fontSize: '22px' }}>{t('aiGenerationModal.title', 'AI Генерація Питань')}</h3>
                    <p className="modalmini-subtitle" style={{ color: '#666', marginTop: '5px' }}>
                        {t('aiGenerationModal.subtitle', 'Делегуй рутину штучному інтелекту')}
                    </p>
                </div>

                <div className="ai-modal-content-wrapper">
                    
                    <div style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s', width: '100%' }}>
                        
                        <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                            <div className="ai-form-group" style={{ flex: 2 }}>
                                <label className="modal-label">{t('aiGenerationModal.labels.topic', 'Тема / Технологія')}:</label>
                                <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder={t('aiGenerationModal.placeholders.topic', 'Напр. React Hooks...')} disabled={loading}/>
                            </div>
                            <div className="ai-form-group" style={{ flex: 1 }}>
                                <label className="modal-label">{t('aiGenerationModal.labels.level', 'Складність')}:</label>
                                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} disabled={loading}>
                                    <option value="TRAINEE">Trainee</option>
                                    <option value="JUNIOR">Junior</option>
                                    <option value="MIDDLE">Middle</option>
                                    <option value="SENIOR">Senior</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                            <div className="ai-form-group" style={{ flex: 1 }}>
                                <label className="modal-label">{t('aiGenerationModal.labels.count', 'Кількість')}:</label>
                                <input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="20" disabled={loading}/>
                            </div>
                            <div className="ai-form-group" style={{ flex: 1.5 }}>
                                <label className="modal-label">{t('aiGenerationModal.labels.type', 'Тип')}:</label>
                                <select value={type} onChange={e => setType(e.target.value)} disabled={loading}>
                                    <option value="MIXED">Вперемішку</option>
                                    <option value="SINGLE_CHOICE">Single Choice</option>
                                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                    <option value="TEXT">Open Text</option>
                                    <option value="CODE">Code Task</option>
                                </select>
                            </div>
                            <div className="ai-form-group" style={{ flex: 1 }}>
                                <label className="modal-label">Бали (вага):</label>
                                <input 
                                    type="number" 
                                    value={points} 
                                    onChange={e => setPoints(e.target.value)} 
                                    min="0.1" step="0.1"
                                    disabled={loading || isLevelSelected} 
                                    title={isLevelSelected ? "Синхронізовано з вибраним рівнем" : ""}
                                />
                            </div>
                        </div>

                        {(type === 'CODE' || type === 'MIXED') && (
                            <div className="ai-form-group">
                                <label className="modal-label">{t('aiGenerationModal.labels.language', 'Мова коду')}:</label>
                                <select value={language} onChange={e => setLanguage(e.target.value)} disabled={loading}>
                                    <option value="java">Java</option>
                                    <option value="python">Python</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="csharp">C#</option>
                                    <option value="cpp">C++</option>
                                </select>
                            </div>
                        )}

                        <div className="ai-strategy-box">
                            <label className="modal-label" style={{ marginBottom: '10px' }}>Розподіл по рівням тесту:</label>
                            <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                                <div className="ai-form-group" style={{ flex: 1, marginBottom: 0 }}>
                                    <select value={levelStrategy} onChange={e => setLevelStrategy(e.target.value)} disabled={loading}>
                                        <option value="auto">✨ ШІ сам створить рівні</option>
                                        <option value="specific">📂 Додати в існуючий рівень</option>
                                        <option value="none">➖ Без рівня (просто список)</option>
                                    </select>
                                </div>
                                
                                {levelStrategy === 'specific' && (
                                    <div className="ai-form-group" style={{ flex: 1, marginBottom: 0 }}>
                                        <select value={targetLevel} onChange={handleLevelChange} disabled={loading}>
                                            <option value="" disabled>Оберіть рівень...</option>
                                            {existingLevels.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="ai-form-group" style={{ width: '100%', marginBottom: 0 }}>
                            <label className="modal-label">Додаткові інструкції (Опціонально):</label>
                            <textarea 
                                placeholder="Наприклад: Зроби питання з практичними прикладами коду..."
                                value={customInstructions}
                                onChange={e => setCustomInstructions(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                    </div>

                    {loading && (
                        <div className="ai-loading-overlay">
                            <Loader />
                            <p style={{marginTop: '15px', fontWeight: 'bold', color: '#333', fontSize: '16px'}}>{t('aiGenerationModal.loading.generating', 'ШІ працює...')}</p>
                            <small style={{color: '#666', fontSize: '13px'}}>{t('aiGenerationModal.loading.wait', 'Це може зайняти 10-20 секунд')}</small>
                        </div>
                    )}
                </div>

                <div className="ai-modal-actions">
                    <button className="modalmini-button modalmini-button-cancel" onClick={onClose} disabled={loading} style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '8px' }}>
                        {t('aiGenerationModal.buttons.cancel', 'Скасувати')}
                    </button>
                    <button 
                        className="modalmini-button modalmini-button-submit" 
                        onClick={handleGenerateClick}
                        disabled={loading}
                        style={{ backgroundColor: '#6c5ce7', borderColor: '#6c5ce7', color: 'white', opacity: loading ? 0.7 : 1, padding: '10px 20px', fontSize: '14px', borderRadius: '8px', minWidth: '130px' }}
                    >
                        {loading ? t('aiGenerationModal.buttons.generating', 'Генерація...') : t('aiGenerationModal.buttons.generate', 'Згенерувати')}
                    </button>
                </div>
            </div>
        </ModalMini>
    );
};

export default AiGenerationModal;