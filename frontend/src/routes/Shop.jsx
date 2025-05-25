import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../api/api';
import { categories, colors } from '../data/data';
import ProductList from '../components/ProductList';
import Pagination from '../components/Pagination';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import { IoSearchOutline } from 'react-icons/io5';
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
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);
  const trackActiveRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const { useDataLoader } = useLoader();

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
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeCategory !== 'All') {
      result = result.filter((product) => product.category === activeCategory);
    }

    if (activeColor !== 'All') {
      result = result.filter((product) => product.color === activeColor);
    }

    result = result.filter(
      (product) => product.price >= priceRange.min && product.price <= priceRange.max
    );

    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [products, searchTerm, activeCategory, activeColor, sortOption, priceRange]);

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

  return (
    <div>
      <RouteBanner title="shop" />

      <div className="shop-container">
        <div className="sidebar">
          <div className="search-box">
            <div className="search-wrapper">
              <div className="search-input-container">
                <input
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoSearchOutline className="input-search-icon" />
              </div>
              <button
                className="search-button"
                aria-label="Search"
              ></button>
            </div>
          </div>

          <div className="filter-section">
            <h2>Categories</h2>
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
                    <span className="category-label">› {category.name}</span>
                    <span className="count">({category.count})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <h2>Color</h2>
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
                    <span className="category-label">› {color.name}</span>
                    <span className="count">({color.count})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="filter-container">
            <div className="price-filter">
              <h2>Price Filter</h2>
              <div className="divider"></div>
              <div className="range-values">
                <span className="price-bubble">${priceRange.min}</span>
                <span className="price-bubble">${priceRange.max}</span>
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
              <h2>Popular Tags</h2>
              <div className="divider"></div>
              <div className="tags-container">
                <span
                  className="tag"
                  onClick={scrollToTop}
                >
                  Fashion
                </span>
                <span
                  className="tag"
                  onClick={scrollToTop}
                >
                  Organic
                </span>
                <span
                  className="tag"
                  onClick={scrollToTop}
                >
                  Old Fashion
                </span>
                <span
                  className="tag"
                  onClick={scrollToTop}
                >
                  Men
                </span>
                <span
                  className="tag"
                  onClick={scrollToTop}
                >
                  Fashion
                </span>
                <span
                  className="tag"
                  onClick={scrollToTop}
                >
                  Dress
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="products-area">
          <div className="toolbar">
            <div className="product-count">
              {loading ? (
                'Loading products...'
              ) : (
                <>
                  <span className="highlight-number">{filteredProducts.length}</span> Product
                  {filteredProducts.length !== 1 ? 's' : ''} Found of{' '}
                  <span className="highlight-total">{totalProducts}</span>
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
                  <option value="default">Sort by Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-indicator">Loading products...</div>
          ) : (
            <>
              <ProductList
                products={filteredProducts}
                viewMode={viewMode}
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
