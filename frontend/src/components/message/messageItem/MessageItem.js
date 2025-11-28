import React from 'react';
import './MessageItem.css';
import { Link } from 'react-router-dom';

const MessageItem = ({ message, onRead }) => {
  
  const logoSrc = message.sender?.profile?.profileImageUrl ? `${process.env.REACT_APP_BACKEND}/api/profile/avatar/${message.sender.profile.profileImageUrl}` : null;

  return (
    <div className="message-item" onClick={onRead}>
      <div className="message-logo">
        <img src={logoSrc} alt="Logo" />
      </div>
      
      <Link to={`/message/${message.id}`} className="message-testname">
        {message.title}
      </Link>

      {!message.isRead && <div className='unread-message'></div>}
    </div>
  );
};

export default MessageItem;