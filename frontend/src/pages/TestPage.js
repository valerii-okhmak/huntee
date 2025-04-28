import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import TestMainPage from '../components/testPage/TestMainPage';

const TestPage = () => {
  return (
    <div className="page">
      <Header />
      <TestMainPage/>
      <Footer />
    </div>
  );
};

export default TestPage;