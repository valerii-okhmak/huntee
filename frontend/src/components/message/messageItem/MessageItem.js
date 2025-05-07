import React from 'react';
import './MessageItem.css';

const MessageItem = ({logo ,testname, read }) => {
  return (
    <div className="message-item">
      <div className="message-logo">
        <img src={logo} alt="Фото компанії" />
      </div>
      <a href='/' className="message-testname">{testname}</a>

      {!read && <div className='unread-message'></div>}
    </div>
  );
};

export default MessageItem;
