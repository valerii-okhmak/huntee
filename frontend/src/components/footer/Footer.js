import React from 'react';
import './Footer.css';

const Footer = () => {
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
            <a href="mailto:pohuysho@gmail.com" className="email-link">huntee@gmail.com</a>
          </p>
        </div>
      </div>

      <a
        href="https://www.google.com/maps/place/%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F+15-%D0%B3%D0%BE+%D0%9A%D0%B2%D1%96%D1%82%D0%BD%D1%8F,+1,+%D0%A2%D0%B5%D1%80%D0%BD%D0%BE%D0%BF%D1%96%D0%BB%D1%8C,+%D0%A2%D0%B5%D1%80%D0%BD%D0%BE%D0%BF%D1%96%D0%BB%D1%8C%D1%81%D1%8C%D0%BA%D0%B0+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C,+46000/@49.5580281,25.6395579,16.61z/data=!4m6!3m5!1s0x473033e5ea7dc1fb:0x45486c20d0e9eaf0!8m2!3d49.5577667!4d25.6415809!16s%2Fg%2F11c4tz2v7l?entry=ttu&g_ep=EgoyMDI1MDUwNy4wIKXMDSoASAFQAw%3D%3Dhttps://www.google.com/maps/place//@49.5569214,25.6390421,17.38z/data=!4m9!1m8!3m7!1s0x473033e5ea7dc1fb:0x45486c20d0e9eaf0!2z0LLRg9C70LjRhtGPIDE1LdCz0L4g0JrQstGW0YLQvdGPLCAxLCDQotC10YDQvdC-0L_RltC70YwsINCi0LXRgNC90L7Qv9GW0LvRjNGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCA0NjAwMA!3b1!8m2!3d49.5577667!4d25.6415809!16s%2Fg%2F11c4tz2v7l?entry=ttu&g_ep=EgoyMDI1MDUwNy4wIKXMDSoASAFQAw%3D%3D"
        target="_blank"
        rel="noopener noreferrer"
        className="view-map-link"
      >
        View on map →
      </a>

    </footer>
  );
};

export default Footer;
