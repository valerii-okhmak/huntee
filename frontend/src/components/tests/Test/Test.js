import React from 'react'
import './Test.css'
import location_icon from '../../../img/test/location.png'
import softserve from '../../../img/test/softserve.png'

const Test = () => {
  return (
    <div className='test'>
      <div className='top_row'>
        <p className='type'>Data Science</p>
        <img alt='logo' className='logo' src={softserve}/>
      </div>
      <a href='/testpage' className='title'>JUNIOR DATA SCIENTIST</a>
      <div className='bottom_row'>
        <div className='location'>
          <img alt='map' className='location_icon' src={location_icon} />
          <p>Lviv</p>
        </div>
        <div className='date'>
          <p>21.03.2025</p>
          <p className='time'>18:00</p>
        </div>
      </div>
    </div>
  )
}

export default Test