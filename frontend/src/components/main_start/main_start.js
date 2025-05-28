import React from "react";
import "./main_start.css";
import { Link } from "react-router-dom";

const Main_start = () => {
  return (
    <div className="main_start">
      <div className="main_start__container">
        <h1>LETS START<br />TOGETHER NOW!</h1>
        <h2>Тести створені щоб допомогти студентам знайти свою карʼєру в IT</h2>

        <div className="main_start__buttons">
          <Link to="/alltests" className="button">Активні тести</Link>
          <Link to="/trialtest" className="button">Пробний тест</Link>
        </div>
      </div>
    </div>
  );
};

export default Main_start;
