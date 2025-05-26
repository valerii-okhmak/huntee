import React from "react";
import "./JoinToUs.css";
import backgroundVideo from '../../video/join-to-us.mp4';
import { Link } from "react-router-dom";

const JoinToUs = () => {
  return (
    <div className="join-to-us">
      <div className="join-to-us-container">
        <h1 className="join-to-us-text">Приєднуйся<br />до нас!</h1>
        <div className="join-to-us-btn">
          <Link to="/login" className="join-button">Увійти</Link>
        </div>
      </div>

      <div className="lets-start-together-now-container">
        <video className="background-video1" autoPlay loop muted>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <h1 className="lets-start-together-now-text">Let's start<br />together now</h1>
      </div>
    </div>
  );
};

export default JoinToUs;
