import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import './CompanyWelcome.css'
import bg from '../../video/trialtestingvideo.mp4';
import arrow from '../../img/arrow.png'

const CompanyWelcome = () => {
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
    <div className="companyWelcome">
        <div className='companyWelcome__main'>
            <video className="companyWelcome_bg" autoPlay loop muted>
                <source src={bg} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className='container companyWelcome__main_container'>
                <h1 className='companyWelcome__title'>{t('companyWelcome.title')}</h1>
                <h3 className='companyWelcome__subtitle'>{t('companyWelcome.subtitle')}</h3>
                <div className='companyWelcome__buttons'>
                    <Link to="/generalinfo" className="companyWelcome__button">{t('companyWelcome.buttons.details')}</Link>
                    <Link to="/testcreation" className="companyWelcome__button">{t('companyWelcome.buttons.howTo')}</Link>
                </div>
            </div>
        </div>
        <div className='companyWelcome_container'>
            <div className="overlay-companyWelcome" ref={overlayRef}>
                <div className={`companyWelcome_steps ${animate ? 'pan-animation' : ''}`}>
                    <div className="companyWelcome_step">{t('companyWelcome.steps.account')}</div>
                    <img alt='arrow' src={arrow} className='companyWelcome_arrow'/>
                    <div className="companyWelcome_step">{t('companyWelcome.steps.create')}</div>
                    <img alt='arrow' src={arrow} className='companyWelcome_arrow'/>
                    <div className="companyWelcome_step">{t('companyWelcome.steps.results')}</div>
                    <img alt='arrow' src={arrow} className='companyWelcome_arrow'/>
                    <div className="companyWelcome_step">{t('companyWelcome.steps.candidates')}</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CompanyWelcome