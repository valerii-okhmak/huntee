import React from 'react';
import MessageTitle from '../components/message/messageTitle/MessageTitle';
import MessageType from '../components/message/messageType/MessageType';
import MessageList from '../components/message/messageList/MessageList';

const MessagePage = () => {
  return (
    <div className="page">
        <MessageTitle/>
      <div className='message container'>
        <MessageType/>
        <MessageList/>
      </div>
    </div>
  )
}

export default MessagePage