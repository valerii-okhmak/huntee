import React from 'react'
import './BrowserWinText.css'

const BrowserWinText = ({who, text, company}) => {
  return (
    <div className='browser-text-container'>
        <h2 className='browser-text-title'>Доброго дня, {who}</h2>
        {text.split('\n').map((paragraph, index) => (
            <p className='browser-text-content' key={index}>{paragraph}</p>
        ))}
        <p className='browser-text-company'>З повагою, {company}</p>
    </div>
  )
}

export default BrowserWinText