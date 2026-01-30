import React from 'react'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './CompanyOptions.css'
import bg_video from '../../video/join-to-us.mp4';

const CompanyOptions = () => {
  const { t } = useTranslation();

  return (
    <div className='companyOptions'>
        <video className="companyOptions_bd" autoPlay loop muted>
                <source src={bg_video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        <div className='container companyOptions_container'>
            <h2 className='companyOptions__title'>{t('companyOptions.title')}</h2>
            <div className='companyOptions__buttons'>
                <Link to="/" className="co-button">{t('companyOptions.createTest')}</Link>
                <Link to="/" className="co-button">{t('companyOptions.viewTemplates')}</Link>
            </div>
        </div>
    </div>
  )
}

export default CompanyOptions