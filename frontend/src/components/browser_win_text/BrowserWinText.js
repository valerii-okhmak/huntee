import React from 'react';
import './BrowserWinText.css';

const BrowserWinText = ({ text }) => {
  return (
    <div className="browser-win-text">
      {text.split('\n').map((paragraph, index) => (
        paragraph ? <p key={index} className="browser-text-p">{paragraph}</p> : <br key={index} />
      ))}
    </div>
  );
};

export default BrowserWinText;