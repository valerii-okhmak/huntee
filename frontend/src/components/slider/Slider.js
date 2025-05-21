import React, { useState, useEffect, useCallback } from 'react';
import './Slider.css';  // Підключаємо CSS

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, text: 'ВАША КОМПАНІЯ В ПОШУКУ СПІВРОБІТНИКІВ?', link: '/test'},
    { id: 2, text: 'ЩО ЦЕ ЗА ПЛАТФОРМА?', link: '/test'},
    { id: 3, text: 'ШУКАЄШ СТАРТ В IT?', link: '/test' },
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
                <a href={slide.link} className="learn-more-btn">Дізнатися більше</a>
              </div>
            ))}
        </div>
      </div>
      <button className="prev" onClick={prevSlide}><img src="/mainPagePhoto/arrow.png" alt="Стрілка"></img></button>
      <button className="next" onClick={nextSlide}><img src="/mainPagePhoto/arrow.png" alt="Стрілка"></img></button>

    </div>
  );
};

export default Slider;
