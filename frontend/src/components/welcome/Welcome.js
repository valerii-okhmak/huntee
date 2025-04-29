import React from 'react';
import './Welcome.css';
import backgroundVideo from '../../video/welcomevideo.mp4'; // ⚠️ вкажи правильний шлях до відео

const Welcome = () => {
  return (
    <div className="welcome">
      <video className="background-video" autoPlay loop muted>
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="container">
        <p className="text">DUDE, THIS IS<br/>YOUR FUTURE</p>
      </div>
    </div>
  );
};

export default Welcome;
