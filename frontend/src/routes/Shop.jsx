import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../api/api';
import { categories, colors } from '../data/data';
import ProductList from '../components/ProductList';
import Pagination from '../components/Pagination';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import { IoSearchOutline } from 'react-icons/io5';
import { useTranslation, Trans } from 'react-i18next';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [activeColor, setActiveColor] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [totalProducts, setTotalProducts] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 10, max: 300 });
  const [currency, setCurrency] = useState('USD');
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);
  const trackActiveRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const { useDataLoader } = useLoader();
  const { t, i18n } = useTranslation();
  const getProductPrice = (product) => {
    if (typeof product.price === 'object' && product.price !== null) {
      return product.price[currency] || product.price.USD || 0;
    }
    return typeof product.price === 'number' ? product.price : 0;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await useDataLoader(getProducts);
        setProducts(data);
        setFilteredProducts(data);
        setTotalProducts(data.length);
        setLoading(false);
      } catch (error) {}
    };

    fetchProducts();
    document.title = 'Shop - Pronia';
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    if (searchTerm) {
      result = result.filter((product) =>
        product.title?.[i18n.language].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'All') {
      result = result.filter((product) => product.category === activeCategory);
    }

    if (activeColor !== 'All') {
      result = result.filter((product) => product.color === activeColor);
    }

    result = result.filter((product) => {
      const price = getProductPrice(product);
      return price >= priceRange.min && price <= priceRange.max;
    });

    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
        break;
      case 'price-high':
        result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
        break;
      case 'name-asc':
        result.sort((a, b) => {
          const titleA = a.title?.[i18n.language] || a.title?.en || '';
          const titleB = b.title?.[i18n.language] || b.title?.en || '';
          return titleA.localeCompare(titleB);
        });
        break;
      case 'name-desc':
        result.sort((a, b) => {
          const titleA = a.title?.[i18n.language] || a.title?.en || '';
          const titleB = b.title?.[i18n.language] || b.title?.en || '';
          return titleB.localeCompare(titleA);
        });
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [
    products,
    searchTerm,
    activeCategory,
    activeColor,
    sortOption,
    priceRange,
    currency,
    i18n.language,
  ]);

  const updateTrackActive = () => {
    if (!minThumbRef.current || !maxThumbRef.current || !trackActiveRef.current) return;

    const minLeft = parseFloat(minThumbRef.current.style.left);
    const maxLeft = parseFloat(maxThumbRef.current.style.left);

    trackActiveRef.current.style.left = `${minLeft}%`;
    trackActiveRef.current.style.width = `${maxLeft - minLeft}%`;
  };
  const initializePriceSlider = () => {
    if (!minThumbRef.current || !maxThumbRef.current) return;

    const minThumb = minThumbRef.current;
    const maxThumb = maxThumbRef.current;

    minThumb.style.left = '10%';
    maxThumb.style.left = '90%';
    updateTrackActive();
  };
  useEffect(() => {
    initializePriceSlider();
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const calculatePrice = (position, containerWidth) => {
    const minValue = 10;
    const maxValue = 300;
    const range = maxValue - minValue;
    const percentage = position / containerWidth;
    return Math.round(minValue + percentage * range);
  };

  const updatePrices = (minLeftPct, maxLeftPct) => {
    if (!sliderContainerRef.current) return;

    const containerWidth = sliderContainerRef.current.offsetWidth;
    const minPosition = (minLeftPct / 100) * containerWidth;
    const maxPosition = (maxLeftPct / 100) * containerWidth;

    const minPriceVal = calculatePrice(minPosition, containerWidth);
    const maxPriceVal = calculatePrice(maxPosition, containerWidth);

    setPriceRange({ min: minPriceVal, max: maxPriceVal });
  };

  const handleDrag = (isMinThumb, e) => {
    e.preventDefault();

    if (!sliderContainerRef.current || !minThumbRef.current || !maxThumbRef.current) return;

    const containerWidth = sliderContainerRef.current.offsetWidth;
    const containerRect = sliderContainerRef.current.getBoundingClientRect();
    const thumb = isMinThumb ? minThumbRef.current : maxThumbRef.current;

    const onMove = (moveEvent) => {
      let position = moveEvent.clientX - containerRect.left;

      position = Math.max(0, Math.min(position, containerWidth));

      let percentage = (position / containerWidth) * 100;

      if (isMinThumb) {
        const maxLeftPct = parseFloat(maxThumbRef.current.style.left);
        percentage = Math.min(percentage, maxLeftPct - 5);
      } else {
        const minLeftPct = parseFloat(minThumbRef.current.style.left);
        percentage = Math.max(percentage, minLeftPct + 5);
      }

      thumb.style.left = `${percentage}%`;

      updateTrackActive();
      updatePrices(
        parseFloat(minThumbRef.current.style.left),
        parseFloat(maxThumbRef.current.style.left)
      );
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // Function to get currency symbol
  const getCurrencySymbol = (curr) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GEL: '₾',
    };
    return symbols[curr] || curr;
  };

  return (
    <div>
      <RouteBanner title={t('shop')} />

      <div className="shop-container">
        <div className="sidebar">
          <div className="search-box">
            <div className="search-wrapper">
              <div className="search-input-container">
                <input
                  type="search"
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoSearchOutline className="input-search-icon" />
              </div>
              <button
                className="search-button"
                aria-label={t('search')}
              ></button>
            </div>
          </div>

          <div className="filter-section">
            <h2>{t('categories')}</h2>
            <div className="divider"></div>
            <ul>
              {categories.map((category) => (
                <li key={category.name}>
                  <a
                    href="#"
                    className={activeCategory === category.name ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveCategory(category.name);
                    }}
                  >
                    <span className="category-label">› {t(`categoriesList.${category.name}`)}</span>
                    <span className="count">({category.count})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h2>{t('color')}</h2>
            <div className="divider"></div>
            <ul>
              {colors.map((color) => (
                <li key={color.name}>
                  <a
                    href="#"
                    className={activeColor === color.name ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveColor(color.name);
                    }}
                  >
                    <span className="category-label">› {t(`colorsList.${color.name}`)}</span>
                    <span className="count">({color.count})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-container">
            <div className="price-filter">
              <h2>{t('priceFilter')}</h2>
              <div className="divider"></div>
              <div className="range-values">
                <span className="price-bubble">
                  {getCurrencySymbol(currency)}
                  {priceRange.min}
                </span>
                <span className="price-bubble">
                  {getCurrencySymbol(currency)}
                  {priceRange.max}
                </span>
              </div>
              <div
                className="slider-container"
                ref={sliderContainerRef}
              >
                <div className="slider-track"></div>
                <div
                  className="slider-track-active"
                  ref={trackActiveRef}
                ></div>
                <div
                  className="slider-thumb min-thumb"
                  ref={minThumbRef}
                  onMouseDown={(e) => handleDrag(true, e)}
                ></div>
                <div
                  className="slider-thumb max-thumb"
                  ref={maxThumbRef}
                  onMouseDown={(e) => handleDrag(false, e)}
                ></div>
              </div>
            </div>

            <div className="popular-tags">
              <h2>{t('popularTags')}</h2>
              <div className="divider"></div>
              <div className="tags-container">
                {['fashion', 'organic', 'oldFashion', 'men', 'fashion', 'dress'].map(
                  (tagKey, i) => (
                    <span
                      key={i}
                      className="tag"
                      onClick={scrollToTop}
                    >
                      {t(`tags.${tagKey}`)}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="shop-collection-item shop-collection-item-medium">
            <div className="product-collection-content">
              <span className="product-collection-category">New Collection</span>
              <h3 className="product-collection-title">Plant Port</h3>
              <button className="product-collection-button">SHOP NOW</button>
            </div>
          </div>
        </div>

        <div className="products-area">
          <div className="toolbar">
            <div className="product-count">
              {loading ? (
                t('loading')
              ) : (
                <>
                  <h4>
                    <Trans
                      i18nKey="productCount"
                      count={filteredProducts.length}
                      values={{ count: filteredProducts.length, total: totalProducts }}
                      components={{ green: <span className="text-green" /> }}
                    />
                  </h4>
                </>
              )}
            </div>

            <div className="view-options">
              <div className="view-buttons">
                <button
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'active' : ''}
                  aria-label="Grid view"
                >
                  ☰
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'active' : ''}
                  aria-label="List view"
                >
                  ≡
                </button>
              </div>

              <div className="sort-dropdown">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="default">{t('sort.default')}</option>
                  <option value="price-low">{t('sort.priceLowToHigh')}</option>
                  <option value="price-high">{t('sort.priceHighToLow')}</option>
                  <option value="name-asc">{t('sort.nameAZ')}</option>
                  <option value="name-desc">{t('sort.nameZA')}</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-indicator">{t('loading')}</div>
          ) : (
            <>
              <ProductList
                products={filteredProducts}
                viewMode={viewMode}
                currency={currency}
              />
              <Pagination />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
