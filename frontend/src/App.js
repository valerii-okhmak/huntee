import React from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import './styless/app.css';
import Welcome from './components/welcome/Welcome';
import welcome_img from './img/image.png'

const App = () => {
  return (
    <div className='page'>
      <img alt='welcome' src={welcome_img} className='welcome__img'></img>
      <Header />
      <main> 
        <Welcome></Welcome>
      </main>
      <Footer />
    </div>
  );
};

export default App;
