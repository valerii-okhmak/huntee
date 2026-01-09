import React, { useState, useEffect } from 'react';
import './Test.css';
import location_icon from '../../../img/test/location.png';
import { Link } from 'react-router-dom';

const Test = ({ id, title, type, location, date, time, status, startDateObj }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // Якщо статус не "Scheduled" або немає дати, таймер не потрібен
    if (status !== 'Scheduled' || !startDateObj) return;

    const calculateTime = () => {
      const now = new Date();
      const difference = startDateObj.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Тест перенесено в \"Активні тести\"!");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      let parts = [];
      if (days > 0) parts.push(`${days}д`);
      if (hours > 0) parts.push(`${hours}г`);
      if (minutes > 0) parts.push(`${minutes}хв`);
      parts.push(`${seconds}с`); // Секунди залишаємо завжди

      setTimeLeft(parts.join(" "));
    };

    calculateTime();
    const timerId = setInterval(calculateTime, 1000);
    
    return () => clearInterval(timerId); // Обов'язкове очищення
  }, [status, startDateObj]);

  const renderButton = () => {
    // Використовуємо сувору перевірку статусів
    if (status === 'Active') {
      return (
        <Link to={`/test/${id}`}>
          <button className="testDashboard__analytics-btn-dark">Пройти тест</button>
        </Link>
      );
    }
    
    if (status === 'Closed') {
      return (
        <Link to={`/testreview/${id}`}>
          <button className="testDashboard__analytics-btn-dark">Результати</button>
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