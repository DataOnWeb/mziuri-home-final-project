import React, { useState, useEffect, useRef } from 'react';
import proniaImage from '../assets/images/pronia-image.png';
import { IoSearchOutline } from 'react-icons/io5';
import { LuUsers } from 'react-icons/lu';
import { IoMdHeartEmpty } from 'react-icons/io';
import { PiShoppingBagLight } from 'react-icons/pi';
import { FaSquarePhone } from 'react-icons/fa6';
import SearchFunction from '../components/SearchFunction';
import ShoppingCartSidebar from '../components/ShoppingCartSidebar';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
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
  
  const toggleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCartOpen(!cartOpen);
  };

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
    <>
      <header className="header">
        <div className="top-bar">
          <div className="container">
            <div className="promotion">
              <h5>HELLO EVERYONE! 25% OFF ALL PRODUCTS</h5>
            </div>
            <div
              className="options"
              ref={dropdownRef}
            >
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
              <div
                className="phone-icon"
                onClick={() => handleNavigation('/contact')}
              >
                <FaSquarePhone size="40px" />
              </div>
              <span>+00 123 456 789</span>
            </div>
            <div className="logo">
              <img
                src={proniaImage}
                alt="Pronia"
              />
            </div>
            <div className="user-actions">
              <div
                className="search-icon"
                onClick={toggleSearch}
              >
                <IoSearchOutline size="25px" />
              </div>
              <div
                className="account-icon"
                onClick={(e) => toggleDropdown(e, 'user')}
              >
                <ul className={`user-dropdown ${activeDropdown === 'user' ? 'active' : ''}`}>
                  <li onClick={() => handleNavigation('/register')}>REGISTER</li>
                  <li onClick={() => handleNavigation('/login')}>LOGIN</li>
                  <li onClick={() => handleNavigation('/profile')}>PROFILE</li>
                </ul>
                <LuUsers size="25px" />
              </div>
              <div
                className="wishlist-icon"
                onClick={() => handleNavigation('/wishlist')}
              >
                <IoMdHeartEmpty size="27px" />
              </div>
              <div
                className="cart-icon"
                onClick={toggleCart}
              >
                <PiShoppingBagLight size="27" />
                <span className="cart-count">3</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="main-navigation">
          <div className="container">
            <ul className="main-menu">
              <li>
                <a onClick={() => handleNavigation('/')}>HOME</a>
              </li>
              <li>
                <a onClick={() => handleNavigation('/shop')}>SHOP</a>
              </li>
              <li>
                <a onClick={() => handleNavigation('/blog')}>BLOG</a>
              </li>
              <li>
                <a onClick={() => handleNavigation('/about')}>ABOUT US</a>
              </li>
              <li>
                <a onClick={() => handleNavigation('/pages')}>PAGES</a>
              </li>
              <li>
                <a onClick={() => handleNavigation('/contact')}>CONTACT US</a>
              </li>
            </ul>
          </div>
        </nav>

        <SearchFunction
          searchVisible={searchVisible}
          closeSearch={closeSearch}
          handleSearchSubmit={handleSearchSubmit}
        />
      </header>
      
      {/* Shopping Cart Sidebar */}
      <ShoppingCartSidebar isOpen={cartOpen} setIsOpen={setCartOpen} />
    </>
  );
};

export default Header;