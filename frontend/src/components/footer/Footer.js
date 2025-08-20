import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [copied, setCopied] = useState(null);

useEffect(() => {
  if (!copied) return;

  const timer = setTimeout(() => setCopied(null), 2000);
  return () => clearTimeout(timer);
  
}, [copied]);

const handleCopy = (text, type) => {
  navigator.clipboard.writeText(text).then(() => {
    setCopied(type);
  });
};


  return (
    <footer className="footer" id="footer">

      <div className="footer-left">
        <h2 className="footer-title">HUNTEE</h2>
        <div className="footer-line"></div>
        <ul className="footer-menu">
          <li><Link to="/generalinfo" className="footermenu">Про нас</Link></li>
          <li><Link to="/generalinfo" className="footermenu">Запитання та пропозиції</Link></li>
          <li><Link to="/forcompany" className="footermenu">Для компаній</Link></li>
          <li><Link to="/" className="footermenu">Підписки</Link></li>
          <li><Link to="/" className="footermenu">Співпраця</Link></li>
          <li><Link to="/" className="footermenu">Інвестиції</Link></li>
          <li><Link to="/" className="footermenu">Приватність та безпека</Link></li>
        </ul>
      </div>

      <div className="footer-right">
        <h2 className="footer-title">КОНТАКТИ</h2>
        <div className="footer-line"></div>

        <div className="footer-box">
          <div className="footer-block">
            <p className="footer-label">Адреса</p>
            <p className="copy-line">
              <span className="adress-label">
                Вулиця 15 квітня, 1, Тернопіль, Тернопільська область, 46023, Україна
              </span>
              {copied != 'address' &&
              <FontAwesomeIcon
                icon={faCopy}
                className="copy-icon"
                onClick={() =>
                  handleCopy(
                    "Вулиця 15 квітня, 1, Тернопіль, Тернопільська область, 46023, Україна",
                    "address"
                  )
                }
              />
              }
              {copied === 'address' && <span className="copied-text">Скопійовано!</span>}
            </p>
          </div>

          <div className="footer-block">
            <p className="footer-label">Телефон</p>
            <p className="copy-line">
              <a href="tel:+380960000000" className="phone-link">+380-960-000-000</a>
              {copied != 'phone' &&
              <FontAwesomeIcon
                icon={faCopy}
                className="copy-icon"
                onClick={() => handleCopy("+380960000000", "phone")}
              />
              }
              {copied === 'phone' && <span className="copied-text">Скопійовано!</span>}
            </p>
          </div>

          <div className="footer-block">
            <p className="footer-label">E-mail</p>
            <p className="copy-line">
              <a href="mailto:huntee@gmail.com" className="email-link">huntee@gmail.com</a>
              {copied != 'email' &&
              <FontAwesomeIcon
                icon={faCopy}
                className="copy-icon"
                onClick={() => handleCopy("huntee@gmail.com", "email")}
              />
              }
              {copied === 'email' && <span className="copied-text">Скопійовано!</span>}
            </p>
          </div>

          <div className="footer-block">
            <p className="footer-label">Час роботи</p>
            <p className="copy-line">
              <span className="worktime-label">Пн–Пт, 9:00–18:00</span>
            </p>
          </div>
        </div>

        <a
          href="https://www.google.com/maps/place/15+%D0%9A%D0%B2%D1%96%D1%82%D0%BD%D1%8F,+Тернопіль"
          target="_blank"
          rel="noopener noreferrer"
          className="view-map-link"
        >
          Переглянути на карті →
        </a>
      </div>

      <div className="footer-social">
        <p className="social-text">Приєднуйтеся до нас:</p>
        <div className="social-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebookF} className="social-icon facebook" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} className="social-icon instagram" />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedinIn} className="social-icon linkedin" />
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} className="social-icon youtube" />
          </a>
        </div>
      </div>

      <div className="footer-copy">
        © {currentYear} Dream Team Production. MIT License.
      </div>
    </footer>
  );
};

export default Footer;
