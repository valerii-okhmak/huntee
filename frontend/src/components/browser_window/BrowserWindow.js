import React from 'react'
import './BrowserWindow.css'
import browser_nav from "../../img/browser_nav.png"; 

const BrowserWindow = ({ children }) => {
  return (
    <div className="browser-container">
        <div className="browser-top-block">
          <div class="circle">
            <span class="red box"></span>
          </div>
          <div class="circle">
            <span class="yellow box"></span>
          </div>
          <div class="circle">
            <span class="green box"></span>
          </div>
        </div>
        <div className="browser-bottom-block">
            {children}
        </div>
    </div>
  )
}

export default BrowserWindow