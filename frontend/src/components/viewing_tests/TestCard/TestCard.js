import React from 'react';
import './TestCard.css';
import location_icon from '../../../img/test/location.png';
import { Link } from 'react-router-dom';

const TestCard = ({ title, type, location, date, time, link, isActive, candidatesCount }) => {
  return (
    <div className='testcard-container'>
      <div className='testcard-top_row'>
        <p className='testcard-type'>{type}</p>

        {isActive ? (
          <p className='testcard-status-active'>Зареєстровано: {candidatesCount}</p>
        ) : (
          <Link to={link} className='testcard-status-unactive'>Переглянути результати</Link>
        )}
      </div>

      <Link to={link} className='testcard-title'>{title}</Link>

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