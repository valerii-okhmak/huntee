import React, { useState, useEffect, useRef } from 'react';
import './VerticalStepper.css';

const steps = [
  { number: '1', label: 'Шось' },
  { number: '2', label: 'Шось' },
  { number: '3', label: 'Шось' },
  { number: '4', label: 'Шось' },
  { number: '5', label: 'Шось' },
];

const sectionIds = [
  'section-01', 'section-02', 'section-03', 'section-04', 'section-05',
];

const VerticalStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
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

  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="vertical-stepper">
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
  );
};

export default VerticalStepper;
