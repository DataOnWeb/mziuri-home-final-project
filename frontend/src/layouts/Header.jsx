import React, { useState, useEffect, useRef } from 'react';
import proniaImage from '../assets/images/pronia-image.png';
import { IoSearchOutline } from 'react-icons/io5';
import { LuUsers } from 'react-icons/lu';
import { IoMdHeartEmpty } from 'react-icons/io';
import { PiShoppingBagLight } from 'react-icons/pi';
import { FaSquarePhone } from 'react-icons/fa6';
import SearchFunction from '../components/SearchFunction';
import ShoppingCartSidebar from '../components/ShoppingCartSidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

const Header = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const dropdownRef = useRef(null);
  const mainHeaderRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const { currentCurrency, changeCurrency, currencyNames } = useCurrency();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setActiveDropdown(null);
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
      const isInsideMainHeader =
        mainHeaderRef.current && mainHeaderRef.current.contains(event.target);
      const isInsideFixedHeader = dropdownRef.current && dropdownRef.current.contains(event.target);

      if (!isInsideMainHeader && !isInsideFixedHeader) {
        setActiveDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng).then(() => {
      setCurrentLanguage(lng);
      localStorage.setItem('lang', lng);
      setActiveDropdown(null);
    });
  };

  const handleCurrencyChange = (currency) => {
    changeCurrency(currency);
    localStorage.setItem('selectedCurrency', currency);
    setActiveDropdown(null);
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && savedCurrency !== currentCurrency) {
      changeCurrency(savedCurrency);
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

      setLastScrollTop(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                  {getCurrentCurrencyDisplay()}▼
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
                <ul className={`user-dropdown1 ${activeDropdown === 'user' ? 'active' : ''}`}>
                  <li onClick={() => handleNavigation('/register')}>{t('register')}</li>
                  <li onClick={() => handleNavigation('/login')}>{t('login')}</li>
                  <li onClick={() => handleNavigation('/profile')}>{t('profile')}</li>
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
          </div>
        </nav>

        <SearchFunction
          searchVisible={searchVisible}
          closeSearch={closeSearch}
          handleSearchSubmit={handleSearchSubmit}
        />
      </header>

      {/* Fixed Header component */}

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
              <IoSearchOutline size="22px" />
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
              <LuUsers size="22px" />
            </div>
            <div
              className="wishlist-icon"
              onClick={() => handleNavigation('/wishlist')}
            >
              <IoMdHeartEmpty size="24px" />
            </div>
            <div
              className="cart-icon"
              onClick={toggleCart}
            >
              <PiShoppingBagLight size="24px" />
              <span className="cart-count">3</span>
            </div>
          </div>
        </div>
      </header>

      <ShoppingCartSidebar
        isOpen={cartOpen}
        setIsOpen={setCartOpen}
      />
    </>
  );
};

export default Header;
