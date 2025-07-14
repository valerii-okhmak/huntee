import React from 'react'
import './CompanyOptions.css'
import { Link } from 'react-router-dom';
import bg from '../../img/image.png'

const CompanyOptions = () => {
  return (
    <div className='companyOptions'>
        <img className='companyOptions_bg' src={bg} alt='' />
        <div className='container companyOptions_container'>
            <h2 className='companyOptions__title'>Знайдіть собі найкращих працівників</h2>
            <div className='companyOptions__buttons'>
                <Link to="/" className="co-button">СТВОРИТИ ВЛАСНИЙ ТЕСТ</Link>
                <Link to="/" className="co-button">ПЕРЕГЛЯНУТИ ШАБЛОНИ</Link>
            </div>
        </div>
    </div>
  )
}

export default CompanyOptions