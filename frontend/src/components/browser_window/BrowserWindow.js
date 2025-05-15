import React from 'react'
import './BrowserWindow.css'
import browser_nav from "../../img/browser_nav.png"; 

const BrowserWindow = ({ children }) => {
  return (
    <div className="browser-container">
        <div className="browser-top-block">
          <div className="browser-image">
            <img src={browser_nav} alt="<Браузерне меню"/>
          </div>
          <div className="vertical-line"></div>
        </div>
        <div className="horizontal-line"></div>
        <div className="browser-bottom-block">
            {children}
        </div>
    </div>
  )
}

export default BrowserWindow