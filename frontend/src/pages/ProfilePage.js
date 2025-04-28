import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Profile from '../components/profile/Profile';
import '../index.css';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <Header />
      <Profile/>
      <Footer />
    </div>
  );
};

export default ProfilePage;