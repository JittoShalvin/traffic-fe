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
                <li><a href="#">Twitter</a></li>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">GitHub</a></li>
                <li><a href="#">Instagram</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29550.900761537232!2d80.18698691132968!3d13.089941333111025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5264078822719b%3A0xbda01077b89581e2!2sAnna%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e1!3m2!1sen!2sin!4v1743923494720!5m2!1sen!2sin" 
              width="100%" 
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
          <p className="copyright">© 2025 Project. All rights reserved.</p>
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