import React, { useState, useEffect } from 'react';
import ModalMini from './ModalMini';
import Loader from '../loader/Loader';
import './AiGenerationModal.css'; 

const AiGenerationModal = ({ isOpen, onClose, onGenerate, loading, defaultTopic, defaultLevel }) => {
    const [topic, setTopic] = useState(defaultTopic || '');
    const [count, setCount] = useState(5);
    const [difficulty, setDifficulty] = useState(defaultLevel || 'JUNIOR');
    const [type, setType] = useState('SINGLE_CHOICE');
    const [language, setLanguage] = useState('java');

    useEffect(() => {
        if (isOpen) {
            setTopic(defaultTopic || '');
            setDifficulty(defaultLevel || 'JUNIOR');
        }
    }, [isOpen, defaultTopic, defaultLevel]);

    const handleGenerateClick = () => {
        if (!topic.trim()) {
            alert("Будь ласка, вкажіть тему."); 
            return;
        }
        onGenerate({ topic, count, difficulty, type, language });
    };

    if (!isOpen) return null;

    return (
        <ModalMini isOpen={isOpen} onClose={loading ? null : onClose}>
             <button className="modal-close" onClick={onClose} disabled={loading}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M14.2548 4.75488C14.5282 4.48152 14.9717 4.48152 15.2451 4.75488C15.5184 5.02825 15.5184 5.47175 15.2451 5.74512L10.9902 10L15.2451 14.2549C15.5184 14.5283 15.5184 14.9717 15.2451 15.2451C14.9717 15.5184 14.5282 15.5184 14.2548 15.2451L10 10.9902L5.74512 15.2451C5.47175 15.5184 5.02825 15.5184 4.75488 15.2451C4.48146 14.9717 4.48146 14.5283 4.75488 14.2549L9.00977 10L4.75488 5.74512C4.48146 5.47175 4.48146 5.02825 4.75488 4.75488C5.02825 4.48152 5.47175 4.48152 5.74512 4.75488L10 9.00977L14.2548 4.75488Z" />
                </svg>
            </button>
            
            <div className="invite-modal">
                <h3 className="modalmini-title">✨ AI Генерація Питань</h3>
                <p className="modalmini-subtitle">Налаштуйте параметри для автоматичної генерації.</p>

                <div className="ai-modal-content-wrapper">
                    
                    <div className="modal-form" style={{opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s'}}>
                        <div>
                            <label className="modal-label" style={{fontSize: '16px'}}>Тема:</label>
                            <input type="text" className="modal-input" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Напр. Java Collections" disabled={loading}/>
                        </div>

                        <div style={{display: 'flex', gap: '20px'}}>
                             <div style={{flex: 1}}>
                                <label className="modal-label" style={{fontSize: '16px'}}>Кількість:</label>
                                <input type="number" className="modal-input" value={count} onChange={e => setCount(e.target.value)} min="1" max="20" disabled={loading}/>
                            </div>
                            <div style={{flex: 1}}>
                                <label className="modal-label" style={{fontSize: '16px'}}>Рівень:</label>
                                <select className="modal-select" value={difficulty} onChange={e => setDifficulty(e.target.value)} disabled={loading}>
                                    <option value="TRAINEE">Trainee</option>
                                    <option value="JUNIOR">Junior</option>
                                    <option value="MIDDLE">Middle</option>
                                    <option value="SENIOR">Senior</option>
                                </select>
                            </div>
                        </div>
                         <div style={{display: 'flex', gap: '20px'}}>
                            <div style={{flex: 1}}>
                                <label className="modal-label" style={{fontSize: '16px'}}>Тип питань:</label>
                                <select className="modal-select" value={type} onChange={e => setType(e.target.value)} disabled={loading}>
                                    <option value="SINGLE_CHOICE">Single Choice</option>
                                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                    <option value="TEXT">Open Text</option>
                                    <option value="CODE">Code Task</option>
                                </select>
                            </div>
                            {type === 'CODE' && (
                                <div style={{flex: 1}}>
                                    <label className="modal-label" style={{fontSize: '16px'}}>Мова:</label>
                                    <select className="modal-select" value={language} onChange={e => setLanguage(e.target.value)} disabled={loading}>
                                        <option value="java">Java</option>
                                        <option value="python">Python</option>
                                        <option value="javascript">JavaScript</option>
                                        <option value="csharp">C#</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {loading && (
                        <div className="ai-loading-overlay">
                            <Loader />
                            <p style={{marginTop: '15px', fontWeight: 'bold', color: '#555'}}>Генеруємо питання...</p>
                            <small style={{color: '#777'}}>Це може зайняти до 30 секунд</small>
                        </div>
                    )}
                </div>

                <div className="modalmini-buttons" style={{marginTop: '20px'}}>
                    <button className="modalmini-button modalmini-button-cancel" onClick={onClose} disabled={loading}>
                        Скасувати
                    </button>
                    <button 
                        className="modalmini-button modalmini-button-submit" 
                        onClick={handleGenerateClick}
                        disabled={loading}
                        style={{ backgroundColor: '#6c5ce7', borderColor: '#6c5ce7', color: 'white', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Генерація...' : '✨ Згенерувати'}
                    </button>
                </div>
            </div>
        </ModalMini>
    );
};

export default AiGenerationModal;