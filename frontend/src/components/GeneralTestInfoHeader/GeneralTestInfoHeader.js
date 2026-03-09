import React from 'react'
import './GeneralTestInfoHeader.css'
import location_icon from '../../img/test/location.png'

const GeneralTestInfoHeader = ({ field, title, location, date, time, name }) => {
  return (
    <div className='generalTestInfoHeader'>
        <div className='generalTestInfoHeader__container'>
            <div className='generalTestInfoHeader__left'>
                <h3 className='generalTestInfoHeader__field'>{field}</h3>
                <h2 className='generalTestInfoHeader__title'>{title}</h2>
                <h3 className='generalTestInfoHeader__field'>{name}</h3>
            </div>
            
            <div className='generalTestInfoHeader__right'>
                {location &&
                <div>
                    <img alt='map' className='location_icon' src={location_icon} />
                    <p>{location}</p>
                </div>
                }
                
                <div>
                    <p>{date}</p>
                    <p>{time}</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default GeneralTestInfoHeader