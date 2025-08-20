import React, { useEffect, useRef, useState } from "react";
import "./GeneralInfo.css";
import backgroundVideo from "../../video/welcomevideo.mp4";
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

// 🔹 SVG-стрілка
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
  title_button1,
  title_button2,
  first_step,
  second_step,
  third_step,
}) => {
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
      {/* Ключові переваги */}
      <section className="benefits-section">
        <h2>Основні переваги</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <FontAwesomeIcon icon={faRobot} size="2x" />
            <h3>Автоматизація</h3>
            <p>
              Система бере на себе рутину: перевірка резюме, контроль доброчесності та перший відбір.
            </p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon={faChartLine} size="2x" />
            <h3>Аналітика</h3>
            <p>Детальні звіти допомагають HR приймати рішення швидше та якісніше.</p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon={faUsers} size="2x" />
            <h3>Масовий відбір</h3>
            <p>Працюйте з сотнями кандидатів одночасно без перевантаження.</p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon={faClock} size="2x" />
            <h3>Економія часу</h3>
            <p>Швидкий пошук і відбір — від заявки до найму у кілька кліків.</p>
          </div>
        </div>
      </section>

      {/* Для кого ця платформа */}
      <section className="audience-section">
        <h2>Для кого ця платформа?</h2>
        <div className="audience-grid">
          <div className="audience-card">
            <FontAwesomeIcon icon={faUserGraduate} size="2x" />
            <h3>Студенти</h3>
            <p>Швидкий старт кар’єри та чесний відбір. Допомога в пошуках роботи.</p>
          </div>
          <div className="audience-card">
            <FontAwesomeIcon icon={faBuilding} size="2x" />
            <h3>Компанії</h3>
            <p>Ефективний масовий рекрутинг і прозорі результати.</p>
          </div>
          <div className="audience-card">
            <FontAwesomeIcon icon={faHandshake} size="2x" />
            <h3>HR та рекрутери</h3>
            <p>Зручні інструменти для пошуку найкращих талантів.</p>
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
          <div className="happens">Як це працює?</div>
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
            <p>FOR STUDENTS</p>
            <Link to="/alltests">
              <button className="general_info_button">Найближчі набори</button>
            </Link>
          </div>
    
          <div className='general__button'>
          <p>FOR COMPANIES</p>
          <Link to="/">
            <button className="general_info_button">Створити тест</button>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfo;