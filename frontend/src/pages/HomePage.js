import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Welcome from '../components/welcome/Welcome';
import Slider from '../components/slider/Slider';
import Main_start from '../components/main_start/main_start';
import TrialTesting from '../components/trial_testing/TrialTesting';
import '../index.css';

const HomePage = () => {
  return (
    <div className='page'>
      <Header />
      <div className='welcome__container'> 
        <Welcome></Welcome>
        <Slider></Slider>
      </div>
      <Main_start></Main_start>
      <TrialTesting></TrialTesting>
      <Footer />
    </div>
  );
};

export default HomePage;
