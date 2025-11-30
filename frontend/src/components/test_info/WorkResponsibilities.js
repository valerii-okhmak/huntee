import React from "react";
import "./WorkResponsibilities.css";
import { Link, useNavigate } from "react-router-dom";

const WorkResponsibilities = ({ responsibilities }) => {
 
    const navigate = useNavigate();
    const handleRegistration = () => {
      navigate('/');
    };

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
      <div className='reg-button'>
        <Link to="/testrules">
            <button className="reg-button">Зареєструватися</button>
        </Link>
          </div>
    </div>
  );
};

export default WorkResponsibilities;
