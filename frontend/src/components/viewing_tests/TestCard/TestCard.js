import React from 'react';
import './TestCard.css';
import location_icon from '../../../img/test/location.png';
import { Link } from 'react-router-dom';

const TestCard = ({ title, type, location, date, time, link, candidatesCount }) => {
  return (
    <Link to={link} className='testcard-link'>
      <div className='testcard-container'>
        <div className='testcard-top_row'>
          <p className='testcard-type'>{type}</p>
            <p className='testcard-status-active'>Зареєстровано: {candidatesCount}</p>
        </div>

        <div className='testcard-title'>{title}</div>

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
    </Link>
  );
};

export default TestCard;
