import React from 'react';
import '../styless/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
        <h2 className="footer-title">КОНТАКТИ</h2>
        <div className="footer-line"></div>
        <p>Телефон: +380 67 123 4567</p>
        <p>Email: example@email.com</p>
        <p>Адреса: Київ, вул. Бандери, 10</p>
    </footer>
  );
};

export default Footer;
