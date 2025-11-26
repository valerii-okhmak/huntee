import React from 'react';
import './ChooseYourFuture.css';
import ChooseYourFutureItem from './ChooseYourFutureItem';
import BrowserWindow from '../browser_window/BrowserWindow';

const ChooseYourFuture = () => {
  return (
    <div className="choose-your-future">
      <div className='choose-your-future-title'>
        <h2>CHOOSE YOUR<br />FUTURE</h2>
      </div>

        <BrowserWindow>
            <ChooseYourFutureItem testname='Frontend'/>
            <ChooseYourFutureItem testname='Backend'/>
            <ChooseYourFutureItem testname='Full-Stack'/>
            <ChooseYourFutureItem testname='Mobile'/>
            <ChooseYourFutureItem testname='DevOps'/>
            <ChooseYourFutureItem testname='Data Science'/>
            <ChooseYourFutureItem testname='QA'/>
            <ChooseYourFutureItem testname='UI/UX Design'/>
            <ChooseYourFutureItem testname='Cybersecurity'/>
            <ChooseYourFutureItem testname='Game'/>
            <ChooseYourFutureItem testname='Artificial Intelligence'/>
            <ChooseYourFutureItem testname='Machine Learning'/>
            <ChooseYourFutureItem testname='Systems Administration'/>
            <ChooseYourFutureItem testname='Systems Programming'/>
            <ChooseYourFutureItem testname='Robotics'/>
            <ChooseYourFutureItem testname='Simulation'/>
            <ChooseYourFutureItem testname='Webflow'/>
        </BrowserWindow>
    </div>
  );
};

export default ChooseYourFuture;
