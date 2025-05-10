import React, { useState } from 'react';
import './MessageType.css';

const MessageType = () => {
  const [activeType, setActiveType] = useState('all');
  const [activeType2, setActiveType2] = useState('all');

  const types1 = [
    { id: 'all', label: 'Всі' },
    { id: 'unread', label: 'Непрочитані' },
    { id: 'read', label: 'Прочитані' }
  ];

  const types2 = [
    { id: 'all', label: 'Всі' },
    { id: 'company', label: 'Компанія' },
    { id: 'user', label: 'Користувач' },
    { id: 'system', label: 'Системні' }
  ];

  return (
    <div className="message-type">
      <div className="message-type__container">
        {types1.map((type) => (
          <div
            key={type.id}
            className={`message-type__item ${activeType === type.id ? 'message-type__item--active' : ''}`}
            onClick={() => setActiveType(type.id)}
          >
            {type.label}
          </div>
        ))}
      </div>
      <div className="message-type__container">
        {types2.map((type) => (
          <div
            key={type.id}
            className={`message-type__item ${activeType2 === type.id ? 'message-type__item--active' : ''}`}
            onClick={() => setActiveType2(type.id)}
          >
            {type.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageType;
