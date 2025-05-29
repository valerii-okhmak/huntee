import React, { useEffect, useRef, useState } from 'react';
import './GeneralInfo.css';
import backgroundVideo from '../../video/welcomevideo.mp4';
import { Link } from 'react-router-dom';

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

const GeneralInfo = ({title_button1,title_button2,first_step, second_step,third_step,four_step}) => {

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
        <div className="happens">how does it works?</div>
        <div className={`steps ${animate ? 'pan-animation' : ''}`}>
          <div className="step">{first_step}</div>
          <ArrowIcon />
          <div className="step">{second_step}</div>
          <ArrowIcon />
          <div className="step">{third_step}</div>
        </div>
      </div>

        <div className="bottom-content">
        <div className='left-content'>
            <p>FOR STUDENTS</p>
            <Link to="/alltests" className="cta-button">{title_button1}</Link>
        </div>
        <div className='right-content'>
            <p>FOR COMPANIES</p>
            <Link to="/" className="cta-button">{title_button2}</Link>
        </div>
        </div>
    </div>
  );
};

export default GeneralInfo;
