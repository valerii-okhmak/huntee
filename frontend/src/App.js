import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styless/app.css';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import RegPage from './pages/RegPage';
import TestPage from './pages/TestPage';
import AllTestsPage from './pages/AllTestsPage';
import ProfilePage from './pages/ProfilePage'
import TrialTest from './pages/TrialTestPage';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import MessagePage from './pages/MessagePage';

const App = () => {
  return (
    <Router>
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/reg" element={<RegPage />} />
        <Route path="/testpage" element={<TestPage />} />
        <Route path="/alltests" element={<AllTestsPage />} />
        <Route path='/trialtest' element={<TrialTest />} />
        <Route path="/messages" element={<MessagePage />} />

        {/* Protected routes*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
      <Footer />
    </div>
    </Router>
  );
};

export default App;
