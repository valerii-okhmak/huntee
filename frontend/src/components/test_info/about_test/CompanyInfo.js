import React from "react";
import "./CompanyInfo.css";
import { useNavigate } from "react-router-dom";

const CompanyInfo = ({ text }) => {

  const navigate = useNavigate();
  const handleInfo = () => {
    navigate('/');
  };
  return (
    <div className="company-info-container">
      <div className="company-info">
        {text.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="details-button">
        <button onClick={handleInfo}>Детальніше</button>
      </div>
    </div>
  );
};

export default CompanyInfo;
