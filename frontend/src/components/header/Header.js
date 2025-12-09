import React, { useRef, useEffect } from "react";
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

  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const toggleMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.toggle("active");
    }
  };

  // Закриття меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        btnRef.current &&
        !btnRef.current.contains(event.target)
      ) {
        menuRef.current.classList.remove("active");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Зміна стилю хедера при скролі
  useEffect(() => {
    const onScroll = () => {
      const header = document.querySelector('header');
      const set = document.querySelector('.set');
      if (window.scrollY > 0) {
        header.classList.add('scrolled');
        set?.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
        set?.classList.remove('scrolled');
      }
    };
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
              <button ref={btnRef} onClick={toggleMenu} className="headermenu burger" aria-label="Бургер меню">
                <FontAwesomeIcon icon={faBars} className="header-icon"/>
              </button>
            </li>
          </div>
        </ul>
      </nav>
      <BurgerMenu menuRef={menuRef} toggleMenu={toggleMenu} />
    </header>
  );
};

export default Header;
