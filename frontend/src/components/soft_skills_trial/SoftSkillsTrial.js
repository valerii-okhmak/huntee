import React from 'react';
import './SoftSkillsTrial.css';
import { useState, useEffect, useRef } from 'react';


const SoftSkillsTrial = () => {

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
    <h1 className='soft-skills-title'>SOFT SKILLS TEST</h1>
    <p className='soft-skills-subtitle'>Це коротке, але інформативне оцінювання твоїх "гнучких навичок", які сьогодні мають вирішальне значення при прийомі на роботу.</p>
      <div className="overlay-soft-skills" ref={overlayRef}>
        <div className={`softsteps ${animate ? 'pan-animation' : ''}`}>
          <div className="softstep">Проходиш тест</div>
          <ArrowIcon />
          <div className="softstep">Дізнаєшся свої сильні сторони</div>
          <ArrowIcon />
          <div className="softstep">Розумієш, як це допоможе в роботі</div>
          <ArrowIcon />
          <div className="softstep">Можеш краще підготуватись до співбесіди</div>
        </div>
      </div>
      <div className='button-container'>
        <img src="/background/waves.png" alt="waves" className="waves__img" />
        <button className="start-test-button">Пройти тест</button>
      </div>
      <p className='soft-skills-info'>РЕЗУЛЬТАТИ ТЕСТУ БУДЕ ВІДОБРАЖЕНО В ОСОБИСТОМУ ПРОФІЛІ</p>
    </div>
  );
};

export default SoftSkillsTrial;
