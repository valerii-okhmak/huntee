import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Slider.css';
import { Link } from 'react-router-dom';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(null);
  const currentX = useRef(null);

  const slides = [
    { id: 1, text: 'ВАША КОМПАНІЯ В ПОШУКУ СПІВРОБІТНИКІВ?', link: '/companymain' },
    { id: 2, text: 'ЩО ЦЕ ЗА ПЛАТФОРМА?', link: '/generalinfo' },
    { id: 3, text: 'ШУКАЄШ СТАРТ В IT?', link: '/startIT' },
    { id: 4, text: 'МАЄТЕ ЗАПИТАННЯ АБО ПРОПОЗИЦІЇ?', link: '/contacts' },
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

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  // Автоматична прокрутка
  useEffect(() => {
    const interval = setInterval(() => showSlide(currentSlide + 1), 3000);
    return () => clearInterval(interval);
  }, [currentSlide, showSlide]);

  // --- Touch events ---
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    currentX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  // --- Mouse events ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    currentX.current = e.clientX;
    handleSwipe();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      currentX.current = null;
    }
  };

  const handleSwipe = () => {
    if (!startX.current || !currentX.current) return;
    const diff = startX.current - currentX.current;
    const threshold = 50;

    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }

    startX.current = null;
    currentX.current = null;
  };

  return (
    <div
      className="slider-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="slider2">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
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
          <line x1="2" y1="10" x2="26" y2="10" stroke="black" strokeWidth="3" />
          <polyline points="10,3 2,10 10,17" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button className="next" onClick={nextSlide}>
        <svg width="28" height="20" viewBox="0 0 28 20" xmlns="http://www.w3.org/2000/svg">
          <line x1="2" y1="10" x2="26" y2="10" stroke="black" strokeWidth="3" />
          <polyline points="18,3 26,10 18,17" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default Slider;
