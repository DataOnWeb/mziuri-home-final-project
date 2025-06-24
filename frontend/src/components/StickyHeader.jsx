import React, { useState, useEffect, useRef } from 'react';
import proniaImage from '../assets/images/pronia-image.png';
import { IoSearchOutline } from 'react-icons/io5';
import { LuUsers } from 'react-icons/lu';
import { IoMdHeartEmpty } from 'react-icons/io';
import { PiShoppingBagLight } from 'react-icons/pi';
import SearchFunction from '../components/SearchFunction';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PiMagnifyingGlassThin,
  PiUserThin,
  PiHeartStraightThin,
  PiShoppingBagThin,
  PiCaretDownBold,
  PiList,
} from 'react-icons/pi';
const StickyHeader = ({
  headerVisible,
  searchVisible,
  toggleSearch,
  toggleCart,
  closeSearch,
  handleSearchSubmit,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setActiveDropdown(null);
  };

  const toggleDropdown = (e, type) => {
    e.stopPropagation();
    if (activeDropdown === type) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(type);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const isInsideFixedHeader = dropdownRef.current && dropdownRef.current.contains(event.target);

      if (!isInsideFixedHeader) {
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
      <header
        className={`sticky-header ${headerVisible ? 'visible' : ''}`}
        ref={dropdownRef}
      >
        <div className="container">
          <div className="logo">
            <img
              src={proniaImage}
              alt="Pronia"
              onClick={() => handleNavigation('/')}
            />
          </div>
          <nav className="sticky-navigation">
            <ul className="main-menu">
              <li className={isActive('/') ? 'active' : ''}>
                <a onClick={() => handleNavigation('/')}>{t('home')}</a>
              </li>
              <li className={isActive('/shop') ? 'active' : ''}>
                <a onClick={() => handleNavigation('/shop')}>{t('shop')}</a>
              </li>
              <li className={isActive('/blog') ? 'active' : ''}>
                <a onClick={() => handleNavigation('/blog')}>{t('blog')}</a>
              </li>
              <li className={isActive('/about') ? 'active' : ''}>
                <a onClick={() => handleNavigation('/about')}>{t('about')}</a>
              </li>
              <li className={isActive('/pages') ? 'active' : ''}>
                <a onClick={() => handleNavigation('/pages')}>{t('pages')}</a>
              </li>
              <li className={isActive('/contact') ? 'active' : ''}>
                <a onClick={() => handleNavigation('/contact')}>{t('contact')}</a>
              </li>
            </ul>
          </nav>
          <div className="user-actions">
            <div
              className="search-icon"
              onClick={toggleSearch}
            >
              <PiMagnifyingGlassThin size="22px" />
            </div>
            <div
              className="account-icon"
              onClick={(e) => toggleDropdown(e, 'user')}
            >
              <ul className={`user-dropdown ${activeDropdown === 'user' ? 'active' : ''}`}>
                <li onClick={() => handleNavigation('/register')}>{t('register')}</li>
                <li onClick={() => handleNavigation('/login')}>{t('login')}</li>
                <li onClick={() => handleNavigation('/profile')}>{t('profile')}</li>
              </ul>
              <PiUserThin size="22px" />
            </div>
            <div
              className="wishlist-icon"
              onClick={() => handleNavigation('/wishlist')}
            >
              <PiHeartStraightThin size="24px" />
            </div>
            <div
              className="cart-icon"
              onClick={toggleCart}
            >
              <PiShoppingBagThin size="24px" />
              <span className="cart-count">3</span>
            </div>
          </div>
        </div>
      </header>

      <SearchFunction
        searchVisible={searchVisible}
        closeSearch={closeSearch}
        handleSearchSubmit={handleSearchSubmit}
      />
    </>
  );
};

export default StickyHeader;
