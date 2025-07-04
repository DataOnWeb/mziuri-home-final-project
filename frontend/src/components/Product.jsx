import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CiHeart } from 'react-icons/ci';
import { PiEyeThin, PiShoppingCartThin } from 'react-icons/pi';
import ProductModal from './ProductModal';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { addToCart, addToWishlist } from '../api/api';
import { useUserData } from '../context/UserContext';

const Product = ({ product, viewMode = 'grid' }) => {
  const { _id, title, price, rating, image, hoverImage, description } = product;
  const { i18n, t } = useTranslation();
  const { formatPrice, getPriceInCurrentCurrency } = useCurrency();
  const { isLoggedIn } = useUserData();
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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/register');
      return;
    }
    
    try {
      await addToCart(_id, 1);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message.includes('Authentication required') || 
          error.response?.status === 401 || 
          error.response?.status === 403) {
        navigate('/login');
      } else {
        alert(error.message || 'Failed to add to cart');
      }
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/register');
      return;
    }
    
    try {
      await addToWishlist(_id);
      navigate('/wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (error.message.includes('Authentication required') || 
          error.response?.status === 401 || 
          error.response?.status === 403) {
        navigate('/register');
      } else if (error.message.includes('already in your wishlist')) {
        alert('This product is already in your wishlist!');
      } else {
        alert(error.message || 'Failed to add to wishlist');
      }
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


  const imageContainerStyle = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    display: 'block',
  };

  const baseImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'all 0.4s ease',
  };

  const mainImageStyle = {
    ...baseImageStyle,
    opacity: isHovered && hoverImage ? 0 : 1,
  };

  const hoverImageStyle = {
    ...baseImageStyle,
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: isHovered && hoverImage ? 1 : 0,
    zIndex: 1,
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
            <div style={imageContainerStyle}>
              <Link to={`/product/${_id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                <img
                  src={`/productImg/product${image}.jpg`}
                  alt={title?.[i18n.language] || title?.en || 'Product image'}
                  style={mainImageStyle}
                />
                
                {hoverImage && (
                  <img
                    src={`/productImg/product${hoverImage}.jpg`}
                    alt={`${title?.[i18n.language] || title?.en || 'Product image'} - hover`}
                    style={hoverImageStyle}
                  />
                )}
              </Link>
            </div>

            <div style={slideButtonsStyle}>
              <button
                style={buttonStyle}
                className="like-btn tooltip tooltip-top tooltip-scale"
                data-tooltip={t('tooltip1')}
                onClick={handleAddToWishlist}
              >
                <CiHeart size="25px" />
              </button>
              <button
                style={buttonStyle}
                className="view-btn tooltip tooltip-top tooltip-scale"
                data-tooltip={t('tooltip2')}
                onClick={handleQuickView}
              >
                <PiEyeThin size="25px" />
              </button>
              <button
                style={buttonStyle}
                className="cart-btn tooltip tooltip-top tooltip-scale"
                data-tooltip={t('tooltip3')}
                onClick={handleAddToCart}
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
              src={`/productImg/product${image}.jpg`}
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
                className="list-action-btn tooltip tooltip-bottom tooltip-fade"
                data-tooltip={t('tooltip1')}
                onClick={handleAddToWishlist}
              >
                <CiHeart size="23px" />
              </button>
              <button
                style={listButtonStyle}
                className="list-action-btn tooltip tooltip-bottom tooltip-fade"
                data-tooltip={t('tooltip2')}
                onClick={handleQuickView}
              >
                <PiEyeThin size="23px" />
              </button>
              <button
                style={listButtonStyle}
                className="list-action-btn tooltip tooltip-bottom tooltip-fade"
                data-tooltip={t('tooltip3')}
                onClick={handleAddToCart}
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