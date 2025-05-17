import React from 'react';
import './TestInfo.css';

const TestInfo = ({category,logo,vacancy,location,date,time}) => {
    return (
       <div className="info-top-section">
             <div className="info-top-line">
               <div className="info-category">{category}</div>
               <div className="info-logo">
                   <img src={logo} alt="Фото компанії" />
               </div>
               </div>
               <h1 className="info-title">{vacancy}</h1>
               <div className="info-top-line">
               <div className="info-location">
               <div className="info-icon">
                   <img src="/icons/location.png" alt="Локація"/>
               </div>
               {location}
               </div>
               <div className="info-date-time">
               <div className="info-icon">
                   <img src="/icons/calendar.png" alt="Календар"/>
               </div>
                 {date}<strong>{time}</strong>
               </div>
               </div>
             </div>
    );
}

export default TestInfo;