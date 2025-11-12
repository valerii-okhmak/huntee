import React from "react";
import "./AboutWork.css";
import BrowserWindow from "../browser_window/BrowserWindow";
import BrowserWinText from "../browser_win_text/BrowserWinText";

const AboutWork = ({ vacancyDescription }) => {
  return (
      <div className="about-work">
        <div className="about-work-title">
        <h2>ABOUT WORK</h2>
        </div>
        <div className="about-work-text">
        <BrowserWindow>
          <BrowserWinText 
            who={'шановний(на) студенте(тко)'} 
            company={'huntee'} 
            text={vacancyDescription} 
          />
        </BrowserWindow>
        </div>
      </div>
  );
}
export default AboutWork;