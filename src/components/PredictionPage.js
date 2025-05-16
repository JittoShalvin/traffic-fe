import React, { useState, useEffect, useRef } from 'react';
import './css/prediction.css'; // Make sure to include the CSS file

const PredictionPage = () => {
  const [location, setLocation] = useState('');
  const [hour, setHour] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);
  const suggestionsListRef = useRef(null);
  
  // API endpoints
  const API_BASE_URL = 'https://traffic-be.onrender.com';
  const PREDICT_URL = `${API_BASE_URL}/predict`;
  const LOCATIONS_URL = `${API_BASE_URL}/locations`;

  // Fetch available locations when component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        const response = await fetch(LOCATIONS_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        const locationsList = data.locations || [
          'T Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 
          'Guindy', 'Nungambakkam', 'Mylapore', 'Porur',
          'Chromepet', 'Tambaram', 'Pallavaram', 'Egmore',
          'Besant Nagar', 'Royapettah', 'Saidapet', 'Kodambakkam'
        ];
        setLocations(locationsList);
      } catch (err) {
        console.error("Error fetching locations:", err);
        // Fallback locations
        setLocations([
          'T Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 
          'Guindy', 'Nungambakkam', 'Mylapore', 'Porur',
          'Chromepet', 'Tambaram', 'Pallavaram', 'Egmore',
          'Besant Nagar', 'Royapettah', 'Saidapet', 'Kodambakkam'
        ]);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
    
    // Add a class to body for background animation
    document.body.classList.add('animated-bg');
    
    return () => {
      document.body.classList.remove('animated-bg');
    };
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard navigation for dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev < filteredLocations.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : 0
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedSuggestionIndex >= 0) {
            handleSelectLocation(filteredLocations[selectedSuggestionIndex]);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          break;
        default:
          break;
      }
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [showSuggestions, selectedSuggestionIndex, filteredLocations]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && suggestionsListRef.current) {
      const selectedItem = suggestionsListRef.current.children[selectedSuggestionIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedSuggestionIndex]);

  // Filter locations based on search input
  const handleLocationSearch = (e) => {
    const value = e.target.value;
    setLocation(value);
    setSelectedSuggestionIndex(-1);
    
    if (value.trim() === '') {
      setFilteredLocations([]);
      setShowSuggestions(false);
      return;
    }
    
    const filtered = locations.filter(loc => 
      loc.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredLocations(filtered);
    setShowSuggestions(true);
  };

  const handleSelectLocation = (loc) => {
    setLocation(loc);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validation
    if (!hour || hour < 1 || hour > 24) {
      setError("Please enter a valid hour between 1 and 24.");
      setLoading(false);
      return;
    }
    
    // Check if location exists in dataset
    if (!locations.some(loc => loc.toLowerCase() === location.toLowerCase())) {
      setError("Location not found in dataset. Please select from suggestions.");
      setLoading(false);
      return;
    }
    
    try {
      // Animate loading state if the element exists
      const predictionCard = document.querySelector('.prediction-card');
      if (predictionCard) {
        predictionCard.classList.add('loading-animation');
      }
      
      // Make the actual API call to your backend
      const response = await fetch(PREDICT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: location,
          hour: parseInt(hour)
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get prediction');
      }
      
      setPrediction(data);
      
      // Remove animation class
      if (predictionCard) {
        predictionCard.classList.remove('loading-animation');
      }
      
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || 'Error connecting to prediction service');
      
      // If backend is unavailable, use mock data for demo purposes
      if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        console.log("Using mock data as fallback");
        setTimeout(() => {
          const mockPrediction = getMockPrediction(location, hour);
          setPrediction(mockPrediction);
        }, 1000);
      }
      
      const predictionCard = document.querySelector('.prediction-card');
      if (predictionCard) {
        predictionCard.classList.remove('loading-animation');
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock prediction function for demo purposes when backend is unavailable
  const getMockPrediction = (location, hour) => {
    const hour_num = parseInt(hour);
    
    // Rush hours: 8-10 AM and 5-8 PM
    const isRushHour = (hour_num >= 8 && hour_num <= 10) || (hour_num >= 17 && hour_num <= 20);
    
    // Late night: 11 PM to 5 AM
    const isLateNight = hour_num >= 23 || hour_num <= 5;
    
    let trafficLevel;
    let percentage;
    let vehicleCount;
    
    if (isRushHour) {
      trafficLevel = "High";
      percentage = Math.floor(85 + Math.random() * 15);
      vehicleCount = Math.floor(8000 + Math.random() * 4000);
    } else if (isLateNight) {
      trafficLevel = "Low";
      percentage = Math.floor(10 + Math.random() * 30);
      vehicleCount = Math.floor(500 + Math.random() * 1500);
    } else {
      trafficLevel = "Medium";
      percentage = Math.floor(40 + Math.random() * 30);
      vehicleCount = Math.floor(3000 + Math.random() * 3000);
    }
    
    return {
      location: location,
      hour: hour,
      predicted_traffic_level: trafficLevel,
      predicted_traffic_percentage: percentage,
      predicted_vehicle_count: vehicleCount
    };
  };

  const getTrafficLevelClass = (level) => {
    switch(level?.toLowerCase()) {
      case 'high': return 'traffic-high';
      case 'medium': return 'traffic-medium';
      case 'low': return 'traffic-low';
      default: return '';
    }
  };

  const getTrafficLevelBgClass = (level) => {
    switch(level?.toLowerCase()) {
      case 'high': return 'traffic-bg-high';
      case 'medium': return 'traffic-bg-medium';
      case 'low': return 'traffic-bg-low';
      default: return '';
    }
  };

  // Render enhanced 3D traffic animation based on prediction
  const renderTrafficAnimation = () => {
    if (!prediction) return null;
    
    // Determine number of cars based on traffic level
    let carCount = 3; // Default
    switch(prediction.predicted_traffic_level?.toLowerCase()) {
      case 'high': carCount = 12; break;
      case 'medium': carCount = 7; break;
      case 'low': carCount = 3; break;
      default: carCount = 3;
    }
    
    return (
      <div className="traffic-animation">
        <div className="city-skyline"></div>
        <div className="road">
          <div className="road-lines">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`line-${i}`} className="line"></div>
            ))}
          </div>
        </div>
        
        {/* Traffic lights */}
        <div className="traffic-light">
          <div className={`light red ${prediction.predicted_traffic_level.toLowerCase() === 'high' ? 'active' : ''}`}></div>
          <div className={`light yellow ${prediction.predicted_traffic_level.toLowerCase() === 'medium' ? 'active' : ''}`}></div>
          <div className={`light green ${prediction.predicted_traffic_level.toLowerCase() === 'low' ? 'active' : ''}`}></div>
        </div>
        
        {/* Generate cars with staggered animation */}
        {Array.from({ length: carCount }).map((_, index) => {
          const carType = (index % 4) + 1; // 4 different car types
          const lanePosition = index % 3; // 3 lanes
          const delay = (index * 0.2) % 2; // Staggered delay
          
          return (
            <div 
              key={index}
              className={`car car${carType}`}
              style={{ 
                left: `${5 + (index * 8) % 80}%`,
                bottom: `${10 + lanePosition * 8}px`,
                animationDelay: `${delay}s`,
                animationDuration: `${3 + Math.random()}s`
              }}
            >
              <div className="car-shadow"></div>
            </div>
          );
        })}
        
        {/* Add traffic density indicator */}
        <div className="traffic-density">
          <div className="density-label">Traffic Density</div>
          <div className="density-meter">
            <div 
              className={`density-fill ${getTrafficLevelClass(prediction.predicted_traffic_level)}`}
              style={{ width: `${prediction.predicted_traffic_percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="traffic-container">
      {/* Floating particles for background effect */}
      <div className="floating-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>
      
      <h1 className="page-title">Chennai Traffic Predictor</h1>
      <p className="page-subtitle">Get real-time traffic predictions for locations across Chennai</p>
      
      <div className="prediction-card">
        <div className="card-glow"></div>
        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-group" ref={suggestionRef}>
            <label className="form-label">Location</label>
            {loadingLocations ? (
              <div className="loading-locations">
                <div className="loading-pulse"></div>
                <span>Loading locations...</span>
              </div>
            ) : (
              <>
                <div className="input-container">
                  <input
                    ref={inputRef}
                    type="text"
                    value={location}
                    onChange={handleLocationSearch}
                    onFocus={() => location && setShowSuggestions(true)}
                    placeholder="Search for a location..."
                    className="form-input"
                    required
                  />
                  <div className="input-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                </div>
                
                {showSuggestions && (
                  <div className="suggestion-container" ref={suggestionsListRef}>
                    {filteredLocations.length > 0 ? (
                      filteredLocations.map((loc, index) => (
                        <div 
                          key={loc} 
                          className={`suggestion-item ${selectedSuggestionIndex === index ? 'selected' : ''}`}
                          onClick={() => handleSelectLocation(loc)}
                        >
                          <span className="suggestion-text">{loc}</span>
                          <span className="suggestion-icon">→</span>
                        </div>
                      ))
                    ) : (
                      <div className="suggestion-item no-results">
                        No locations found matching "{location}"
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Hour (1-24)</label>
            <div className="input-container">
              <input 
                type="number" 
                min="1" 
                max="24"
                value={hour} 
                onChange={(e) => setHour(e.target.value)}
                className="form-input"
                required
              />
              <div className="input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>
            <p className="input-help">Enter hour in 24-hour format (e.g., 14 for 2 PM)</p>
          </div>
          
          <button 
            type="submit" 
            className="prediction-button"
            disabled={loading || loadingLocations}
          >
            {loading ? (
              <>
                <span className="button-text">Predicting</span>
                <div className="loading-dots">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </>
            ) : (
              <>
                <span className="button-text">Predict Traffic</span>
                <span className="button-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </>
            )}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="error-container">
          <div className="error-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="error-content">
            <p className="error-title">Error</p>
            <p className="error-message">{error}</p>
          </div>
        </div>
      )}
      
      {prediction && (
        <div className="results-card">
          <h2 className="results-title">Traffic Prediction Results</h2>
          
          {/* Enhanced 3D Traffic Animation */}
          {renderTrafficAnimation()}
          
          <div className="results-grid">
            <div className="result-item">
              <div className="result-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="result-content">
                <p className="result-label">Location</p>
                <p className="result-value">{prediction.location}</p>
              </div>
            </div>
            
            <div className="result-item">
              <div className="result-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="result-content">
                <p className="result-label">Time</p>
                <p className="result-value">{prediction.hour}:00 {parseInt(prediction.hour) >= 12 ? 'PM' : 'AM'}</p>
              </div>
            </div>
            
            <div className={`result-item ${getTrafficLevelBgClass(prediction.predicted_traffic_level)}`}>
              <div className="result-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                  <line x1="4" y1="22" x2="4" y2="15"></line>
                </svg>
              </div>
              <div className="result-content">
                <p className="result-label">Traffic Level</p>
                <p className={`result-value ${getTrafficLevelClass(prediction.predicted_traffic_level)}`}>
                  {prediction.predicted_traffic_level}
                </p>
              </div>
            </div>
            
            <div className="result-item">
              <div className="result-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <div className="result-content">
                <p className="result-label">Traffic Percentage</p>
                <p className="result-value">
                  <div className="percentage-bar">
                    <div 
                      className={`percentage-fill ${getTrafficLevelClass(prediction.predicted_traffic_level)}`}
                      style={{ width: `${prediction.predicted_traffic_percentage}%` }}
                    ></div>
                    <span className="percentage-text">{prediction.predicted_traffic_percentage}%</span>
                  </div>
                </p>
              </div>
            </div>
            
            <div className="result-item">
              <div className="result-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div className="result-content">
                <p className="result-label">Vehicle Count</p>
                <p className="result-value">{prediction.predicted_vehicle_count.toLocaleString()}</p>
              </div>
            </div>
            
            {/* Show time slot if provided by the API */}
            {prediction.time_slot && (
              <div className="result-item">
                <div className="result-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <div className="result-content">
                  <p className="result-label">Time Slot</p>
                  <p className="result-value">{prediction.hour}:00 </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="traffic-summary">
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="summary-content">
              <p className="summary-title">Traffic Summary</p>
              <p className="summary-text">
                The traffic in <span className="summary-highlight">{prediction.location}</span> at <span className="summary-highlight">{prediction.hour}:00 {parseInt(prediction.hour) >= 12 ? 'PM' : 'AM'}</span> is predicted to be{' '}
                <span className={`traffic-level ${getTrafficLevelClass(prediction.predicted_traffic_level)}`}>
                  {prediction.predicted_traffic_level.toLowerCase()}
                </span>{' '}
                with approximately <span className="summary-highlight">{prediction.predicted_traffic_percentage}%</span> congestion and{' '}
                <span className="summary-highlight">{prediction.predicted_vehicle_count.toLocaleString()}</span> vehicles in the area.
              </p>
              
              {/* Traffic advice based on level */}
              <div className="traffic-advice">
                <p className="advice-title">Travel Advice:</p>
                <p className="advice-text">
                  {prediction.predicted_traffic_level.toLowerCase() === 'high' ? (
                    "Consider alternative routes or delay travel if possible. Expect significant delays."
                  ) : prediction.predicted_traffic_level.toLowerCase() === 'medium' ? (
                    "Plan for moderate congestion and allow extra travel time."
                  ) : (
                    "Roads are relatively clear. Good time for travel with minimal delays expected."
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="weather-section">
            <div className="weather-icon">
              {prediction.hour >= 6 && prediction.hour <= 18 ? (
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </div>
            <div className="weather-text">
              Weather conditions can affect traffic. Check the weather forecast before your journey.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
