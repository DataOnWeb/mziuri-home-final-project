import React, { useState } from 'react';
import proniaImage from '../assets/pronia-image.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCartShopping, faHeart, faUser, faPhone } from "@fortawesome/free-solid-svg-icons";
import SearchFunction from '../components/SearchFunction';

const Header = () => {
  const [searchVisible, setSearchVisible] = useState(false);

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

  return (
    <header className="header">
      <div className="top-bar">
        <div className="container">
          <div className="promotion">
            <h5>HELLO EVERYONE! 25% OFF ALL PRODUCTS</h5>
          </div>
          <div class="options">
          <div class="currency-selector">
            <h5>USD ▼</h5>
            {/* <ul class="currency-dropdown">
              <li>USD</li>
              <li>EUR</li>
              <li>GBP</li>
              <li>JPY</li>
            </ul> */}
           </div>
            <div class="language-selector">
                <h5>ENGLISH ▼</h5>
                {/* <ul class="language-dropdown">
                  <li>ENGLISH</li>
                  <li>SPANISH</li>
                  <li>FRENCH</li>
                  <li>GERMAN</li>
                </ul> */}
              </div>
           </div>

        </div>
      </div>

      <div className="navbar">
        <div className="container">
          <div className="contact-info">
            <div className="phone-icon">
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
            <div className="account-icon">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="wishlist-icon">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <div className="cart-icon">
              <FontAwesomeIcon icon={faCartShopping} />
            </div>
          </div>
        </div>
      </div>

      <nav className="main-navigation">
        <div className="container">
          <ul className="main-menu">
            <li><a href="#">HOME</a></li>
            <li><a href="#">SHOP</a></li>
            <li><a href="#">BLOG</a></li>
            <li><a href="#">ABOUT US</a></li>
            <li><a href="#">PAGES</a></li>
            <li><a href="#">CONTACT US</a></li>
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
