import React from "react";
import "./CompanyInfo.css";

const CompanyInfo = ({ text }) => {

  const handleInfo = () => {
    window.open('https://www.softserveinc.com/uk-ua/about-us', '_blank');
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
