import React from 'react';
import './ActiveItem.css';

const ActiveItem = ({ category, vacancy, date, time, logo }) => {
  return (
    <div className="active-item">
      <img src={logo} alt="logo" className="active-item__logo" />
      <p className="active-item__category">{category}</p>
      <h2 className="active-item__vacancy">{vacancy}</h2>
      <p className="active-item__datetime">{date} &nbsp;&nbsp; {time}</p>
    </div>
  );
};

export default ActiveItem;
