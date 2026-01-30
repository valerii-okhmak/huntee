import React from 'react';
import { useTranslation } from 'react-i18next';
import './MessageTitle.css';

const MessageTitle = () => {
  const { t } = useTranslation();
  return (
    <h1 className="message-title">
      {t('messageTitle.text')}
    </h1>
  );
};

export default MessageTitle;