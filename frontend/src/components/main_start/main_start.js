import React from "react";
import { useTranslation } from 'react-i18next';
import "./main_start.css";
import { Link } from "react-router-dom";


const Main_start = () => {
  const { t } = useTranslation();

  return (
    <div className="main_start">
      
      {/* 👇 Додана змійка */}
      <img src="mainPagePhoto/snake2.png" alt="" className="snake-background" />

      <div className="main_start__container">
        <h1>
            {t('mainStart.titleLine1')}
            <br />
            {t('mainStart.titleLine2')}
        </h1>
        <h2>{t('mainStart.subtitle')}</h2>

        <div className="main_start__buttons">
          <Link to="/alltests" className="button">{t('mainStart.activeTests')}</Link>
          <Link to="/starttest" className="button">{t('mainStart.practiceTest')}</Link>
          <Link to="/starttest" className="button">{t('mainStart.itNavigator')}</Link>
        </div>
      </div>
    </div>
  );
};

export default Main_start;