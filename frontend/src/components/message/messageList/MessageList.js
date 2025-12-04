import React from 'react';
import './MessageList.css';
import MessageItem from '../messageItem/MessageItem'; 

const MessageList = ({ messages = [], onMarkAsRead }) => {
  
  if (!messages || !Array.isArray(messages)) {
    return <div className="message-list"></div>; 
  }

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div style={{padding: '20px', textAlign: 'center', color: '#888', fontSize: '24px', fontFamily: 'Montserrat, sans-serif'}}>
            Повідомлень немає
        </div>
      ) : (
        messages.map((msg) => (
          <MessageItem 
            key={msg.id}
            message={msg}
            onRead={onMarkAsRead}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;