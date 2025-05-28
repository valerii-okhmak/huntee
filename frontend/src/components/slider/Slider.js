import React, { useState, useEffect, useCallback } from 'react';
import './Slider.css'; 
import { Link } from 'react-router-dom';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, text: 'ВАША КОМПАНІЯ В ПОШУКУ СПІВРОБІТНИКІВ?', link: '/forcompanies'},
    { id: 2, text: 'ЩО ЦЕ ЗА ПЛАТФОРМА?', link: '/'},
    { id: 3, text: 'ШУКАЄШ СТАРТ В IT?', link: '/startIT' },
  ];
  const totalSlides = slides.length;

  const showSlide = useCallback((index) => {
    switch (true) {
      case index >= totalSlides:
        setCurrentSlide(0);
        break;
      case index < 0:
        setCurrentSlide(totalSlides - 1);
        break;
      default:
        setCurrentSlide(index);
    }
  }, [totalSlides]);
  

  const nextSlide = () => {
    showSlide(currentSlide + 1); 
  };

  const prevSlide = () => {
    showSlide(currentSlide - 1); 
  };

  useEffect(() => {
    const interval = setInterval(() => showSlide(currentSlide + 1), 3000); 
    return () => clearInterval(interval); 
  }, [currentSlide, showSlide]); 

  return (
    <div className="slider-container">
      <div className="slider2">
        <div className="slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {slides.map((slide) => (
            <div key={slide.id} className="slide">
              <h2>{slide.text}</h2>
              <Link to={slide.link} className="learn-more-btn">Дізнатися більше</Link>
            </div>
          ))}
        </div>
      </div>
      <button className="prev" onClick={prevSlide}>
        <svg width="28" height="20" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg">
          <line x1="2" y1="10" x2="26" y2="10" stroke="black" strokeWidth="3"/>
          <polyline points="10,3 2,10 10,17" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button className="next" onClick={nextSlide}>
        <svg width="28" height="20" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg">
          <line x1="2" y1="10" x2="26" y2="10" stroke="black" strokeWidth="3"/>
          <polyline points="18,3 26,10 18,17" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default Slider;
