import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const { t } = useTranslation();
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
          <li><Link to="/generalinfo" className="footermenu">{t('footer.menu.about')}</Link></li>
          <li><Link to="/contacts" className="footermenu">{t('footer.menu.questions')}</Link></li>
          <li><Link to="/companymain" className="footermenu">{t('footer.menu.forCompanies')}</Link></li>
          <li><Link to="/pricingpage" className="footermenu">{t('footer.menu.pricing')}</Link></li>
          <li><Link to="/" className="footermenu">{t('footer.menu.cooperation')}</Link></li>
          <li><Link to="/" className="footermenu">{t('footer.menu.investments')}</Link></li>
          <li><Link to="/" className="footermenu">{t('footer.menu.privacy')}</Link></li>
        </ul>
      </div>

      <div className="footer-right">
        <h2 className="footer-title">{t('footer.contactsTitle')}</h2>
        <div className="footer-line"></div>

        <div className="footer-box">
          <div className="footer-block">
            <p className="footer-label">{t('footer.labels.address')}</p>
            <p className="copy-line">
              <span className="adress-label">
                {t('footer.addressValue')}
              </span>
              {copied !== 'address' &&
              <FontAwesomeIcon
                icon={faCopy}
                className="copy-icon"
                onClick={() =>
                  handleCopy(t('footer.addressValue'), "address")
                }
              />
              }
              {copied === 'address' && <span className="copied-text">{t('footer.copied')}</span>}
            </p>
          </div>

          <div className="footer-block">
            <p className="footer-label">{t('footer.labels.phone')}</p>
            <p className="copy-line">
              <a href="tel:+380960000000" className="phone-link">+380-960-000-000</a>
              {copied !== 'phone' &&
              <FontAwesomeIcon
                icon={faCopy}
                className="copy-icon"
                onClick={() => handleCopy("+380960000000", "phone")}
              />
              }
              {copied === 'phone' && <span className="copied-text">{t('footer.copied')}</span>}
            </p>
          </div>

          <div className="footer-block">
            <p className="footer-label">{t('footer.labels.email')}</p>
            <p className="copy-line">
              <a href="mailto:huntee@gmail.com" className="email-link">huntee@gmail.com</a>
              {copied !== 'email' &&
              <FontAwesomeIcon
                icon={faCopy}
                className="copy-icon"
                onClick={() => handleCopy("huntee@gmail.com", "email")}
              />
              }
              {copied === 'email' && <span className="copied-text">{t('footer.copied')}</span>}
            </p>
          </div>

          <div className="footer-block">
            <p className="footer-label">{t('footer.labels.worktime')}</p>
            <p className="copy-line">
              <span className="worktime-label">{t('footer.worktimeValue')}</span>
            </p>
          </div>
        </div>

        <a
          href="https://www.google.com/maps/place/15+%D0%9A%D0%B2%D1%96%D1%82%D0%BD%D1%8F,+Тернопіль"
          target="_blank"
          rel="noopener noreferrer"
          className="view-map-link"
        >
          {t('footer.viewMap')} →
        </a>
      </div>

      <div className="footer-social">
        <p className="social-text">{t('footer.joinUs')}</p>
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