import React from 'react'
import './CompanyWelcome.css'
import bg from '../../video/trialtestingvideo.mp4';
import arrow from '../../img/arrow.png'
import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from 'react';

const CompanyWelcome = () => {
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
                <h1 className='companyWelcome__title'>HERE’RE YOUR FUTURE EMPLOYEES</h1>
                <h3 className='companyWelcome__subtitle'>Тести створені щоб допомогти студентам знайти свою карєру в IT</h3>
                <div className='companyWelcome__buttons'>
                    <Link to="/generalinfo" className="companyWelcome__button">Детальніше про нас</Link>
                    <Link to="/testcreation" className="companyWelcome__button">Як проходить створення тестів?</Link>
                </div>
            </div>
        </div>
        <div className='companyWelcome_container'>
            <div className="overlay-companyWelcome" ref={overlayRef}>
                <div className={`companyWelcome_steps ${animate ? 'pan-animation' : ''}`}>
                    <div className="companyWelcome_step">Створюєте обліковий запис </div>
                    <img alt='arrow' src={arrow} className='companyWelcome_arrow'/>
                    <div className="companyWelcome_step">Створюєте тести</div>
                    <img alt='arrow' src={arrow} className='companyWelcome_arrow'/>
                    <div className="companyWelcome_step">Отримуєте результати тестів</div>
                    <img alt='arrow' src={arrow} className='companyWelcome_arrow'/>
                    <div className="companyWelcome_step">Отримуєте перелік найкращих кандидатів на певну вакансію</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CompanyWelcome