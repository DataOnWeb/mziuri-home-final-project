import React, { useState, useEffect } from 'react';


const PlantCarousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  
 
  useEffect(() => {

    const initTimer = setTimeout(() => {
      setHasInitialized(true);
    }, 100);
    
    return () => clearTimeout(initTimer);
  }, []);
  
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 600);
  };
  
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 600);
  };
  

  useEffect(() => {

    if (!hasInitialized) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide, isAnimating, hasInitialized]);
  
  return (
    <div className={`carousel-container ${hasInitialized ? 'initialized' : ''}`}>
      <div className="carousel">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`carousel-slide ${currentSlide === index ? 'active' : ''}`}
          >
            <div className="carousel-content">
              <div className="carousel-text">
                <h2 className="carousel-discount">{slide.discount}</h2>
                <h1 className="carousel-title">{slide.title}</h1>
                <p className="carousel-description">{slide.description}</p>
                <button className="carousel-button">{slide.buttonText}</button>
              </div>
              <div className="carousel-image">
                <img 
                  src={slide.imageUrl} 
                  alt={slide.imageAlt}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="carousel-arrow prev" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="carousel-arrow next" onClick={nextSlide}>
        &#10095;
      </button>
      
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentSlide(index);
                setTimeout(() => setIsAnimating(false), 600);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PlantCarousel;