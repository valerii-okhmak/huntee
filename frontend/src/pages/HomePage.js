import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Welcome from '../components/welcome/Welcome';
import Slider from '../components/slider/Slider';
import welcome_img from '../img/image.png'
import '../index.css';

const HomePage = () => {
  return (
    <div className='page'>
      <img alt='welcome' src={welcome_img} className='welcome__img'></img>
      <Header />
      <main> 
        <Welcome></Welcome>
        <Slider></Slider>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
