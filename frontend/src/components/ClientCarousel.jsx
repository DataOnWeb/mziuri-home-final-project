import React, { useState, useRef, useEffect } from 'react';
import Client1 from '../assets/images/home-1.webp';
import Client2 from '../assets/images/home-2.webp';
import Client3 from '../assets/images/home-3.webp';
import { useTranslation } from 'react-i18next';
const ClientCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  const { t } = useTranslation();
  const testimonials = [
    {
      id: 1,
      name: t('clientCarousel.author'),
      role: t('clientCarousel.client'),
      image: Client1,
      text: t('clientCarousel.text'),
    },
    {
      id: 2,
      name: t('clientCarousel.author'),
      role: t('clientCarousel.client'),
      image: Client2,
      text: t('clientCarousel.text'),
    },
    {
      id: 3,
      name: t('clientCarousel.author'),
      role: t('clientCarousel.client'),
      image: Client3,
      text: t('clientCarousel.text'),
    },
    {
      id: 4,
      name: t('clientCarousel.author'),
      role: t('clientCarousel.client'),
      image: Client1,
      text: t('clientCarousel.text'),
    },
    {
      id: 5,
      name: t('clientCarousel.author'),
      role: 'Client',
      image: Client2,
      text: t('clientCarousel.text'),
    },
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(carouselRef.current.scrollLeft);
    carouselRef.current.style.scrollBehavior = 'auto';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = startX - x;
    carouselRef.current.scrollLeft = scrollLeft + walk;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    carouselRef.current.style.scrollBehavior = 'smooth';
    snapToClosest();
  };

  const handleMouseLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    carouselRef.current.style.scrollBehavior = 'smooth';
    snapToClosest();
  };

  const snapToClosest = () => {
    const carousel = carouselRef.current;
    const itemWidth = carousel.offsetWidth / 3;
    const newIndex = Math.round(carousel.scrollLeft / itemWidth);
    setCurrentIndex(Math.max(0, Math.min(newIndex, testimonials.length - 3)));

    carousel.scrollTo({
      left: newIndex * itemWidth,
      behavior: 'smooth',
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    const itemWidth = carouselRef.current.offsetWidth / 3;
    carouselRef.current.style.scrollBehavior = 'smooth';
    carouselRef.current.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className="client-carousel">
      {/* Decorative Leaves Background */}
      <div className="leaves-background"></div>

      {/* Header */}
      <div className="client-carousel__header">
        <h2 className="client-carousel__title">{t('clientCarousel.title')}</h2>
        <p className="client-carousel__subtitle">{t('clientCarousel.subtitle')}</p>
      </div>

      {/* Carousel Container */}
      <div className="client-carousel__container">
        <div
          ref={carouselRef}
          className={`client-carousel__track ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="client-carousel__item"
            >
              <div className="testimonial-card">
                {/* Quote Mark */}
                <div className="testimonial-card__quote">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                  </svg>
                </div>

                {/* Profile Section */}
                <div className="testimonial-card__profile">
                  <div className="testimonial-card__avatar">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                  </div>
                  <div className="testimonial-card__info">
                    <h3 className="testimonial-card__name">{testimonial.name}</h3>
                    <p className="testimonial-card__role">{testimonial.role}</p>
                  </div>
                </div>

                {/* Testimonial Text */}
                <p className="testimonial-card__text">{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="client-carousel__dots">
          {Array.from({ length: Math.max(1, testimonials.length - 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`client-carousel__dot ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientCarousel;
