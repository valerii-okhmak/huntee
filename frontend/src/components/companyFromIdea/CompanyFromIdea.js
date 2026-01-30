import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './CompanyFromIdea.css'
import arrow from '../../img/arrow.png'

const CompanyFromIdea = () => {
  const { t } = useTranslation();
  const [animate, setAnimate] = useState(false);
  const overlayRef = useRef(null);

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
        <h2 className='companyFromIdea_title'>{t('companyFromIdea.title')}</h2>
        <p className='companyFromIdea_subtitle'>{t('companyFromIdea.subtitle')}</p>
        
        <div className='companyFromIdea_digit_plus_block'>
            <p className='companyFromIdea_digit'>1</p>
            <div className='companyFromIdea_block'>
                <h2 className='companyFromIdea_block_title'>{t('companyFromIdea.option1.title')}</h2>
                <p className='companyFromIdea_block_subtitle'>{t('companyFromIdea.option1.subtitle')}</p>
                <div className="companyFromIdea_block_overlay" ref={overlayRef}>
                    <div className={`companyFromIdea_block_steps ${animate ? 'companyFromIdea_block_animation' : ''}`}>
                        <div className="companyFromIdea_block_step">{t('companyFromIdea.option1.step1')}</div>
                        <img alt='arrow' src={arrow} className='companyFromIdea_arrow'/>
                        <div className="companyFromIdea_block_step">{t('companyFromIdea.option1.step2')}</div>
                        <img alt='arrow' src={arrow} className='companyFromIdea_arrow'/>
                        <div className="companyFromIdea_block_step">{t('companyFromIdea.option1.step3')}</div>
                    </div>
                </div>
            </div>
        </div>

        <div className='companyFromIdea_digit_plus_block'>
            <p className='companyFromIdea_digit'>2</p>
            <div className='companyFromIdea_block'>
                <h2 className='companyFromIdea_block_title'>{t('companyFromIdea.option2.title')}</h2>
                <p className='companyFromIdea_block_subtitle'>{t('companyFromIdea.option2.subtitle')}</p>
                <div className="companyFromIdea_block_overlay" ref={overlayRef}>
                    <div className={`companyFromIdea_block_steps ${animate ? 'companyFromIdea_block_animation' : ''}`}>
                        <div className="companyFromIdea_block_step">{t('companyFromIdea.option2.step1')}</div>
                        <img alt='arrow' src={arrow} className='companyFromIdea_arrow'/>
                        <div className="companyFromIdea_block_step">{t('companyFromIdea.option2.step2')}</div>
                        <img alt='arrow' src={arrow} className='companyFromIdea_arrow'/>
                        <div className="companyFromIdea_block_step">{t('companyFromIdea.option2.step3')}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CompanyFromIdea