import React, { useState, useRef, useEffect } from 'react';
import Plant1 from '../assets/images/1-1.png';
import Plant2 from '../assets/images/1-2.png';
import Plant3 from '../assets/images/1-3.png';
import Plant4 from '../assets/images/1-4.png';
import Plant5 from '../assets/images/1-5.png';
const GreenCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const carouselRef = useRef(null);

  const plantImages = [
    {
      id: 1,
      src: Plant1,
      alt: 'Green Plant 1',
      title: 'GreenPlant',
      subtitle: 'PLANT CARE TIPS',
    },
    {
      id: 2,
      src: Plant2,
      alt: 'Green Plant 2',
      title: 'GreenPlant',
      subtitle: 'PLANT CARE TIPS',
    },
    {
      id: 3,
      src: Plant3,
      alt: 'Green Plant 3',
      title: 'GreenPlant',
      subtitle: 'PLANT CARE TIPS',
    },
    {
      id: 4,
      src: Plant4,
      alt: 'Green Plant 4',
      title: 'GreenPlant',
      subtitle: 'PLANT CARE TIPS',
    },
    {
      id: 5,
      src: Plant5,
      alt: 'Green Plant 5',
      title: 'GreenPlant',
      subtitle: 'PLANT CARE TIPS',
    },
  ];
  const extendedImages = [...plantImages, ...plantImages, ...plantImages];
  const itemWidth = 220;
  const totalWidth = plantImages.length * itemWidth;


  useEffect(() => {
    setCurrentTranslate(-totalWidth);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.pageX;
    const diff = currentX - startX;
    setTranslateX(currentTranslate + diff);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].pageX;
    const diff = currentX - startX;
    setTranslateX(currentTranslate + diff);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setCurrentTranslate(translateX);
    if (translateX > 0) {
      const newTranslate = translateX - totalWidth;
      setTranslateX(newTranslate);
      setCurrentTranslate(newTranslate);
    } else if (translateX < -totalWidth * 2) {
      const newTranslate = translateX + totalWidth;
      setTranslateX(newTranslate);
      setCurrentTranslate(newTranslate);
    }
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  useEffect(() => {
    const handleMouseLeave = () => {
      if (isDragging) {
        handleDragEnd();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, translateX, currentTranslate]);

  return (
    <div className="green-carousel-container">
      <div
        className="green-carousel"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {extendedImages.map((plant, index) => (
          <div
            key={`${plant.id}-${Math.floor(index / plantImages.length)}`}
            className="green-carousel-item"
          >
            <div className="plant-card">
              <img
                src={plant.src}
                alt={plant.alt}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GreenCarousel;
