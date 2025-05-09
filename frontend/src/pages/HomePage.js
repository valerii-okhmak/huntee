import React from 'react';

import Welcome from '../components/welcome/Welcome';
import Slider from '../components/slider/Slider';
import Main_start from '../components/main_start/main_start';
import TrialTesting from '../components/trial_testing/TrialTesting';
import '../index.css';
import ChooseYourFuture from '../components/chs_your_future/ChooseYourFuture';

const HomePage = () => {
  return (
    <div className='page'>
      <div className='welcome__container'> 
        <Welcome></Welcome>
        <Slider></Slider>
      </div>
      <Main_start></Main_start>
      <TrialTesting></TrialTesting>
      <ChooseYourFuture></ChooseYourFuture>
    </div>
  );
};

export default HomePage;
