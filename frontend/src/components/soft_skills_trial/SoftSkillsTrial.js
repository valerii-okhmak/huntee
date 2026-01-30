import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './SoftSkillsTrial.css';

const SoftSkillsTrial = () => {
  const { t } = useTranslation();
  const [animate, setAnimate] = useState(false);
  const overlayRef = useRef(null);

  const ArrowIcon = () => (
    <svg
      className="arrow"
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="24"
      viewBox="0 0 48 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="43" y2="12" />
      <polyline points="36 5 43 12 36 19" />
    </svg>
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setAnimate(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    if (overlayRef.current) {
      observer.observe(overlayRef.current);
    }

    return () => {
      if (overlayRef.current) {
        observer.unobserve(overlayRef.current);
      }
    };
  }, []);

  return (
    <div className="soft-skills-trial">
    <h1 className='soft-skills-title'>{t('softSkillsTrial.title')}</h1>
    <p className='soft-skills-subtitle'>{t('softSkillsTrial.subtitle')}</p>
      <div className="overlay-soft-skills" ref={overlayRef}>
        <div className={`softsteps ${animate ? 'pan-animation' : ''}`}>
          <div className="softstep">{t('softSkillsTrial.step1')}</div>
          <ArrowIcon />
          <div className="softstep">{t('softSkillsTrial.step2')}</div>
          <ArrowIcon />
          <div className="softstep">{t('softSkillsTrial.step3')}</div>
          <ArrowIcon />
          <div className="softstep">{t('softSkillsTrial.step4')}</div>
        </div>
      </div>
      <div className='button-container'>
        <img src="/background/waves.png" alt="waves" className="waves__img" />
        <button className="start-test-button">{t('softSkillsTrial.button')}</button>
      </div>
      <p className='soft-skills-info'>{t('softSkillsTrial.info')}</p>
    </div>
  );
};

export default SoftSkillsTrial;