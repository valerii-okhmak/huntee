import React from 'react';
import { useTranslation } from 'react-i18next';
import './MessageTitle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const MessageTitle = ({ searchQuery, setSearchQuery, onMarkAllRead }) => {
  const { t } = useTranslation();
  
  return (
    <div className="message-title-container">
      <h1 className="message-title-text">
        {t('messageTitle.text')}
      </h1>
      
        <div className="message-search-container">
          <FontAwesomeIcon icon={faMagnifyingGlass} className='message-search_icon' />

          <input 
            type="text" 
            placeholder={t('messageTitle.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <button className="mark-all-as-read-button" onClick={onMarkAllRead}>
          {t('messageTitle.MarkAllAsRead')}
        </button>
    </div>
  );
};

export default MessageTitle;