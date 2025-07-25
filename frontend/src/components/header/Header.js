import React from "react";
import "./Header.css";
import logo from "../../img/logo.png"; 
import BurgerMenu from "../burgerMenu/burgerMenu"; 
import { useLocation, Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 

const Header = () => {
  const location = useLocation();
  const isAllTestsPage = location.pathname === "/alltests";

  function menuBtn() {
    const burgerContainer = document.querySelector('.burger-container');
    burgerContainer.classList.toggle('active');
  }

  React.useEffect(() => {
    function onScroll() {
      const header = document.querySelector('header');
      const set = document.querySelector('.set');
      if (window.scrollY > 0) {
        header.classList.add('scrolled');
        set?.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
        set?.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <nav className="nav">
        <ul>
          {!isAllTestsPage && (
            <li>
              <Link to="/alltests" className="headermenu">
                <div className="set">Найближчі набори</div>
              </Link>
            </li>
          )}
          <div className="header-icons">
          <li>
            <Link to="/messages" className="headermenu" aria-label="Повідомлення">
              <FontAwesomeIcon icon={faEnvelope} className="header-icon" />
            </Link>
          </li>
          <li>
            <Link to="/profile" className="headermenu" aria-label="Профіль">
              <FontAwesomeIcon icon={faUser} className="header-icon" />
            </Link>
          </li>
          <li>
            <button onClick={menuBtn} className="headermenu burger" aria-label="Бургер меню">
              <FontAwesomeIcon icon={faBars} className="header-icon"/>
            </button>
          </li>
          </div>
        </ul>
      </nav>
      <BurgerMenu menuBtn={menuBtn}/>
    </header>
  );
};

export default Header;
