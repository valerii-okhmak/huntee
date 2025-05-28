import React from "react";
import "./Header.css";
import logo from "../../img/logo.png"; 
import BurgerMenu from "../burgerMenu/burgerMenu"; 
import { useLocation, Link } from 'react-router-dom';



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
          <li>
            <Link to="/messages" className="headermenu">
              <img src="/headerIcons/contacts.png" alt="Контакти" />
            </Link>
          </li>
          <li>
            <Link to="/profile" className="headermenu">
              <img src="/headerIcons/authorization.png" alt="profile" />
            </Link>
          </li>
          <li>
            <button onClick={menuBtn} className="headermenu burger">
              <img src="/headerIcons/burger.png" alt="Бургер меню" />
            </button>
          </li>
        </ul>
      </nav>
      <BurgerMenu menuBtn={menuBtn}/>
    </header>
  );
};

export default Header;
