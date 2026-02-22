import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faChartLine,
  faUsers,
  faClock,
  faBuilding,
  faUserGraduate,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import "./GeneralInfo.css";
import backgroundVideo from "../../video/welcomevideo.webm";

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

const GeneralInfo = ({
  first_step,
  second_step,
  third_step,
}) => {
  const { t } = useTranslation();
  const overlayRef = useRef(null);
  const [animate, setAnimate] = useState(false);

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
    <div className="general-wrapper">
      <section className="benefits-section">
        <h2>{t('generalInfo.benefits.title')}</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <FontAwesomeIcon icon={faRobot} size="2x" />
            <h3>{t('generalInfo.benefits.automation')}</h3>
            <p>{t('generalInfo.benefits.automationDesc')}</p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon={faChartLine} size="2x" />
            <h3>{t('generalInfo.benefits.analytics')}</h3>
            <p>{t('generalInfo.benefits.analyticsDesc')}</p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon={faUsers} size="2x" />
            <h3>{t('generalInfo.benefits.massSelection')}</h3>
            <p>{t('generalInfo.benefits.massSelectionDesc')}</p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon={faClock} size="2x" />
            <h3>{t('generalInfo.benefits.timeSaving')}</h3>
            <p>{t('generalInfo.benefits.timeSavingDesc')}</p>
          </div>
        </div>
      </section>

      <section className="audience-section">
        <h2>{t('generalInfo.audience.title')}</h2>
        <div className="audience-grid">
          <div className="audience-card">
            <FontAwesomeIcon icon={faUserGraduate} size="2x" />
            <h3>{t('generalInfo.audience.students')}</h3>
            <p>{t('generalInfo.audience.studentsDesc')}</p>
          </div>
          <div className="audience-card">
            <FontAwesomeIcon icon={faBuilding} size="2x" />
            <h3>{t('generalInfo.audience.companies')}</h3>
            <p>{t('generalInfo.audience.companiesDesc')}</p>
          </div>
          <div className="audience-card">
            <FontAwesomeIcon icon={faHandshake} size="2x" />
            <h3>{t('generalInfo.audience.hr')}</h3>
            <p>{t('generalInfo.audience.hrDesc')}</p>
          </div>
        </div>
      </section>

      {/* How does it work */}
      <div className="create-test-info">
        <video className="backgroundvideo" autoPlay loop muted>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="overlay" ref={overlayRef}>
          <div className="happens">{t('generalInfo.howItWorks')}</div>
          <div className={`steps ${animate ? "pan-animation" : ""}`}>
            <div className="step">{first_step}</div>
            <ArrowIcon />
            <div className="step">{second_step}</div>
            <ArrowIcon />
            <div className="step">{third_step}</div>
          </div>
        </div>

        <div className="bottom-content">
          <div className='general__button'>
            <p>{t('generalInfo.forStudents')}</p>
            <Link to="/alltests">
              <button className="general_info_button">{t('generalInfo.buttons.closestSets')}</button>
            </Link>
          </div>
    
          <div className='general__button'>
          <p>{t('generalInfo.forCompanies')}</p>
          <Link to="/">
            <button className="general_info_button">{t('generalInfo.buttons.createTest')}</button>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;