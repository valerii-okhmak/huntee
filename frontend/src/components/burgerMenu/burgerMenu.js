import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import './burgerMenu.css';
import { getAccessToken } from '../../utils/auth';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'; 

const BurgerMenu = ({ menuRef, toggleMenu }) => {
  const { t } = useTranslation(); 
  const isAuthenticated = !!getAccessToken();

  return (
    <div ref={menuRef} className='burger-container'>
      <div className='burger-menu'>
        <div className='burger-line'></div>
        
        <div className="burger-lang-container">
            <LanguageSwitcher />
        </div>

        <ul className='burger-list'>
          <li>
            <Link to="/generalinfo" onClick={toggleMenu} className='link'>
              <span className='digit'>1</span>
              <span className='burger-text'>{t('burger.whatIsPlatform')}</span>
            </Link>
          </li>

          <li className="burger-section delay-1">{t('burger.forStudents')}</li>

          <li>
            <Link to="/profile" onClick={toggleMenu} className='link'>
              <span className='digit'>2</span>
              <span className='burger-text'>{t('burger.myAccount')}</span>
            </Link>
          </li>
          <li>
            <Link to="/alltests" onClick={toggleMenu} className='link'>
              <span className='digit'>3</span>
              <span className='burger-text'>{t('burger.activeTests')}</span>
            </Link>
          </li>
          <li>
            <Link to="/starttest" onClick={toggleMenu} className='link'>
              <span className='digit'>4</span>
              <span className='burger-text'>{t('burger.practiceTests')}</span>
            </Link>
          </li>

          <li>
            <Link to="" onClick={toggleMenu} className='link'>
              <span className='digit'>5</span>
              <span className='burger-text'>
                Soft Skills test
                <span style={{ color: 'red', fontSize: '0.8em', marginLeft: '5px' }}>
                   {t('burger.tempUnavailable')}
                </span>
              </span>
            </Link>
          </li>
          <li>
            <Link to="" onClick={toggleMenu} className='link'>
              <span className='digit'>6</span>
              <span className='burger-text'>
                {t('burger.howToChoose')}
                <span style={{ color: 'red', fontSize: '0.8em', marginLeft: '5px' }}>
                   {t('burger.tempUnavailable')}
                </span>
              </span>
            </Link>
          </li>

          <li className="burger-section delay-2">{t('burger.forCompanies')}</li>

          <li>
            <Link to="/companymain" onClick={toggleMenu} className='link'>
              <span className='digit'>7</span>
              <span className='burger-text'>{t('burger.companyMain')}</span>
            </Link>
          </li>
          <li>
            <Link to="/testcreation" onClick={toggleMenu} className='link'>
              <span className='digit'>8</span>
              <span className='burger-text'>{t('burger.howToCreate')}</span>
            </Link>
          </li>
          <li>
            <Link to="" onClick={toggleMenu} className='link'>
              <span className='digit'>9</span>
              <span className='burger-text'>
                {t('burger.processAndResults')}
                <span style={{ color: 'red', fontSize: '0.8em', marginLeft: '5px' }}>
                   {t('burger.tempUnavailable')}
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BurgerMenu;