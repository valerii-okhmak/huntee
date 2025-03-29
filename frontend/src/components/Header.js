import React from "react";
import "../styless/Header.css";
import logo from "../img/logo.png"; // Імпортуємо PNG-логотип

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <nav className="nav">
        <ul>
          <li><a href="#home">Головна</a></li>
          <li><a href="#about">Про нас</a></li>
          <li><a href="#contact">Контакти</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
