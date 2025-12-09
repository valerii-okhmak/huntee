import React from 'react';
import './MessageType.css';

const MessageType = ({ activeRead, setActiveRead, activeType, setActiveType }) => {
  
  const readFilters = [
    { id: 'all', label: 'Всі' },
    { id: 'unread', label: 'Непрочитані' },
    { id: 'read', label: 'Прочитані' }
  ];

  const typeFilters = [
    { id: 'all', label: 'Всі' },
    { id: 'user', label: 'Користувач' }, 
    { id: 'system', label: 'Системні' }
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