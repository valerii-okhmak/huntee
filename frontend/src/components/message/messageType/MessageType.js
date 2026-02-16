import React from 'react';
import { useTranslation } from 'react-i18next';
import './MessageType.css';

// 👇 Додали counts у пропси
const MessageType = ({ activeRead, setActiveRead, activeType, setActiveType, counts }) => {
  const { t } = useTranslation();
  
  // Додали поле key, яке відповідає ключам в об'єкті counts
  const readFilters = [
    { id: 'all', label: t('messageType.readFilters.all'), countKey: 'all' },
    { id: 'unread', label: t('messageType.readFilters.unread'), countKey: 'unread' },
    { id: 'read', label: t('messageType.readFilters.read'), countKey: 'read' }
  ];

  const typeFilters = [
    { id: 'all', label: t('messageType.typeFilters.all'), countKey: 'all' },
    { id: 'user', label: t('messageType.typeFilters.user'), countKey: 'user' }, 
    { id: 'system', label: t('messageType.typeFilters.system'), countKey: 'system' }
  ];

  return (
    <div className="message-type">
      {/* Перша група фільтрів */}
      <div className="message-type__container">
        {readFilters.map((type) => (
          <div
            key={type.id}
            className={`message-type__item ${activeRead === type.id ? 'message-type__item--active' : ''}`}
            onClick={() => setActiveRead(type.id)}
          >
            <span>{type.label}</span>
            {/* 👇 Виводимо цифру, якщо counts існує */}
            <span className="message-type__count">
                {counts ? counts[type.countKey] : 0}
            </span>
          </div>
        ))}
      </div>

      {/* Друга група фільтрів */}
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