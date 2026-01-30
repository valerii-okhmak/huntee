import React from 'react';
import { useTranslation } from 'react-i18next';
import './ForCompany.css';
import { Link } from 'react-router-dom';
import backgVideo from '../../video/forcomp.webm';

const ForCompany = () => {
    const { t } = useTranslation();

    return (
        <div className="for-company__container">
            <video className="background-video" autoPlay loop muted>
                 <source src={backgVideo} type="video/mp4" />
                 Your browser does not support the video tag.
            </video>
            <div className='for-company__content'>
                <p className="for-company__title">{t('forCompany.title')}</p>
                <div className='for-company__subtitle__container'>
                    <p className="for-company__subtitle">{t('forCompany.subtitle')}</p>
                </div>
                <p className="for-company__description">
                    {t('forCompany.descriptionLine1')}
                    <br />
                    {t('forCompany.descriptionLine2')}
                </p>
                <Link to="/companymain" className="for-company__button">
                    {t('forCompany.button')}
                </Link>
            </div>
        </div>
    );
};

export default ForCompany;