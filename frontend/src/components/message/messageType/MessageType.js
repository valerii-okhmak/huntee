import React, { useState } from 'react';
import './MessageType.css';

const MessageType = () => {
  const [activeType, setActiveType] = useState('all');

  const types = [
    { id: 'all', label: 'Всі' },
    { id: 'unread', label: 'Непрочитані' },
    { id: 'read', label: 'Прочитані' }
  ];

  return (
    <div className="message-type">
      <div className="message-type__container">
        {types.map((type) => (
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
