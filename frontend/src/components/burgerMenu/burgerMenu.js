import React from 'react';
import { Link } from 'react-router-dom';
import './burgerMenu.css';
import { getAccessToken, logout } from '../../utils/auth';
import { Colors } from 'chart.js';

const BurgerMenu = ({ menuRef, toggleMenu }) => {
  const isAuthenticated = !!getAccessToken();

  return (
    <div ref={menuRef} className='burger-container'>
      <div className='burger-menu'>
        <div className='burger-line'></div>
        <ul className='burger-list'>
          <li>
            <Link to="/generalinfo" onClick={toggleMenu} className='link'>
              <span className='digit'>1</span>
              <span className='burger-text'>Що це за платформа?</span>
            </Link>
          </li>

          <li className="burger-section delay-1">для студентів</li>

          <li>
            <Link to="/profile" onClick={toggleMenu} className='link'>
              <span className='digit'>2</span>
              <span className='burger-text'>Мій аккаунт</span>
            </Link>
          </li>
          <li>
            <Link to="/alltests" onClick={toggleMenu} className='link'>
              <span className='digit'>3</span>
              <span className='burger-text'>Активні тести</span>
            </Link>
          </li>
          <li>
            <Link to="/starttest" onClick={toggleMenu} className='link'>
              <span className='digit'>4</span>
              <span className='burger-text'>Пробний тести</span>
            </Link>
          </li>

          <li>
            <Link to="" onClick={toggleMenu} className='link'>
              <span className='digit'>5</span>
              <span className='burger-text'>Soft Skills test<span style={{ color: 'red' }}> (Тимчасово не працює)</span></span>
            </Link>
          </li>
          <li>
            <Link to="" onClick={toggleMenu} className='link'>
              <span className='digit'>6</span>
                          <span className='burger-text'>Як обрати напрям IT?<span style={{ color: 'red' }}> (Тимчасово не працює)</span></span>
            </Link>
          </li>

          <li className="burger-section delay-2">для компаній</li>

          <li>
            <Link to="/companymain" onClick={toggleMenu} className='link'>
              <span className='digit'>7</span>
              <span className='burger-text'>Головна сторінка компаній</span>
            </Link>
          </li>
          <li>
            <Link to="/testcreation" onClick={toggleMenu} className='link'>
              <span className='digit'>8</span>
              <span className='burger-text'>Як створити тест?</span>
            </Link>
          </li>
          <li>
            <Link to="" onClick={toggleMenu} className='link'>
              <span className='digit'>9</span>
              <span className='burger-text'>Процес оцінювання та результати<span style={{ color: 'red' }}> (Тимчасово не працює)</span></span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BurgerMenu;
