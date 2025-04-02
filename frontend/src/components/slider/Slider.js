import React, { useState, useEffect, useCallback } from 'react';
import './Slider.css';  // Підключаємо CSS

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { id: 1, text: 'похуй шо'},
    { id: 2, text: 'похуй як'},
    { id: 3, text: 'похуй коли'},
  ];
  const totalSlides = slides.length;

  const showSlide = useCallback((index) => {
    if (index >= totalSlides) {
      setCurrentSlide(0);
    } else if (index < 0) {
      setCurrentSlide(totalSlides - 1);
    } else {
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
