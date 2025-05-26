import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Отримуємо поточний рік

  return (
    <footer className="footer" id="footer">
      <h2 className="footer-title">КОНТАКТИ</h2>
      <div className="footer-line"></div>

      <div className="footer-box">
        <div className="footer-block">
          <p className="footer-label">Address</p>
          <p className="adress-label"> Вулиця 15 квітня, 1</p>
          <p className="adress-label"> Тернопіль, Тернопільська область, 46023</p>
          <p className="adress-label">Україна</p>
        </div>

        <div className="footer-block">
          <p className="footer-label">Phone</p>
          <p className="copy-line">
            <a href="tel:+380960000000" className="phone-link">+380-960-000-000</a>
          </p>
        </div>

        <div className="footer-block">
          <p className="footer-label">E-mail</p>
          <p className="copy-line">
            <a href="mailto:huntee@gmail.com" className="email-link">huntee@gmail.com</a>
          </p>
        </div>
      </div>

      <a
        href="https://www.google.com/maps/place/..."
        target="_blank"
        rel="noopener noreferrer"
        className="view-map-link"
      >
        View on map →
      </a>

      <div className="footer-copy">
        © {currentYear} Dream Team Production
      </div>
    </footer>
  );
};

export default Footer;
