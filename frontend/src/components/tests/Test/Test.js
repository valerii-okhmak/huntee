import React from 'react'
import './Test.css'
import location_icon from '../../../img/test/location.png'
import softserve from '../../../img/test/softserve.png'

const Test = ({ title, type, location, date, time, link }) => {
  return (
    <div className='test'>
      <div className='top_row'>
        <p className='type'>{type}</p>
        <img alt='logo' className='logo' src={softserve} />
      </div>
      <a href={link} className='title'>{title}</a>
      <div className='bottom_row'>
        <div className='location'>
          <img alt='map' className='location_icon' src={location_icon} />
          <p>{location}</p>
        </div>
        <div className='date'>
          <p>{date}</p>
          <p className='time'>{time}</p>
        </div>
      </div>
    </div>
  );
};

export default Test