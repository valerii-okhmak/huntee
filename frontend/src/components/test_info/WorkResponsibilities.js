import React from "react";
import { useTranslation } from 'react-i18next';
import "./WorkResponsibilities.css";

const WorkResponsibilities = ({ responsibilities }) => { 
    const { t } = useTranslation();

  return (
    <div className="responsibilities-info-container">
      <h3>{t('workResponsibilities.title')}</h3>
      <ul>
        {responsibilities.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default WorkResponsibilities;