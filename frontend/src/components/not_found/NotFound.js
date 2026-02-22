import React from "react";
import { useTranslation } from 'react-i18next';
import './NotFound.css';

const NotFound = () => {
    const { t } = useTranslation();
    return (
        <div className="not-found__container">
            <h1 className="not-found__title">{t('notFound.title')}</h1>
            <p className="not-found__message">{t('notFound.message')}</p>
        </div>
    );
}

export default NotFound;