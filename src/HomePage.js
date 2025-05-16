import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './homepage.css'; // Import your CSS file for styling

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    const [displayText, setDisplayText] = useState('');
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    // Scroll to top when route changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const fullText = "Avoid traffic jams with AI-powered real-time traffic predictions.";
    
    // Typing effect
    useEffect(() => {
        let currentIndex = 0;
        let typingInterval;
        
        // Start typing animation
        const startTypingAnimation = () => {
            typingInterval = setInterval(() => {
                if (currentIndex <= fullText.length) {
                    setDisplayText(fullText.substring(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    setIsTypingComplete(true);
                }
            }, 50); // Controls typing speed
        };
        
        // Delay typing to let the page load first
        setTimeout(() => {
            startTypingAnimation();
        }, 500);
        
        // Cleanup
        return () => {
            clearInterval(typingInterval);
        };
    }, []);
    
    // 3D Bubble animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let bubbles = [];
        
        // Set canvas size
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initBubbles();
        };
        
        // Initialize bubbles
        const initBubbles = () => {
            bubbles = [];
            const numberOfBubbles = Math.min(50, Math.floor(canvas.width * canvas.height / 10000));
            
            for (let i = 0; i < numberOfBubbles; i++) {
                const radius = Math.random() * 50 + 10;
                bubbles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: radius,
                    originalRadius: radius,
                    color: getRandomColor(),
                    speed: Math.random() * 1 + 0.1,
                    opacity: Math.random() * 0.6 + 0.1,
                    direction: Math.random() * Math.PI * 2,
                    pulsate: Math.random() * 0.02 + 0.01,
                    growth: 0
                });
            }
        };
        
        // Get random color (blue hues for traffic theme)
        const getRandomColor = () => {
            const hue = Math.floor(Math.random() * 60) + 180; // Blue to purple hues
            const saturation = Math.floor(Math.random() * 40) + 60;
            const lightness = Math.floor(Math.random() * 30) + 55;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        };
        
        // Draw background
        const drawBackground = () => {
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0d1936');
            gradient.addColorStop(1, '#1a2b57');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        
        // Draw 3D bubbles effect
        const drawBubbles = () => {
            const time = Date.now() * 0.001;
            
            bubbles.forEach(bubble => {
                // Update position with slight drift effect
                bubble.x += Math.cos(bubble.direction) * bubble.speed;
                bubble.y += Math.sin(bubble.direction) * bubble.speed;
                
                // Random direction changes
                if (Math.random() < 0.01) {
                    bubble.direction += (Math.random() - 0.5) * 0.3;
                }
                
                // Pulsating effect
                bubble.growth += bubble.pulsate;
                if (Math.abs(bubble.growth) > 0.5) {
                    bubble.pulsate *= -1;
                }
                bubble.radius = bubble.originalRadius * (1 + bubble.growth);
                
                // Wrap around edges
                if (bubble.x < -bubble.radius) bubble.x = canvas.width + bubble.radius;
                if (bubble.x > canvas.width + bubble.radius) bubble.x = -bubble.radius;
                if (bubble.y < -bubble.radius) bubble.y = canvas.height + bubble.radius;
                if (bubble.y > canvas.height + bubble.radius) bubble.y = -bubble.radius;
                
                // Create 3D bubble effect
                
                // Main bubble
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.fillStyle = bubble.color;
                ctx.globalAlpha = bubble.opacity;
                ctx.fill();
                
                // Highlight/reflection
                const gradientSize = bubble.radius * 0.8;
                const highlightGradient = ctx.createRadialGradient(
                    bubble.x - bubble.radius * 0.3, 
                    bubble.y - bubble.radius * 0.3, 
                    0, 
                    bubble.x - bubble.radius * 0.3, 
                    bubble.y - bubble.radius * 0.3, 
                    gradientSize
                );
                
                highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${bubble.opacity * 1.5})`);
                highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.fillStyle = highlightGradient;
                ctx.fill();
                
                // Shadow effect for 3D
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(0, 0, 20, ${bubble.opacity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            });
            
            ctx.globalAlpha = 1;
        };
        
        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBackground();
            drawBubbles();
            animationRef.current = requestAnimationFrame(animate);
        };
        
        // Initialize
        handleResize();
        animate();
        setTimeout(() => setIsLoaded(true), 300);
        
        // Event listeners
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    // Add blinking cursor effect
    const cursorStyle = {
        display: isTypingComplete ? 'none' : 'inline-block',
        marginLeft: '2px',
        width: '2px',
        height: '1.2em',
        backgroundColor: 'currentColor',
        verticalAlign: 'text-bottom',
        animation: 'blink 1s step-end infinite'
    };
    
    const handleGetStarted = () => {
        navigate('/predict-traffic');
    };

    // Add a new handler for historical data navigation
    const handleHistoricalData = () => {
        navigate('/historical-data');
    };

    return (
        <div className="home-container">
            <div className="hero-section">
                {/* Canvas background */}
                <canvas 
                    ref={canvasRef} 
                    className="web-background"
                />
                
                {/* Background Elements */}
                <div className="background-elements">
                    <div className="gradient-overlay"></div>
                    <div className="dot-pattern"></div>
                    <div className="floating-circle circle-1"></div>
                    <div className="floating-circle circle-2"></div>
                </div>
                
                {/* Hero Content */}
                <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
                    <h1 className="hero-title">
                        <span className="text-reveal">Welcome to the</span>
                        <span className="title-highlight">Chennai Traffic Predictor</span>
                    </h1>
                    <p className="hero-description">
                        {displayText}
                        <span style={cursorStyle}></span>
                    </p>
                    <div className="hero-buttons">
                        <button className="primary-button" onClick={handleGetStarted}>Predict Traffic</button>
                        <button className="secondary-button" onClick={handleHistoricalData}>Historical Data</button>
                    </div>
                </div>
            </div>
            
            {/* Information Container with matching theme */}
            <div className="section-container info-container">
                <div className="info-content">
                    <h2>About Our Service</h2>
                    <div className="info-text">
                        <p>Our AI-powered traffic prediction system helps Chennai residents plan their daily commute with confidence. Using advanced machine learning algorithms and real-time data analysis, we provide accurate forecasts of traffic conditions across the city.</p>
                        <p>Whether you're planning your morning drive to work, scheduling an important meeting, or just trying to avoid congestion on your way home, our service gives you the information you need to make smart travel decisions.</p>
                    </div>
                    <div className="info-stats">
                        <div className="stat-item">
                            <span className="stat-number">95%</span>
                            <span className="stat-label">Prediction Accuracy</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Monitored Locations</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Daily Users</span>
                        </div>
                    </div>
                </div>
            </div>
            
{/* Features Section with matching theme */}
<div className="section-container features-section">
    <h2>Our Features</h2>
    <div className="features-grid">
        <div className={`feature-card ${isLoaded ? 'loaded' : ''}`}>
            <div className="feature-icon">🚦</div>
            <h3>Real-time Predictions</h3>
            <p>Get accurate traffic predictions based on current conditions</p>
        </div>
        <div className={`feature-card ${isLoaded ? 'loaded' : ''}`}>
            <div className="feature-icon">📊</div>
            <h3>Traffic Analysis</h3>
            <p>Advanced algorithms to analyze traffic patterns in Chennai</p>
        </div>
        <div className={`feature-card ${isLoaded ? 'loaded' : ''}`}>
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Access traffic predictions on any device, anywhere in the city</p>
        </div>
    </div>
</div>
            {/* Why Choose Us Section with matching theme */}
            <div className="section-container why-us-section">
                <h2>Why Choose Us</h2>
                <div className="why-us-grid">
                    <div className="why-us-card">
                        <div className="why-us-icon">🎯</div>
                        <h3>Accurate Predictions</h3>
                        <p>Our AI model provides highly accurate traffic predictions with 
                           continuous learning and improvement.</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon">⚡</div>
                        <h3>Instant Results</h3>
                        <p>Get immediate traffic predictions for your selected location and time
                           within seconds.</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon">🗺️</div>
                        <h3>Complete Coverage</h3>
                        <p>Coverage for all major roads, intersections and neighborhoods across Chennai.</p>
                    </div>
                    <div className="why-us-card">
                        <div className="why-us-icon">🔄</div>
                        <h3>Regular Updates</h3>
                        <p>Continuous updates to our traffic database and AI model for 
                           improved accuracy.</p>
                    </div>
                </div>
            </div>
            
            {/* Animation keyframes */}
            <style>
                {`
                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0; }
                    }
                    
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-20px); }
                    }
                    
                    @keyframes float2 {
                        0%, 100% { transform: translateY(0) translateX(0); }
                        50% { transform: translateY(-15px) translateX(15px); }
                    }
                `}
            </style>
        </div>
    );
};

export default Home;