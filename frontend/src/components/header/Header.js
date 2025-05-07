import React from "react";
import "./Header.css";
import logo from "../../img/logo.png"; 
import BurgerMenu from "../burgerMenu/burgerMenu"; 
import { useLocation } from 'react-router-dom';



const Header = () => {
  const location = useLocation();
  const isAllTestsPage = location.pathname === "/alltests";


  function menuBtn() {
    const burgerContainer = document.querySelector('.burger-container');
    burgerContainer.classList.toggle('active');
  }

  window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    const set = document.querySelector('.set');
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
      set?.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
      set?.classList.remove('scrolled');
    }
  });
  
  return (
    <header className="header">
        <div className="logo">
          <a href="/">
            <img src={logo} alt="Logo" />
          </a>
        </div>
      <nav className="nav">
        <ul>
          {!isAllTestsPage && (
            <li>
              <a href="/alltests" className="headermenu">
                <div className="set">Найближчі набори</div>
              </a>
            </li>
          )}
          <li><a href="/messages" className="headermenu"><img src="/headerIcons/contacts.png" alt="Контакти" /></a></li>
          <li><a href="/profile" className="headermenu"><img src="/headerIcons/authorization.png" alt="profile" /></a></li>
          <li><button onClick={menuBtn} className="headermenu burger"><img src="/headerIcons/burger.png" alt="Бургер меню" /></button></li>
        </ul>
      </nav>
      <BurgerMenu/>
    </header>
  );
};

export default Header;
