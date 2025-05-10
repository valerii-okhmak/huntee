import React from 'react';
import './ChooseYourFuture.css';
import browser_nav from "../../img/browser_nav.png"; 
import ChooseYourFutureItem from './ChooseYourFutureItem';

const ChooseYourFuture = () => {
  return (
    <div className="choose-your-future">
      <h2>CHOOSE YOUR<br />FUTURE</h2>

      <div className="chs-your-future-container">
        <div className="browser-top-block">
          <div className="browser-image">
            <img src={browser_nav} alt="<Браузерне меню"/>
          </div>
          <div className="vertical-line"></div>
        </div>
        <div className="horizontal-line"></div>
        <div className="browser-bottom-block">
            <ChooseYourFutureItem testname='ШО'/>
            <ChooseYourFutureItem testname='Ш'/>
            <ChooseYourFutureItem testname='ШО'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='FRONTENDDD'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='FRONTENDDD'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
            <ChooseYourFutureItem testname='ШОСЬ'/>
      </div>
    </div>
    </div>
  );
};

export default ChooseYourFuture;
