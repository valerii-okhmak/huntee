import React from 'react';
import { useTranslation } from 'react-i18next';
import './MessageType.css';

const MessageType = ({ activeRead, setActiveRead, activeType, setActiveType }) => {
  const { t } = useTranslation();
  
  const readFilters = [
    { id: 'all', label: t('messageType.readFilters.all') },
    { id: 'unread', label: t('messageType.readFilters.unread') },
    { id: 'read', label: t('messageType.readFilters.read') }
  ];

  const typeFilters = [
    { id: 'all', label: t('messageType.typeFilters.all') },
    { id: 'user', label: t('messageType.typeFilters.user') }, 
    { id: 'system', label: t('messageType.typeFilters.system') }
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
            {type.label}
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
            {type.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageType;