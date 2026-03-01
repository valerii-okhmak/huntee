import React from 'react'
import { useTranslation } from 'react-i18next';
import './TestCreationMainCount.css'

const TestCreationMainCount = ({questionsCount}) => {
  const { t } = useTranslation();
  return (
    <div className='testCreationMainCount'>
        <div className='testCreationMainCount__container'>
            <hr></hr>
            <p>{t('testCreationMainCount.text', { count: questionsCount })}</p>
        </div>
    </div>
  )
}

export default TestCreationMainCount;