import React from 'react'
import './CompanyOptions.css'
import { Link } from 'react-router-dom';
import bg_video from '../../video/join-to-us.mp4';
import bg from '../../img/image.png'

const CompanyOptions = () => {
  return (
    <div className='companyOptions'>
        <video className="companyOptions_bd" autoPlay loop muted>
                <source src={bg_video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        <div className='container companyOptions_container'>
            <h2 className='companyOptions__title'>find your best talent</h2>
            <div className='companyOptions__buttons'>
                <Link to="/" className="co-button">СТВОРИТИ ВЛАСНИЙ ТЕСТ</Link>
                <Link to="/" className="co-button">ПЕРЕГЛЯНУТИ ШАБЛОНИ</Link>
            </div>
        </div>
    </div>
  )
}

export default CompanyOptions