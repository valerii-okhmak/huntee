// MessageType.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './MessageType.css';

const MessageType = ({ activeRead, setActiveRead, activeType, setActiveType, counts }) => {
  const { t } = useTranslation();
  
  // 👇 Оновлені ключі (countKey)
  const readFilters = [
    { id: 'all', label: t('messageType.readFilters.all'), countKey: 'read_all' },
    { id: 'unread', label: t('messageType.readFilters.unread'), countKey: 'read_unread' },
    { id: 'read', label: t('messageType.readFilters.read'), countKey: 'read_read' }
  ];

  // 👇 Оновлені ключі (countKey)
  const typeFilters = [
    { id: 'all', label: t('messageType.typeFilters.all'), countKey: 'type_all' },
    { id: 'user', label: t('messageType.typeFilters.user'), countKey: 'type_user' }, 
    { id: 'system', label: t('messageType.typeFilters.system'), countKey: 'type_system' }
  ];

  return (
    <div className="message-type">
      <div className="message-type__container">
        {readFilters.map((type) => (
          <div
            key={type.id}
            className={`message-type__item ${activeRead === type.id ? 'message-type__item--active' : ''}`}
            onClick={() => setActiveRead(type.id)}
          >
            <span>{type.label}</span>
            <span className="message-type__count">
                {/* Без змін, просто переконайтесь що counts існує */}
                {counts ? counts[type.countKey] : 0}
            </span>
          </div>
        ))}
      </div>

      <div className="message-type__container">
        {typeFilters.map((type) => (
          <div
            key={type.id}
            className={`message-type__item ${activeType === type.id ? 'message-type__item--active' : ''}`}
            onClick={() => setActiveType(type.id)}
          >
            <span>{type.label}</span>
            <span className="message-type__count">
                {counts ? counts[type.countKey] : 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageType;