import React from "react";
import { useTranslation } from 'react-i18next';
import "./JoinToUs.css";
import backgroundVideo from '../../video/join-to-us.webm';
import { Link } from "react-router-dom";

const JoinToUs = () => {
  const { t } = useTranslation();

  return (
    <div className="join-to-us">
      <div className="join-to-us-container">
        <h1 className="join-to-us-text">
            {t('joinToUs.titleLine1')}
            <br />
            {t('joinToUs.titleLine2')}
        </h1>
        <div className="join-to-us-btn">
          <Link to="/login" className="join-button">{t('joinToUs.button')}</Link>
        </div>
      </div>

      <div className="lets-start-together-now-container">
        <video className="background-video1" autoPlay loop muted>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1 className="lets-start-together-now-text">
            {t('joinToUs.sloganLine1')}
            <br />
            {t('joinToUs.sloganLine2')}
        </h1>
      </div>
    </div>
  );
};

export default JoinToUs;