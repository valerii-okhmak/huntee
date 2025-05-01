import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import TopTrial from '../components/trialTest/top/top';
import TrialMain from '../components/trialTest/main/main';

const TestPage = () => {
  return (
    <div className="page">
    <Header />
        <TopTrial />
        <div className="trialMain">
            <TrialMain />
        </div>
    <Footer />
    </div>
  );
};

export default TestPage;