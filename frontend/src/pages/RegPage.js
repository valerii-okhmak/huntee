import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import RegForm from '../components/reg/RegForm';

const RegPage = () => {
  return (
    <div className="page">
      <Header />
      <RegForm />
      <Footer />
    </div>
  );
};

export default RegPage;