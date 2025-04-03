import React from "react";
import "./main_start.css";

const Main_start = () => {
  return (
    <div className="main_start">
        <div className="main_start__container">
            <h1>LETS START<br/>TOGETHER<br/>NOW!</h1>
            <h2>Тести створені щоб допомогти студентам знайти свою карєру в IT</h2>

            <div className="main_start__buttons">
              <a href="/" className="button">Активні тести</a>
              <a href="/" className="button">Пробний тест</a>
              </div>
        </div>
    </div>
  );
};

export default Main_start;