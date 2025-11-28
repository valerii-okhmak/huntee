import React from "react";
import "./WorkResponsibilities.css";
import { useNavigate } from "react-router-dom"; 

const WorkResponsibilities = ({ responsibilities, testId }) => { 
 
    const navigate = useNavigate();

    const handleRegistration = () => {
        navigate('/testrules', { state: { testId: testId } }); 
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
        <button className="reg-button" onClick={handleRegistration}>
            Зареєструватися
        </button>
      </div>
    </div>
  );
};

export default WorkResponsibilities;