import React from 'react'
import { useTranslation } from 'react-i18next';
import './TestsTop.css'

const TestsTop = () => {
  const { t } = useTranslation();
  return (
    <div className='testsTop'>
        <div className='container testsTop_container'>
            <div className='main'>
                <div className='blackbox'></div>
                <h1 className='addtitle'>{t('testsTop.join')}</h1>
            </div>
            <div className='additional'>
                <div className='addline'></div>
                <strong>{t('testsTop.vacancies')}</strong>
                <p>{t('testsTop.choose')}</p>
            </div>
        </div>
    </div>
  )
}

export default TestsTop;