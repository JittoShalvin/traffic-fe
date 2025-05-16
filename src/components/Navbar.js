import React from 'react';
import { Link } from 'react-router-dom';
import './css/navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <div className="navbar-container">
      {/* Background Element */}
      <div className="navbar-background"></div>
      
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-logo">
            <span className="navbar-icon">🔮</span>
            <span className="navbar-title">AI Predictor</span>
          </h1>
          <ul className="navbar-links">
            <li>
              <Link to="/" className="navbar-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/prediction" className="navbar-link">
                Prediction
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;