import React from 'react';
import './UnactiveItem.css';

const UnactiveItem = ({ category, vacancy, date, time, logo, result, read }) => {
  const safeResult = Math.max(0, Math.min(100, result)); // обмежуємо від 0 до 100
  const resultClass = safeResult < 60 ? 'low' : 'high';

  return (
    <div className="unactive-item">
      <img src={logo} alt="logo" className="unactive-item__logo" />
      <p className="unactive-item__category">{category}</p>
      <h2 className="unactive-item__vacancy">{vacancy}</h2>
      <p className="unactive-item__datetime">{date} &nbsp;&nbsp; {time}</p>
      
      <p className={`unactive-item__result ${resultClass}`}>
        {safeResult}/100%
      </p>
      
      {!read && <div className="unread-unactive-message"></div>}
    </div>
  );
};

export default UnactiveItem;
