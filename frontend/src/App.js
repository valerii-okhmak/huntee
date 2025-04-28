import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styless/app.css';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import RegPage from './pages/RegPage';
import TestPage from './pages/TestPage';
import AllTestsPage from './pages/AllTestsPage';

const App = () => {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reg" element={<RegPage />} />
        <Route path="/testpage" element={<TestPage />} />
        <Route path="/alltests" element={<AllTestsPage />} />
      </Routes>
    </div>
    </Router>
  );
};

export default App;
