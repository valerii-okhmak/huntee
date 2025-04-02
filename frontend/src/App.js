import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styless/app.css';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';

const App = () => {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </div>
    </Router>
  );
};

export default App;
