import React from 'react';

import Welcome from '../components/welcome/Welcome';
import Slider from '../components/slider/Slider';
import Main_start from '../components/main_start/main_start';
import TrialTesting from '../components/trial_testing/TrialTesting';
import '../index.css';
import ChooseYourFuture from '../components/chs_your_future/ChooseYourFuture';
import JoinToUs from '../components/join_to_us/JoinToUs';

import VerticalStepper from '../components/VerticalStepper/VerticalStepper';


const HomePage = () => {
  return (
    <div className='page'>
      <VerticalStepper />
      <div id="section-01" className='welcome__container'> 
        <Welcome/>
        <Slider/>
      </div>
      <div id="section-02"><Main_start/></div>
      <div id="section-03"><TrialTesting/></div>
      <div id="section-04"><ChooseYourFuture/></div>
      <div id="section-05"><JoinToUs/></div>
    </div>
  );
};

export default HomePage;
