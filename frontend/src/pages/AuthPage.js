import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import AuthForm from '../components/auth/AuthForm';

const AuthPage = () => {
  return (
    <div className="page">
      <Header />
      <AuthForm />
      <Footer />
    </div>
  );
};

export default AuthPage;
