import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Welcome from '../components/welcome/Welcome';
import Slider from '../components/slider/Slider';
import welcome_img from '../img/image.png'
import Main_start from '../components/main_start/main_start';
import '../index.css';

const HomePage = () => {
  return (
    <div className='page'>
      <img alt='welcome' src={welcome_img} className='welcome__img'></img>
      <Header />
      <div className='welcome__container'> 
        <Welcome></Welcome>
        <Slider></Slider>
      </div>
      <Main_start></Main_start>
      <Footer />
    </div>
  );
};

export default HomePage;
