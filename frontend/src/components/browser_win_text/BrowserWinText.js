import React from 'react';
import './BrowserWinText.css';

const BrowserWinText = ({ text, title }) => {
  return (
    <div className="browser-win-text">
      <h1 className='browser-win-title'>{title}</h1>
      {text.split('\n').map((paragraph, index) => (
        paragraph ? <p key={index} className="browser-text-p">{paragraph}</p> : <br key={index} />
      ))}
    </div>
  );
};

export default BrowserWinText;