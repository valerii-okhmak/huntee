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

  // Функція для перемикання слайдів
  const showSlide = useCallback((index) => {
    if (index >= totalSlides) {
      setCurrentSlide(0);
    } else if (index < 0) {
      setCurrentSlide(totalSlides - 1);
    } else {
      setCurrentSlide(index);
    }
  }, [totalSlides]);

  // Функції для кнопок
  const nextSlide = () => {
    showSlide(currentSlide + 1); // використовуємо showSlide
  };

  const prevSlide = () => {
    showSlide(currentSlide - 1); // використовуємо showSlide
  };

  // Автоматичний перехід до наступного слайду
  useEffect(() => {
    const interval = setInterval(() => showSlide(currentSlide + 1), 3000); // використовуємо showSlide для автоматичного переходу
    return () => clearInterval(interval); // очищаємо інтервал при демонтіванні компонента
  }, [currentSlide, showSlide]); // додали showSlide до залежностей

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
