import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Test.css';
import location_icon from '../../../img/test/location.png';
import { Link } from 'react-router-dom';

const Test = ({ id, title, type, location, date, time, status, startDateObj }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (status !== 'Scheduled' || !startDateObj) return;

    const calculateTime = () => {
      const now = new Date();
      const difference = startDateObj.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft(t('testCard.movedToActive'));
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      let parts = [];
      if (days > 0) parts.push(`${days}${t('testCard.time.days')}`);
      if (hours > 0) parts.push(`${hours}${t('testCard.time.hours')}`);
      if (minutes > 0) parts.push(`${minutes}${t('testCard.time.minutes')}`);
      parts.push(`${seconds}${t('testCard.time.seconds')}`); 

      setTimeLeft(parts.join(" "));
    };

    calculateTime();
    const timerId = setInterval(calculateTime, 1000);
    
    return () => clearInterval(timerId); 
  }, [status, startDateObj, t]);

  const renderButton = () => {
    if (status === 'Active') {
      return (
        <Link to={`/test/${id}`}>
          <button className="testDashboard__analytics-btn-dark">{t('testCard.buttons.takeTest')}</button>
        </Link>
      );
    }
    
    if (status === 'Closed') {
      return (
        <Link to={`/testreview/${id}`}>
          <button className="testDashboard__analytics-btn-dark">{t('testCard.buttons.results')}</button>
        </Link>
      );
    }

    if (status === 'Scheduled') {
      return (
        <div className="test-timer">
          <span className="timer-time">{timeLeft || ""}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="test clickable-card">
      <div className='top_row'>
        <p className='type'>{type}</p>
        <div className='location'>
          <img alt='map' className='location_icon' src={location_icon} />
          <p>{location}</p>
        </div>
      </div>

      <p className='title'>{title}</p>

      <div className='bottom_row'>
        {renderButton()}
        <div className='date'>
          <p>{date}</p>
          <p className='time'>{time}</p>
        </div>
      </div>
    </div>
  );
};

export default Test;