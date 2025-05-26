import React from 'react';
import './MessageItem.css';
import { Link } from 'react-router-dom';


const MessageItem = ({logo ,testname, read }) => {
  return (
    <div className="message-item">
      <div className="message-logo">
        <img src={logo} alt="Фото компанії" />
      </div>
      <Link to='/message' className="message-testname">{testname}</Link>

      {!read && <div className='unread-message'></div>}
    </div>
  );
};

export default MessageItem;
