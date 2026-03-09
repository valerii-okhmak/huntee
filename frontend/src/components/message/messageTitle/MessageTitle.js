import React from 'react';
import { useTranslation } from 'react-i18next';
import './MessageTitle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const MessageTitle = ({ searchQuery, setSearchQuery, onMarkAllRead }) => {
  const { t } = useTranslation();
  
  return (
    <div className="message-title-container">
      
      {/* Верхній рядок: Текст зліва, Кнопка справа */}
      <div className="message-title-top-row">
        <div className="message-title-text-container">
          <h1 className="message-title-text">
            {t('messageTitle.text')}
          </h1>
          <p className="message-title-subtext">
            {t('messageTitle.subtext')}
          </p>
        </div>
        
        <button className="mark-all-as-read-button" onClick={onMarkAllRead}>
          {t('messageTitle.MarkAllAsRead')}
        </button>
      </div>

      <div className="message-search-container">
        <FontAwesomeIcon icon={faMagnifyingGlass} className='message-search_icon' />
        <input 
          type="text" 
          placeholder={t('messageTitle.placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

    </div>
  );
};

export default MessageTitle;