import React from "react";
import "./Header.css";
import logo from "../../img/logo.png"; // Імпортуємо PNG-логотип
import BurgerMenu from "../burgerMenu/burgerMenu"; // Імпортуємо компонент BurgerMenu


const Header = () => {
  function menuBtn() {
    const burgerContainer = document.querySelector('.burger-container');
    burgerContainer.classList.toggle('active');
  }
  return (
    <header className="header">
        <div className="logo">
          <a href="/">
            <img src={logo} alt="Logo" />
          </a>
        </div>
      <nav className="nav">
        <ul>
          <li><a href="#footer" className="headermenu"><div className="set">Найближчі набори</div></a></li> 
          <li><a href="#footer" className="headermenu"><img src="/headerIcons/contacts.png" alt="Контакти" /></a></li>
          <li><a href="/auth" className="headermenu"><img src="/headerIcons/authorization.png" alt="Авторизація" /></a></li>
          <li><button onClick={menuBtn} className="headermenu burger"><img src="/headerIcons/burger.png" alt="Бургер меню" /></button></li>
        </ul>
      </nav>
      <BurgerMenu/>
    </header>
  );
};

export default Header;
