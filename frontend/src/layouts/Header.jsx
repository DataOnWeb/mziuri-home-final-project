import React, { useState, useEffect, useRef } from 'react';
import proniaImage from '../assets/images/pronia-image.png';
import { PiShoppingBagLight } from 'react-icons/pi';
import { FaSquarePhone } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import SearchFunction from '../components/SearchFunction';
import ShoppingCartSidebar from '../components/ShoppingCartSidebar';
import StickyHeader from '../components/StickyHeader';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import {
  PiMagnifyingGlassThin,
  PiUserThin,
  PiHeartStraightThin,
  PiShoppingBagThin,
  PiCaretDownBold,
  PiList,
} from 'react-icons/pi';
const Header = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mainHeaderRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const { currentCurrency, changeCurrency } = useCurrency();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setActiveDropdown(null);
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      document.body.classList.remove('mobile-menu-open');
    }
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

  const toggleMobileMenu = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);

    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const isInsideMainHeader =
        mainHeaderRef.current && mainHeaderRef.current.contains(event.target);

      if (!isInsideMainHeader) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        document.body.classList.remove('mobile-menu-open');
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [mobileMenuOpen]);

  useEffect(() => {
    document.body.classList.remove('mobile-menu-open');
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      setCurrentLanguage(lng);
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('lang', lng);
      }
      setActiveDropdown(null);
    });
  };

  const handleCurrencyChange = (currency) => {
    changeCurrency(currency);
    if (typeof Storage !== 'undefined') {
      localStorage.setItem('selectedCurrency', currency);
    }
    setActiveDropdown(null);
  };

  useEffect(() => {
    if (typeof Storage !== 'undefined') {
      const savedCurrency = localStorage.getItem('selectedCurrency');
      if (savedCurrency && savedCurrency !== currentCurrency) {
        changeCurrency(savedCurrency);
      }
    }
  }, []);

  const getCurrentCurrencyDisplay = () => {
    switch (currentCurrency) {
      case 'usd':
        return t('usd');
      case 'eur':
        return t('eur');
      case 'gel':
        return t('gel');
      default:
        return t('gel');
    }
  };

  const getCurrentLanguageDisplay = () => {
    return currentLanguage === 'ka' ? `${t('georgian')}` : `${t('english')}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setScrollPosition(currentScrollPos);

      if (currentScrollPos > 200) {
        setHeaderVisible(true);
      } else {
        setHeaderVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { path: '/', label: t('home') },
    { path: '/shop', label: t('shop') },
    { path: '/blog', label: t('blog') },
    { path: '/about', label: t('about') },
    { path: '/pages', label: t('pages') },
    { path: '/contact', label: t('contactPage') },
  ];

  const MobileMenu = () => (
    <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
      <div className="mobile-menu-sidebar">
        <div className="mobile-menu-content">
          {/* Close Button */}
          <button
            className="mobile-menu-close"
            onClick={toggleMobileMenu}
          >
            <IoClose />
          </button>

          {/* Phone Section */}
          <div className="mobile-phone-section">
            <div className="mobile-phone-icon">
              <FaSquarePhone />
            </div>
            <a
              href="tel:+00123456789"
              className="mobile-phone-number"
            >
              +00 123 456 789
            </a>
          </div>

          {/* Language and Currency Options */}
          <div className="mobile-options-section">
            <div
              className="mobile-option-item"
              onClick={() => changeLanguage(currentLanguage === 'en' ? 'ka' : 'en')}
            >
              <div className="flag-icon"></div>
              <span>{getCurrentLanguageDisplay()}</span>
              <span>▼</span>
            </div>
            <div
              className="mobile-option-item"
              onClick={() => {
                const currencies = ['usd', 'eur', 'gel'];
                const currentIndex = currencies.indexOf(currentCurrency);
                const nextCurrency = currencies[(currentIndex + 1) % currencies.length];
                handleCurrencyChange(nextCurrency);
              }}
            >
              <span>{getCurrentCurrencyDisplay()}</span>
              <span>▼</span>
            </div>
          </div>

          {/* Main Navigation */}
          <ul className="mobile-main-menu">
            {navigationItems.map((item) => (
              <li
                key={item.path}
                className={isActive(item.path) ? 'active' : ''}
              >
                <a onClick={() => handleNavigation(item.path)}>{item.label}</a>
              </li>
            ))}
          </ul>

          {/* User Actions */}
          <div className="mobile-user-actions">
            <div
              className="mobile-action-item"
              onClick={toggleSearch}
            >
              <PiMagnifyingGlassThin />
              <span>{t('search')}</span>
            </div>
            <div
              className="mobile-action-item"
              onClick={() => handleNavigation('/login')}
            >
              <PiUserThin />
              <span>{t('account')}</span>
            </div>
            <div
              className="mobile-action-item"
              onClick={() => handleNavigation('/wishlist')}
            >
              <PiHeartStraightThin />
              <span>{t('wishlist')}</span>
            </div>
            <div
              className="mobile-action-item"
              onClick={toggleCart}
            >
              <PiShoppingBagLight />
              <span>{t('cartTitle')} (3)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header
        className={`header ${scrollPosition > 200 ? 'scroll-hidden' : ''}`}
        ref={mainHeaderRef}
      >
        <div className="top-bar">
          <div className="container">
            <div className="promotion">
              <h5>{t('promotion')}</h5>
            </div>
            <div className="options">
              <div className={`currency-selector ${activeDropdown === 'currency' ? 'active' : ''}`}>
                <h5 onClick={(e) => toggleDropdown(e, 'currency')}>
                  {getCurrentCurrencyDisplay()} ▼
                </h5>
                <ul
                  className={`currency-dropdown ${activeDropdown === 'currency' ? 'active' : ''}`}
                >
                  <li
                    onClick={() => handleCurrencyChange('usd')}
                    className={currentCurrency === 'usd' ? 'selected' : ''}
                  >
                    {t('usd')}
                  </li>
                  <li
                    onClick={() => handleCurrencyChange('eur')}
                    className={currentCurrency === 'eur' ? 'selected' : ''}
                  >
                    {t('eur')}
                  </li>
                  <li
                    onClick={() => handleCurrencyChange('gel')}
                    className={currentCurrency === 'gel' ? 'selected' : ''}
                  >
                    {t('gel')}
                  </li>
                </ul>
              </div>
              <div className={`language-selector ${activeDropdown === 'language' ? 'active' : ''}`}>
                <h5 onClick={(e) => toggleDropdown(e, 'language')}>
                  {getCurrentLanguageDisplay()} ▼
                </h5>
                <ul
                  className={`language-dropdown ${activeDropdown === 'language' ? 'active' : ''}`}
                >
                  <li
                    onClick={() => changeLanguage('en')}
                    className={i18n.language === 'en' ? 'selected' : ''}
                  >
                    {t('english')}
                  </li>
                  <li
                    onClick={() => changeLanguage('ka')}
                    className={i18n.language === 'ka' ? 'selected' : ''}
                  >
                    {t('georgian')}
                  </li>
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
                onClick={() => handleNavigation('/')}
              />
            </div>

            <div className="user-actions">
              <div
                className="search-icon"
                onClick={toggleSearch}
              >
                <PiMagnifyingGlassThin size="25px" />
              </div>
              <div
                className="account-icon"
                onClick={(e) => toggleDropdown(e, 'user')}
              >
                <ul className={`user-dropdown1 ${activeDropdown === 'user' ? 'active' : ''}`}>
                  <li onClick={() => handleNavigation('/register')}>{t('register')}</li>
                  <li onClick={() => handleNavigation('/login')}>{t('login')}</li>
                  <li onClick={() => handleNavigation('/profile')}>{t('profile')}</li>
                </ul>
                <PiUserThin size="25px" />
              </div>
              <div
                className="wishlist-icon"
                onClick={() => handleNavigation('/wishlist')}
              >
                <PiHeartStraightThin size="27px" />
              </div>
              <div
                className="cart-icon"
                onClick={toggleCart}
              >
                <PiShoppingBagThin size="27" />
                <span className="cart-count">3</span>
              </div>

              {isMobile && (
                <div
                  className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''} ${mobileMenuOpen ? 'hidden' : ''}`}
                  onClick={toggleMobileMenu}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!isMobile && (
          <nav className="main-navigation">
            <div className="container">
              <ul className="main-menu">
                {navigationItems.map((item) => (
                  <li
                    key={item.path}
                    className={isActive(item.path) ? 'active' : ''}
                  >
                    <a onClick={() => handleNavigation(item.path)}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}

        <SearchFunction
          searchVisible={searchVisible}
          closeSearch={closeSearch}
          handleSearchSubmit={handleSearchSubmit}
        />
      </header>

      {isMobile && <MobileMenu />}

      {/* Sticky Header Component */}
      <StickyHeader
        headerVisible={headerVisible}
        searchVisible={searchVisible}
        toggleSearch={toggleSearch}
        toggleCart={toggleCart}
        closeSearch={closeSearch}
        handleSearchSubmit={handleSearchSubmit}
      />

      <ShoppingCartSidebar
        isOpen={cartOpen}
        setIsOpen={setCartOpen}
      />
    </>
  );
};

export default Header;
