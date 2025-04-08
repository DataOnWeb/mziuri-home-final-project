import React, { useState, useEffect, useRef } from 'react';
import proniaImage from '../assets/images/pronia-image.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faHeart, faUser, faPhone } from "@fortawesome/free-solid-svg-icons";
import SearchFunction from '../components/SearchFunction';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate()
  const handleNavigation = (path) => {
    navigate(path);
  };
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const closeSearch = (e) => {
    if (e.key === 'Escape') {
      setSearchVisible(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted');
    setSearchVisible(false);
  };

  const toggleDropdown = (e, type) => {
    e.stopPropagation();
    if (activeDropdown === type) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(type);
    }
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="top-bar">
        <div className="container">
          <div className="promotion">
            <h5>HELLO EVERYONE! 25% OFF ALL PRODUCTS</h5>
          </div>
          <div className="options" ref={dropdownRef}>
            <div className={`currency-selector ${activeDropdown === 'currency' ? 'active' : ''}`}>
              <h5 onClick={(e) => toggleDropdown(e, 'currency')}>USD ▼</h5>
              <ul className={`currency-dropdown ${activeDropdown === 'currency' ? 'active' : ''}`}>
                <li>USD</li>
                <li>EUR</li>
                
              </ul>
            </div>
            <div className={`language-selector ${activeDropdown === 'language' ? 'active' : ''}`}>
              <h5 onClick={(e) => toggleDropdown(e, 'language')}>ENGLISH ▼</h5>
              <ul className={`language-dropdown ${activeDropdown === 'language' ? 'active' : ''}`}>
                <li>ENGLISH</li>
                <li>SPANISH</li>
                <li>FRENCH</li>
              
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="navbar">
        <div className="container">
          <div className="contact-info">
            <div className="phone-icon"onClick={() => handleNavigation('/contact')}>
            <FontAwesomeIcon icon={faPhone} />
            </div>
            <span>+00 123 456 789</span>
          </div>
          <div className="logo">
            <img src={proniaImage} alt='Pronia' />
          </div>
          <div className="user-actions">
            <div className="search-icon" onClick={toggleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </div>
            <div className="account-icon" onClick={() => handleNavigation('/profile')}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="wishlist-icon" onClick={() => handleNavigation('/wishlist')}>
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <div className="cart-icon" onClick={() => handleNavigation('/cart')}>
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
          </div>
        </div>
      </div>

      <nav className="main-navigation">
        <div className="container">
          <ul className="main-menu">
            <li><a onClick={() => handleNavigation('/')}>HOME</a></li>
            <li><a onClick={() => handleNavigation('/shop')}>SHOP</a></li>
            <li><a onClick={() => handleNavigation('/blog')}>BLOG</a></li>
            <li><a onClick={() => handleNavigation('/about')}>ABOUT US</a></li>
            <li><a onClick={() => handleNavigation('/pages')}>PAGES</a></li>
            <li><a onClick={() => handleNavigation('/contact')}>CONTACT US</a></li>
          </ul>
        </div>
      </nav>

      <SearchFunction
        searchVisible={searchVisible}
        closeSearch={closeSearch}
        handleSearchSubmit={handleSearchSubmit}
      />
      
    </header>
    
  );
};

export default Header;