import React from 'react';
import './TestCard.css';
import location_icon from '../../../img/test/location.png';

const TestCard = ({ title, type, location, date, time, link, isActive }) => {
  return (
    <div className='testcard-container'>
      <div className='testcard-top_row'>
        <p className='testcard-type'>{type}</p>

        {isActive ? (
          <p className='testcard-status-active'>Зареєстровано: 1400</p>
        ) : (
          <button className='testcard-status-unactive'>Переглянути результати</button>
        )}
      </div>

      <a href={link} className='testcard-title'>{title}</a>

      <div className='testcard-bottom_row'>
        <div className='testcard-location'>
          <img alt='map' className='location_icon' src={location_icon} />
          <p>{location}</p>
        </div>
        <div className='testcard-date'>
          <p>{date}</p>
          <p className='testcard-time'>{time}</p>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
