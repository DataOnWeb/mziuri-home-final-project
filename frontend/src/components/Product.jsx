import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CiHeart } from 'react-icons/ci';
import { PiEyeThin, PiShoppingCartThin } from 'react-icons/pi';
import ProductModal from './ProductModal';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext'; // Import currency hook

const Product = ({ product, viewMode = 'grid' }) => {
  const { _id, title, price, rating, image, description } = product;
  const { i18n } = useTranslation();
  const { formatPrice, getPriceInCurrentCurrency } = useCurrency();

  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i < rating ? '' : 'inactive'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Get the price in current currency and format it
  const getFormattedPrice = () => {
    try {
      let priceValue;

      if (typeof price === 'object' && price !== null) {
        priceValue = getPriceInCurrentCurrency(price);
      } else {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        priceValue = getPriceInCurrentCurrency(numericPrice);
      }

      return formatPrice(priceValue);
    } catch (error) {
      console.error('Error formatting price:', error);
      return formatPrice(0);
    }
  };

  const slideButtonsStyle = {
    position: 'absolute',
    top: '80%',
    left: isHovered ? '15px' : '-80px',
    display: 'flex',
    flexDirection: 'row',
    gap: '10px',
    transition: 'all 0.4s ease',
    opacity: isHovered ? 1 : 0,
    zIndex: 20,
  };

  const buttonStyle = {
    width: '40px',
    height: '40px',
    backgroundColor: '#ffffff',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    border: 'none',
  };

  const listButtonStyle = {
    width: '36px',
    height: '36px',
    backgroundColor: 'transparent',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleQuickView = () => {
    setIsModalOpen(true);
    scrollToTop();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (viewMode === 'grid') {
    return (
      <>
        <div
          className="product-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="product-image">
            <Link to={`/product/${_id}`}>
              <img
                src={image}
                alt={title?.[i18n.language] || title?.en || 'Product image'}
                style={{
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.5s ease',
                }}
              />
            </Link>

            <div style={slideButtonsStyle}>
              <button
                style={buttonStyle}
                className="like-btn"
                onClick={() => handleNavigation('/wishlist')}
                title="Add to Wishlist"
              >
                <CiHeart size="25px" />
              </button>
              <button
                style={buttonStyle}
                className="view-btn"
                onClick={handleQuickView}
                title="Quick View"
              >
                <PiEyeThin size="25px" />
              </button>
              <button
                style={buttonStyle}
                className="cart-btn"
                onClick={() => handleNavigation('/cart')}
                title="Add to Cart"
              >
                <PiShoppingCartThin size="25px" />
              </button>
            </div>
          </div>

          <h3 className="product-title">{title?.[i18n.language] || title?.en || 'No title'}</h3>
          <p className="product-price">{getFormattedPrice()}</p>
          <div className="product-rating">{renderStars(rating)}</div>
        </div>

        <ProductModal
          product={product}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </>
    );
  }

  return (
    <>
      <div className="product-list-card">
        <div className="product-list-image">
          <Link to={`/product/${_id}`}>
            <img
              src={image}
              alt={title?.[i18n.language] || title?.en || 'Product image'}
            />
          </Link>
        </div>

        <div className="product-list-content">
          <div className="product-list-info">
            <h3 className="product-list-title">
              <Link to={`/product/${_id}`}>
                {title?.[i18n.language] || title?.en || 'No title'}
              </Link>
            </h3>
            <p className="product-list-price">{getFormattedPrice()}</p>
            <div className="product-list-rating">{renderStars(rating)}</div>
            <p className="product-list-description">
              {description?.[i18n.language] || description?.en || 'No description available'}
            </p>

            <div className="product-list-actions">
              <button
                style={listButtonStyle}
                className="list-action-btn"
                onClick={() => handleNavigation('/wishlist')}
                title="Add to Wishlist"
              >
                <CiHeart size="23px" />
              </button>
              <button
                style={listButtonStyle}
                className="list-action-btn"
                onClick={handleQuickView}
                title="Quick View"
              >
                <PiEyeThin size="23px" />
              </button>
              <button
                style={listButtonStyle}
                className="list-action-btn"
                onClick={() => handleNavigation('/cart')}
                title="Add to Cart"
              >
                <PiShoppingCartThin size="23px" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Product;
