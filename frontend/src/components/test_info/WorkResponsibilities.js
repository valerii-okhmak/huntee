import React from "react";
import "./WorkResponsibilities.css";

const WorkResponsibilities = ({ responsibilities }) => {
  return (
    <div className="responsibilities-info">
      <div className="responsibilities-info-container">
        <h3>Обов'язки</h3>
        <ul>
          {responsibilities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="reg-button">
        <button>Зареєструватися</button>
      </div>
    </div>
  );
};

export default WorkResponsibilities;
