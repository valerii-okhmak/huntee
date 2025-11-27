import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styless/app.css';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import RegPage from './pages/RegPage';
import TestPage from './pages/TestPage';
import AllTestsPage from './pages/AllTestsPage';
import ProfilePage from './pages/ProfilePage'
import StartTestPage from './pages/StartTestPage';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import MessagePage from './pages/MessagePage';
import MessageTextPage from './pages/MessageTextPage';
import { GoogleOAuthProvider } from "@react-oauth/google";
import TestRulesPage from './pages/TestRulesPage';
import FullTest from './components/FullTest/FullTest';
import MyTestsPage from './pages/MyTestsPage';
import Contacts from './pages/Contacts';
import StartIT from './pages/StartIT';
import GeneralInfoPage from './pages/GeneralInfoPage';
import PricingPage from './pages/PricingPage';
import CompanyMainPage from './pages/CompanyMainPage';
import TestCreationPage from './pages/TestCreationPage';
import TestCreationStartPage from './pages/TestCreationStartPage';
import TestCreationMainPage from './pages/TestCreationMainPage';
import ForCompany from './components/ForCompany/ForCompany';
import Subscriptions from './components/subscriptionsComp/subscriptionsComp';
import tryTestLogo from "./img/softserve.png";
import tryTestQuestions from "./data/questions.json";
import TemplatesHunteePage from './pages/TemplatesHunteePage';
import ScrollToTop from './components/ScrollToTop'; 
import ViewingTestsPage from './pages/ViewingTestsPage';
import NotFoundPage from './pages/NotFoundPage';


const App = () => {

  const tryTest = {
    logo: tryTestLogo,
    category: "Data Science",
    title: "JUNIOR DATA SCIENTIST",
    location: "Lviv",
  }

  return (
    <Router>
    <ScrollToTop /> 
    <GoogleOAuthProvider clientId="1081513846462-lhcffrki4nfgq2imdr4qdkfg9dgrmhh1.apps.googleusercontent.com">
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/reg" element={<RegPage />} />
        <Route path="/testpage/:testId" element={<TestPage />} />
        <Route path="/alltests" element={<AllTestsPage />} />
        <Route path='/starttest' element={<StartTestPage />} />
        <Route path="/testrules" element={<TestRulesPage />} />
        <Route path="/test" element={<FullTest testType="trial" textData={tryTest} time={3600} questionsLink={tryTestQuestions} />} />
        <Route path="/mytests" element={<MyTestsPage/>} />
        <Route path="/contacts" element={<Contacts/>} />
        <Route path="/startIT" element={<StartIT/>} />
        <Route path="/generalinfo" element={<GeneralInfoPage/>} />
        <Route path="/profile/:user_id" element={<ProfilePage />} />
        <Route path="/pricingpage" element={<PricingPage />} />
        <Route path="/forcompany" element={<ForCompany />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/test/softskills" element={<FullTest testType="softskills" textData={null} time={0} questionsLink={tryTestQuestions} />} />
        <Route path="/companymain" element={<CompanyMainPage />} />
        <Route path="/testcreation" element={<TestCreationPage />} />
        <Route path="/templateshuntee" element={<TemplatesHunteePage />} />
        <Route path="/testcreation/start" element={<TestCreationStartPage />} />
        <Route path="/testcreation/main" element={<TestCreationMainPage />} />
        <Route path="/viewingtests" element={<ViewingTestsPage />} />
        <Route path="/*" element={<NotFoundPage />} />

        {/* Protected routes*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagePage />} />
          <Route path="/message" element={<MessageTextPage />} />
        </Route>
      </Routes>
      <Footer />
    </div>
    </GoogleOAuthProvider>
    </Router>
  );
};

export default App;
