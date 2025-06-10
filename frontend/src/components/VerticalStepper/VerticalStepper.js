import React, { useState, useEffect } from 'react';
import './VerticalStepper.css';

const steps = [
  '1', '2', '3', '4', '5'
];

const sectionIds = [
  'section-01', 'section-02', 'section-03', 'section-04', 'section-05',
];

const VerticalStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const scrollTo = (id, index) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveStep(index);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      sectionIds.forEach((id, index) => {
        const section = document.getElementById(id);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            setActiveStep(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="vertical-stepper">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`step ${activeStep === index ? 'active' : ''}`}
          onClick={() => scrollTo(sectionIds[index], index)}
        >
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
};

export default VerticalStepper;
