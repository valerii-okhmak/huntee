import React from 'react';
import './MessageItem.css';
import { Link } from 'react-router-dom';
import defaultLogo from '../../../img/default_logo.jpg'; 

const MessageItem = ({ message, onRead }) => {

  const logoSrc = message.sender?.avatarUrl 
    ? `/api/profile/avatar/${message.sender.avatarUrl}`
    : defaultLogo;

  const senderName = message.sender?.name || "Системне повідомлення";
  
  const date = new Date(message.createdAt).toLocaleDateString('uk-UA', {
      day: '2-digit', month: '2-digit'
  });

  const previewText = message.message || ""; 

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
        
        <div className="message-item-logo">
           <img src={logoSrc} alt="User" />
        </div>

        <div className="message-item-content">
            
            <div className="message-item-header">
                <span className="sender-name">{senderName}</span>
                <span className="message-item-date">{date}</span>
            </div>

            <div className="message-item-title">
                {message.title}
            </div>

            <div className="message-item-preview">
                {previewText}
            </div>
        </div>

        {!message.read && <div className='unread-message'></div>}
      </div>
    </Link>
  );
};

export default MessageItem;