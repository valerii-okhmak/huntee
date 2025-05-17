import React from "react";
import "./CompanyInfo.css";

const CompanyInfo = ({ text }) => {
  return (
    <div className="company-info-container">
      <div className="company-info">
        {text.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <div className="details-button">
        <button>Детальніше</button>
      </div>
    </div>
  );
};

export default CompanyInfo;
