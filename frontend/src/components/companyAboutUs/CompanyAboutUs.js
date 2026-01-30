import React from 'react'
import { useTranslation } from 'react-i18next'
import './CompanyAboutUs.css'
import BrowserWindow from "../browser_window/BrowserWindow";

const CompanyAboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className='companyAboutUs'>
        <h2 className='companyAboutUs__title'>{t('companyAboutUs.title')}</h2>
        <BrowserWindow>
            <div className='companyAboutUs__container'>
                <h4 className='companyAboutUs__hello'>{t('companyAboutUs.hello')}</h4>
                <p className='companyAboutUs__text'>{t('companyAboutUs.description')}</p>
                <p className='companyAboutUs__text'>{t('companyAboutUs.whyChoose')}</p>
                <div className='companyAboutUs__why'>
                    <div className='companyAboutUs__benefit companyAboutUs__benefit-small'>{t('companyAboutUs.benefits.precise')}</div>
                    <div className='companyAboutUs__benefit companyAboutUs__benefit-small'>{t('companyAboutUs.benefits.time')}</div>
                    <div className='companyAboutUs__benefit companyAboutUs__benefit-small'>{t('companyAboutUs.benefits.objective')}</div>
                    <div className='companyAboutUs__benefit companyAboutUs__benefit-big'>{t('companyAboutUs.benefits.flexible')}</div>
                    <div className='companyAboutUs__benefit companyAboutUs__benefit-big'>{t('companyAboutUs.benefits.experience')}</div>
                </div>
            </div>
        </BrowserWindow>
    </div>
  )
}

export default CompanyAboutUs