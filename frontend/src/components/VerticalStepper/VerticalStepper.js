import React, { useState, useEffect, useRef } from 'react';
import './VerticalStepper.css';

const steps = [
  { number: '1', label: 'Home' },
  { number: '2', label: 'Path' },
  { number: '3', label: 'Tests' },
  { number: '4', label: 'Soft' },
  { number: '5', label: 'Trial' },
  { number: '6', label: 'Field' },
  { number: '7', label: 'Comp' },
  { number: '8', label: 'Subs' },
  { number: '9', label: 'Join' },
];

const sectionIds = [
  'section-01', 'section-02', 'section-03', 'section-04', 'section-05', 'section-06', 'section-07', 'section-08', 'section-09'
];

const VerticalStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showReturnButton, setShowReturnButton] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(true); // для миттєвого контролю кнопки закриття

  const observerRef = useRef(null);

  useEffect(() => {
    const options = {
      root: null,
      threshold: 0.6,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionIds.indexOf(entry.target.id);
          if (index !== -1) {
            setActiveStep(index);
          }
        }
      });
    }, options);

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observerRef.current.observe(section);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    let timer;
    if (!isVisible) {
      timer = setTimeout(() => setShowReturnButton(true), 400); // кнопка повернення з'явиться з затримкою
    } else {
      setShowReturnButton(false);
    }
    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleClose = () => {
    setShowToggleButton(false); // кнопка закриття зникає одразу
    setIsVisible(false);        // панель ховаємо (з анімацією)
  };

  const handleOpen = () => {
    setIsVisible(true);         // панель показуємо
    setShowReturnButton(false); // сховати кнопку повернення
    setShowToggleButton(true);  // показати кнопку закриття
  };

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div className={`vertical-stepper ${isVisible ? 'visible' : 'hidden'}`}>
  <button
    className="stepper-toggle"
    onClick={handleClose}
    aria-label="Закрити"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M10 6L16 12L10 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>

  {steps.map((step, index) => (
    <div
      key={step.number}
      className={`step ${activeStep === index ? 'active' : ''}`}
      onClick={() => scrollTo(sectionIds[index])}
    >
      <span>{step.number}</span>
      <small>{step.label}</small>
    </div>
  ))}
</div>


      {showReturnButton && (
        <button
          className={`stepper-return visible`}
          onClick={handleOpen}
          aria-label="Відкрити"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M14 6L8 12L14 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
      )}
    </>
  );
};

export default VerticalStepper;
