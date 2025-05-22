import React from 'react'
import './CustomTitle.css'

const CustomTitle = ({ title, data }) => {
  const { logo, line, strong, p } = data || {}

  return (
    <div className='testsTop'>
      <div className='container testsTop_container'>
        <div className='main'>
          <div className='blackbox'></div>
          <h1 className='addtitle'>{title}</h1>
        </div>
        <div className='additional'>
          {logo && <img alt='logo' className='additional_logo' src={logo} />}
          {line && <div className='addline'></div>}
          {strong && <strong>{strong}</strong>}
          {p && <p>{p}</p>}
        </div>
      </div>
    </div>
  )
}

export default CustomTitle
