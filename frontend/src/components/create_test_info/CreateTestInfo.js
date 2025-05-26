import React, { useEffect, useRef, useState } from 'react';
import './CreateTestInfo.css';
import backgroundVideo from '../../video/welcomevideo.mp4';

const ArrowIcon = () => (
  <svg
    className="arrow"
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="24"
    viewBox="0 0 48 24"
    fill="none"
    stroke="black"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="43" y2="12" />
    <polyline points="36 5 43 12 36 19" />
  </svg>
);

const CreateTestInfo = () => {
  const overlayRef = useRef(null);
  const [animate, setAnimate] = useState(false);

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
    <div className="create-test-info">
      <video className="backgroundvideo" autoPlay loop muted>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay" ref={overlayRef}>
        <div className="happens">how it happens?</div>
        <div className={`steps ${animate ? 'pan-animation' : ''}`}>
          <div className="step">Створюєте обліковий запис</div>
          <ArrowIcon />
          <div className="step">Створюєте тести</div>
          <ArrowIcon />
          <div className="step">Отримуєте результати тестів</div>
          <ArrowIcon />
          <div className="step">Отримуєте перелік найкращих кандидатів </div>
        </div>
      </div>

      <div className="bottom-content">
        <h2>HERE’RE YOUR FUTURE EMPLOYEES</h2>
        <button className="cta-button">СТВОРИТИ ТЕСТ</button>
      </div>
    </div>
  );
};

export default CreateTestInfo;
