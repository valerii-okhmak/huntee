import React from 'react'
import './CompanyFromIdea.css'
import { useState, useEffect, useRef } from 'react';
import arrow from '../../img/arrow.png'


const CompanyFromIdea = () => {

  const [animate, setAnimate] = useState(false);
  const overlayRef = useRef(null);

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
    <div className='companyFromIdea_container'>
        <h2 className='companyFromIdea_title'>from idea to assessment</h2>
        <p className='companyFromIdea_subtitle'>Ми пропонуємо два зручні варіанти створення сайту — залежно від ваших потреб, бюджету та технічних навичок:</p>
        <div className='companyFromIdea_digit_plus_block'>
            <p className='companyFromIdea_digit'>1</p>
            <div className='companyFromIdea_block'>
                <h2 className='companyFromIdea_block_title'>Створення сайту самостійно</h2>
                <p className='companyFromIdea_block_subtitle'>Якщо ви хочете повний контроль над виглядом і структурою сайту — цей варіант для вас. Все просто:</p>
                <div className="companyFromIdea_block_overlay" ref={overlayRef}>
                    <div className={`companyFromIdea_block_steps ${animate ? 'companyFromIdea_block_animation' : ''}`}>
                        <div className="companyFromIdea_block_step">Вибираєте шаблон або створюєте макет з нуля.</div>
                        <img alt='arrow' src={arrow} className='companyFromIdea_arrow'/>
                        <div className="companyFromIdea_block_step">Редагуєте контент і створюєте запитання.</div>
                        <img alt='arrow' src={arrow} className='companyFromIdea_arrow'/>
                        <div className="companyFromIdea_block_step">Публікуєте тест в один клік.</div>
                    </div>
                </div>
            </div>
        </div>
        <div className='companyFromIdea_digit_plus_block'>
            <p className='companyFromIdea_digit'>2</p>
            <div className='companyFromIdea_block'>
                <h2 className='companyFromIdea_block_title'>Обрати готовий тест</h2>
                <p className='companyFromIdea_block_subtitle'>Немає часу чи бажання займатись розробкою? Ми вже підготували професійні шаблони тестів для різних сфер!</p>
                <div className="companyFromIdea_block_overlay" ref={overlayRef}>
                    <div className={`companyFromIdea_block_steps ${animate ? 'companyFromIdea_block_animation' : ''}`}>
                        <div className="companyFromIdea_block_step">Оберіть готовий тест із каталогу.</div>
                        <img alt='arrow' src={arrow} className='companyFromIdea_arrow'/>
                        <div className="companyFromIdea_block_step">Оберіть дату та час проведення.</div>
                        <img alt='arrow' src={arrow} className='companyFromIdea_arrow'/>
                        <div className="companyFromIdea_block_step">Публікуєте тест в один клік.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CompanyFromIdea