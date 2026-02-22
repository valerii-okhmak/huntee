import React from 'react'
import { useTranslation } from 'react-i18next';
import './TestCreation.css'
import { Link } from 'react-router-dom';

const TestCreation = () => {
  const { t } = useTranslation();

  return (
      <div className='test-creation-container'>
          <p className='test-creation-text' dangerouslySetInnerHTML={{ __html: t('testCreation.intro') }}></p>
          
          <div className='test-creation-step'>
              <p className='test-creation-digit'>1</p>
              <p className='test-creation-steptext'>{t('testCreation.step1.title')}</p>
          </div>
          <p className='test-creation-text'>{t('testCreation.step1.desc')}</p>
          <Link to="start" className="test-creation-button">{t('testCreation.step1.button')}</Link>
          
          <div className='test-creation-step'>
              <p className='test-creation-digit'>2</p>
              <p className='test-creation-steptext'>{t('testCreation.step2.title')}</p>
          </div>
          <p className='test-creation-text'>{t('testCreation.step2.desc')}</p>
          <Link to='/templateshuntee' className="test-creation-button">{t('testCreation.step2.button')}</Link>
          
          <div className='test-creation-gradient'>
              <p className='test-creation-gradient-title' dangerouslySetInnerHTML={{ __html: t('testCreation.gradient.title') }}></p>
              <Link to='/contacts' className="test-creation-button test-creation-gradient-button">{t('testCreation.gradient.button')}</Link>
          </div>
          <div className='forspace'></div>
      </div>
  )
}

export default TestCreation;