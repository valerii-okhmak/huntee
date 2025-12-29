import React from 'react';
import './MessageItem.css';
import { Link } from 'react-router-dom';

const MessageItem = ({ message, onRead }) => {

  const logoSrc = message.sender?.profile?.profileImageUrl 
    ? `/api/profile/avatar/${message.sender.profile.profileImageUrl}` 
    : null;

  const handleClick = () => {
    if (onRead) onRead(message.id);  
  };

  return (
    <Link 
      to={`/message/${message.id}`} 
      className="message-item-link"
      onClick={handleClick}
    >
      <div className="message-item">
        <div className="message-logo">
          {logoSrc && <img src={logoSrc} alt="Logo" />}
        </div>
        <div className="message-testname">{message.title}</div>
        {!message.read && <div className='unread-message'></div>}
      </div>
    </Link>
  );
};

export default MessageItem;
