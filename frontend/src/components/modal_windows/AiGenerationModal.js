import React, { useState } from 'react';
import './AiGenerationModal.css'; 

const AiGenerationModal = ({ isOpen, onClose, onGenerate, defaultTopic, defaultLevel, loading }) => {
  const [topic, setTopic] = useState(defaultTopic || '');
  const [count, setCount] = useState(3);
  const [difficulty, setDifficulty] = useState(defaultLevel || 'JUNIOR');
  const [language, setLanguage] = useState('Ukrainian');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onGenerate({ topic, count, difficulty, language, type: 'MIXED' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 

        className="modalmini-content ai-modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title" style={{ marginBottom: '0.5rem' }}>
          ✨ AI Генерація
        </h3>
        
        <div className="ai-form-group">
          <label className="ai-form-label">Тема:</label>
          <input 
            className="modal-input"
            type="text" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            placeholder="Напр. Java Core, React Hooks..."
          />
        </div>

        <div className="ai-form-group">
          <label className="ai-form-label">Кількість (макс 5):</label>
          <input 
            className="modal-input"
            type="number" 
            min="1" 
            max="5" 
            value={count} 
            onChange={(e) => setCount(Number(e.target.value))} 
          />
        </div>

        <div className="ai-form-group">
          <label className="ai-form-label">Рівень:</label>
          <select 
            className="modal-select"
            value={difficulty} 
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="JUNIOR" className="modal-select-option">Junior</option>
            <option value="MIDDLE" className="modal-select-option">Middle</option>
            <option value="SENIOR" className="modal-select-option">Senior</option>
          </select>
        </div>

        <div className="ai-form-group">
          <label className="ai-form-label">Мова:</label>
          <select 
            className="modal-select"
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="Ukrainian" className="modal-select-option">Українська</option>
            <option value="English" className="modal-select-option">English</option>
          </select>
        </div>

        <div className="ai-modal-actions">
          <button 
            className="modal-button modalmini-button-cancel" 
            onClick={onClose} 
            disabled={loading}
          >
            Скасувати
          </button>
          
          <button 
            className="modal-button modalmini-button-submit" 
            onClick={handleSubmit} 
            disabled={loading}
            style={{ minWidth: '140px' }} 
          >
            {loading ? 'Генеруємо...' : 'Згенерувати'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiGenerationModal;