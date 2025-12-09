import React from 'react';
import './Test.css';
import location_icon from '../../../img/test/location.png';
import { Link } from 'react-router-dom';

const Test = ({ id, title, type, location, date, time, link }) => {
  return (
    <a href={link} className="test clickable-card">
      <div className='top_row'>
        <p className='type'>{type}</p>
        <div className='location'>
          <img alt='map' className='location_icon' src={location_icon} />
          <p>{location}</p>
        </div>
      </div>

      <p className='title'>{title}</p>

      <div className='bottom_row'>
        <Link to={`/test/${id}`}><button className="testDashboard__analytics-btn-dark">Пройти тест</button></Link>
        <div className='date'>
          <p>{date}</p>
          <p className='time'>{time}</p>
        </div>
      </div>
    </a>
  );
};

export default Test;
