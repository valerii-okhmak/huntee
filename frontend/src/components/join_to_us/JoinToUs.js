import React from "react";
import "./JoinToUs.css";

const JoinToUs = () => {
  return (
<div className="join-to-us">
  <div className="join-to-us-container">
    <div className="join-to-us-left">
      <h1 className="join-to-us-text">Приєднуйся<br/>до нас!</h1>
    </div>
    <div className="join-to-us-right">
      <div className="join-to-us-btn">
        <a href="/login" className="join-button">Увійти</a>
      </div>
    </div>
  </div>
  <div className="lets-start-together-now-container">
    <h1 className="lets-start-together-now-text">Let's start<br/>together now</h1>
  </div>
</div>

  );
};

export default JoinToUs;