import React from 'react'
import { useTranslation } from 'react-i18next';
import './TemplatesHuntee.css'

const TemplatesHuntee = () => {
  const { t } = useTranslation();

  return (
<div className='templates-huntee-container'>
    <p className='templates-huntee-text' dangerouslySetInnerHTML={{ __html: t('templatesHuntee.intro') }}></p>
    
    <div className='templates-huntee-step'>
        <p className='templates-huntee-digit'>1</p>
        <p className='templates-huntee-steptext'>Base Test</p>
    </div>
    <p className='templates-huntee-text'>{t('templatesHuntee.baseTest.desc')}</p>
    <p className='templates-huntee-text with-border'>{t('templatesHuntee.baseTest.examples')}</p>
    <button className="templates-huntee-button">{t('templatesHuntee.useTemplate')}</button>
    
    <div className='templates-huntee-step'>
        <p className='templates-huntee-digit'>2</p>
        <p className='templates-huntee-steptext'>Mixed Mode</p>
    </div>
    <p className='templates-huntee-text'>{t('templatesHuntee.mixedMode.desc')}</p>
    <p className='templates-huntee-text with-border'>{t('templatesHuntee.mixedMode.examples')}</p>
    <button className="templates-huntee-button">{t('templatesHuntee.viewTemplates')}</button>
    
    <div className='templates-huntee-step'>
        <p className='templates-huntee-digit'>3</p>
        <p className='templates-huntee-steptext'>Practical Task</p>
    </div>
    <p className='templates-huntee-text'>{t('templatesHuntee.practicalTask.desc')}</p>
    <p className='templates-huntee-text with-border'>{t('templatesHuntee.practicalTask.examples')}</p>
    <button className="templates-huntee-button">{t('templatesHuntee.viewTemplates')}</button>
    
    <div className='templates-huntee-step'>
        <p className='templates-huntee-digit'>4</p>
        <p className='templates-huntee-steptext'>Scenario Test</p>
    </div>
    <p className='templates-huntee-text'>{t('templatesHuntee.scenarioTest.desc')}</p>
    <p className='templates-huntee-text with-border'>{t('templatesHuntee.scenarioTest.examples')}</p>
    <button className="templates-huntee-button">{t('templatesHuntee.viewTemplates')}</button>
</div>
  )
}

export default TemplatesHuntee;