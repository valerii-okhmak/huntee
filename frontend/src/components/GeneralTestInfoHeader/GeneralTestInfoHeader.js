import React from 'react'
import './GeneralTestInfoHeader.css'
import location_icon from '../../img/test/location.png'

const generalTestInfoHeader = ({ field, title, location, date, time }) => {
  return (
    <div className='generalTestInfoHeader'>
        <div className='container generalTestInfoHeader__container'>
            <div className='generalTestInfoHeader__left'>
                <h3 className='generalTestInfoHeader__field'>{field}</h3>
                <h2 className='generalTestInfoHeader__title'>{title}</h2>
            </div>
            <div className='generalTestInfoHeader__right'>
                <div>
                    <img alt='map' className='location_icon' src={location_icon} />
                    <p>{location}</p>
                </div>
                <div>
                    <p>{date}</p>
                    <p>{time}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default generalTestInfoHeader