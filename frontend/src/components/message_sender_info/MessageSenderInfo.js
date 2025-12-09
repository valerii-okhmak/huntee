import React from "react";
import './MessageSenderInfo.css';

const MessageSenderInfo = ({ senderName, date, logoSrc }) => {
    return (
        <div className="message-sender-info__container">
        {logoSrc && <img alt="logo" className="message-sender-info__logo" src={logoSrc} />}
            <div className="message-sender-info__details">
                {senderName && <strong className="message-sender-info__name">{senderName}</strong>}
                {date && <p className="message-sender-info__date">{date}</p>}
            </div>
        </div>
    );
}

export default MessageSenderInfo;