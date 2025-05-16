import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './HomePage';
import PredictionPage from './components/PredictionPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/prediction" element={<PredictionPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;