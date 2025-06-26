import React, { useState, useEffect, useRef } from 'react';
import blog1 from '../assets/images/blog1.webp';
import blog2 from '../assets/images/blog2.webp';
import blog3 from '../assets/images/blog3.webp';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
const BlogCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const trackRef = useRef(null);
  const autoSlideRef = useRef(null);
  const { t } = useTranslation();
  const blogPosts = [
    {
      id: 1,
      title: t('blogCarousel.header'),
      author: t('blogCarousel.author'),
      date: t('blogCarousel.date'),
      excerpt: t('blogCarousel.text'),
      image: blog1,
    },
    {
      id: 2,
      title: t('blogCarousel.header'),
      author: t('blogCarousel.author'),
      date: t('blogCarousel.date'),
      excerpt: t('blogCarousel.text'),
      image: blog2,
    },
    {
      id: 3,
      title: t('blogCarousel.header'),
      author: t('blogCarousel.author'),
      date: t('blogCarousel.date'),
      excerpt: t('blogCarousel.text'),
      image: blog3,
    },
    {
      id: 4,
      title: t('blogCarousel.header'),
      author: t('blogCarousel.author'),
      date: t('blogCarousel.date'),
      excerpt: t('blogCarousel.text'),
      image: blog1,
    },
    {
      id: 5,
      title: t('blogCarousel.header'),
      author: t('blogCarousel.author'),
      date: t('blogCarousel.date'),
      excerpt: t('blogCarousel.text'),
      image: blog2,
    },
  ];

  const extendedPosts = [...blogPosts, ...blogPosts, ...blogPosts];
  const itemsToShow = 3;
  const totalItems = blogPosts.length;

  const startAutoSlide = () => {
    autoSlideRef.current = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, [isDragging]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleTransitionEnd = () => {
      if (currentIndex >= totalItems) {
        track.style.transition = 'none';
        setCurrentIndex(0);
        setTimeout(() => {
          track.style.transition = 'transform 0.5s ease-in-out';
        }, 50);
      } else if (currentIndex < 0) {
        track.style.transition = 'none';
        setCurrentIndex(totalItems - 1);
        setTimeout(() => {
          track.style.transition = 'transform 0.5s ease-in-out';
        }, 50);
      }
    };

    track.addEventListener('transitionend', handleTransitionEnd);
    return () => track.removeEventListener('transitionend', handleTransitionEnd);
  }, [currentIndex, totalItems]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    stopAutoSlide();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.pageX;
    const diffX = startX - currentX;
    setTranslateX(diffX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    if (translateX > threshold) {
      setCurrentIndex((prev) => prev + 1);
    } else if (translateX < -threshold) {
      setCurrentIndex((prev) => prev - 1);
    }

    setTranslateX(0);
    startAutoSlide();
  };
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    stopAutoSlide();
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].pageX;
    const diffX = startX - currentX;
    setTranslateX(diffX);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const getTransform = () => {
    const baseTransform = -(currentIndex + totalItems) * (100 / itemsToShow);
    const dragTransform = (translateX / (window.innerWidth / itemsToShow)) * 100;
    return `translateX(${baseTransform - dragTransform}%)`;
  };

  return (
    <section className="blog-section">
      <div className="blog-header">
        <h2>{t('blogCarousel.title')}</h2>
        <p>{t('blogCarousel.subtitle')}</p>
      </div>

      <div className="blog-carousel-container">
        <div
          ref={trackRef}
          className={`blog-carousel-track ${isDragging ? 'dragging' : ''}`}
          style={{ transform: getTransform() }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {extendedPosts.map((post, index) => (
            <div
              key={`${post.id}-${Math.floor(index / totalItems)}`}
              className="blog-card"
            >
              <div
                className="blog-card-image"
                style={{ backgroundImage: `url(${post.image})` }}
              >
                <div className="image-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                      fill="#7fcdcd"
                    />
                  </svg>
                </div>
              </div>
              <Link to={'/blog'}>
                <div className="blog-card-content">
                  <div className="blog-meta">
                    <span className="blog-author">BY: {post.author}</span>
                    <span className="blog-date">{post.date}</span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogCarousel;
