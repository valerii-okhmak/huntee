import React from 'react';

import Welcome from '../components/welcome/Welcome';
import Slider from '../components/slider/Slider';
import Main_start from '../components/main_start/main_start';
import TrialTesting from '../components/trial_testing/TrialTesting';
import '../index.css';
import ChooseYourFuture from '../components/chs_your_future/ChooseYourFuture';
import JoinToUs from '../components/join_to_us/JoinToUs';
import Find_yourself from '../components/find_yourself/FindYourself';
import VerticalStepper from '../components/VerticalStepper/VerticalStepper';
import SoftSkills from '../components/soft_skills_trial/SoftSkillsTrial';
import ForCompany from '../components/ForCompany/ForCompany';
import Subscriptions from '../components/subscriptionsComp/subscriptionsComp';
import CompanyBanner from '../components/company_banner/CompanyBanner';



const HomePage = () => {
  return (
    <div className='page'>
      <VerticalStepper />
      <div id="section-01" className='welcome__container'> 
        <Welcome/>
        <Slider/>
      </div>
      <CompanyBanner />
      <div id="section-02"><Find_yourself/></div>
      <div id="section-03"><Main_start/></div>
      <div id="section-04"><SoftSkills/></div>
      <div id="section-05"><TrialTesting/></div>
      <div id="section-06"><ChooseYourFuture/></div>
      <div id="section-07"><ForCompany/></div>
      <div id="section-08"><Subscriptions/></div>
      <div id="section-09"><JoinToUs/></div>
    </div>
  );
};

export default HomePage;
