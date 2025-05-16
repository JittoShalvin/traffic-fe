import React from 'react';
import './css/footer.css'; // Assuming you have a CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-logo-section">
            <div className="footer-logo">
              <h3>Project<span className="logo-highlight">.</span></h3>
              <p className="footer-tagline">Transforming ideas into reality</p>
            </div>
            
            <div className="footer-links-column">
              <h4>Connect</h4>
              <ul>
                <li><a href="https://traffic-livid.vercel.app/">Twitter</a></li>
                <li><a href="https://www.linkedin.com/in/jitto-shalvin">LinkedIn</a></li>
                <li><a href="https://github.com/JittoShalvin">GitHub</a></li>
                <li><a href="https://www.instagram.com/jittoshalvin/">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15800.591342781148!2d77.54587045000001!3d8.086402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b04ed3d2a087861%3A0x1e790e896aeffaa0!2sKanniyakumari%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1747419791347!5m2!1sen!2sin" 
              height="300" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
              className="footer-map"
            />
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© 2025 jittoshalvin. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
