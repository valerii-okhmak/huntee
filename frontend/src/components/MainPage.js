import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const MainPage = () => {
  return (
    <div>
      <Header />
      <Navbar />
      <main>
        <h2>Start your tests and track your performance!</h2>
        <p>Welcome to the platform where you can improve your skills through challenging IT tests.</p>
      </main>
    </div>
  );
};

export default MainPage;
