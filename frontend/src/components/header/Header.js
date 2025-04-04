import React from "react";
import "./Header.css";
import logo from "../../img/logo.png"; // Імпортуємо PNG-логотип

const Header = () => {
  return (
    <header className="header">
        <div className="logo">
          <a href="/">
            <img src={logo} alt="Logo" />
          </a>
        </div>
      <nav className="nav">
        <ul>
          <li><a href="#footer"><div className="set">Найближчі набори</div></a></li> 
          <li><a href="#footer"><img src="/headerIcons/contacts.png" alt="Контакти" /></a></li>
          <li><a href="/auth"><img src="/headerIcons/authorization.png" alt="Авторизація" /></a></li>
          <li><a href="/"><img src="/headerIcons/burger.png" alt="Бургер меню" /></a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
