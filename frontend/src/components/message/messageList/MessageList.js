import React from 'react';
import './MessageList.css';
import MessageItem from '../messageItem/MessageItem';
import logo from "../../../img/softserve.png"; // Імпортуємо PNG-логотип

const MessageList = () => {
  return (
    <div className="message-list">
      <MessageItem logo={logo} testname="Повідомлення 1" read={false} />
      <MessageItem logo={logo} testname="Повідомлення 2" read={false} />
      <MessageItem logo={logo} testname="Повідомлення 3" read={true} />
      <MessageItem logo={logo} testname="Повідомлення 1" read={false} />
      <MessageItem logo={logo} testname="Повідомлення 2" read={false} />
      <MessageItem logo={logo} testname="Повідомлення 3" read={true} />
      <MessageItem logo={logo} testname="Повідомлення 1" read={false} />
      <MessageItem logo={logo} testname="Повідомлення 2" read={false} />
      <MessageItem logo={logo} testname="Повідомлення 3" read={true} />
    </div>
  );
};

export default MessageList;
