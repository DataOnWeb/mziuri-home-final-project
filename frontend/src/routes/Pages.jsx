import React, { useState, useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';
import ErrorImg from '../assets/images/404.png';
import { useLoader } from '../hooks/useLoader';
const Pages = () => {
  const [email, setEmail] = useState('');
  const { useFakeLoader } = useLoader();
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Newsletter subscription:', email);
    setEmail('');
  };
  useEffect(() => {
    useFakeLoader();
    document.title = 'Other Pages - Pronia';
  }, []);

  return (
    <>
      <RouteBanner title="pages" />

      <div className="not-found-page">
        {/* Main 404 content */}
        <div className="main-content">
          <div className="error-number">
            <img
              src={ErrorImg}
              alt="404"
              className="error-404-image"
            />
          </div>

          <h1 className="error-message">Oops, page not found!</h1>

          <button className="back-home-btn">
            <span>BACK TO HOME</span>
            <svg
              className="home-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Decorative grass border */}
        <div className="grass-border"></div>

        {/* Newsletter section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Subscribe Our Newsletter &</h2>
              <h3>Get Update Everytime</h3>
            </div>

            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="submit-btn"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pages;
