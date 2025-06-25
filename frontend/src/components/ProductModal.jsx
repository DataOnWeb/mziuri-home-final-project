import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { CiHeart, CiDeliveryTruck, CiCreditCard1 } from 'react-icons/ci';
import { PiShoppingCartThin } from 'react-icons/pi';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { IoChevronDown } from 'react-icons/io5';
import { BsPostcard } from 'react-icons/bs';
import { FaArrowsRotate } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { addToCart, addToWishlist } from '../api/api';
const ProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState(t('modal.size1'));
  const [selectedColor, setSelectedColor] = useState(t('modal.color1'));

  const handleNavigation = (path) => {
    navigate(path);
  };

  const { formatPrice, getPriceInCurrentCurrency } = useCurrency();
  const getFormattedPrice = (priceObj) => {
    try {
      let priceValue;

      if (typeof priceObj === 'object' && priceObj !== null) {
        priceValue = getPriceInCurrentCurrency(priceObj);
      } else {
        const numericPrice = typeof priceObj === 'string' ? parseFloat(priceObj) : priceObj;
        priceValue = getPriceInCurrentCurrency(numericPrice);
      }

      return formatPrice(priceValue);
    } catch (error) {
      console.error('Error formatting price:', error);
      return formatPrice(0);
    }
  };

  if (!isOpen || !product) return null;

  const { _id, title, price, rating, image, description, category } = product;
  const localizedPrice = getFormattedPrice(price);

  const colorOptions = [t('modal.color1'), t('modal.color2'), t('modal.color3')];
  const sizeOptions = [t('modal.size1'), t('modal.size2'), t('modal.size3')];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i < rating ? 'filled' : 'empty'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity((prev) => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(_id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    navigate('/cart');
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    try {
      await addToWishlist(_id);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
    navigate('/wishlist');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDropdownToggle = (dropdownName) => {
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setActiveDropdown(null);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setActiveDropdown(null);
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="modal-content">
        <button
          className="modal-close"
          onClick={onClose}
        >
          <IoClose size={24} />
        </button>

        <div className="modal-body">
          <div className="modal-image-section">
            <div className="product-image-container">
              <img
                src={`/productImg/product${image}.jpg`}
                alt={title?.[i18n.language] || title?.en || 'Product image'}
                className="product-image"
              />
            </div>
          </div>

          <div className="modal-details-section">
            <h2 className="product-title">{title?.[i18n.language] || title?.en || 'No title'}</h2>
            <div className="product-price">
              <span className="current-price">{localizedPrice}</span>
            </div>

            <div className="product-rating">
              <div className="stars">{renderStars(rating)}</div>
              <span className="rating-count">({t('modal.review')})</span>
            </div>

            <div className="product-options">
              <div className="option-group">
                <label>{t('modal.color')}</label>
                <div className="dropdown-container">
                  <div
                    className="dropdown-header"
                    onClick={() => handleDropdownToggle('color')}
                  >
                    <span>{selectedColor}</span>
                    <IoChevronDown
                      className={`dropdown-arrow ${activeDropdown === 'color' ? 'rotated' : ''}`}
                    />
                  </div>
                  {activeDropdown === 'color' && (
                    <div className="dropdown-menu">
                      {colorOptions.map((color, index) => (
                        <div
                          key={index}
                          className={`dropdown-item ${selectedColor === color ? 'selected' : ''}`}
                          onClick={() => handleColorSelect(color)}
                        >
                          {color}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="option-group">
                <label>{t('modal.size')}</label>
                <div className="dropdown-container">
                  <div
                    className="dropdown-header"
                    onClick={() => handleDropdownToggle('size')}
                  >
                    <span>{selectedSize}</span>
                    <IoChevronDown
                      className={`dropdown-arrow ${activeDropdown === 'size' ? 'rotated' : ''}`}
                    />
                  </div>
                  {activeDropdown === 'size' && (
                    <div className="dropdown-menu">
                      {sizeOptions.map((size, index) => (
                        <div
                          key={index}
                          className={`dropdown-item ${selectedSize === size ? 'selected' : ''}`}
                          onClick={() => handleSizeSelect(size)}
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="product-description">
              <p>{description?.[i18n.language] || description?.en || 'No description available'}</p>
            </div>

            <div className="quantity-and-actions">
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange('decrement')}
                  disabled={quantity === 1}
                >
                  <FiMinus />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange('increment')}
                >
                  <FiPlus />
                </button>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                  {t('addToCart')}
              </button>

              <button
                className="wishlist-btn"
                onClick={handleAddToWishlist}
              >
                <CiHeart size={20} />
              </button>

              <button
                className="compare-btn"
                onClick={() => handleNavigation('/compare')}
              >
                <FaArrowsRotate size={15} />
              </button>
            </div>

            <div className="product-features">
              <div className="feature">
                <div className="feature-icon">
                  <div className="feature-icon">
                    <CiDeliveryTruck size={40} />
                  </div>
                </div>
                <div className="feature-content">
                  <strong>{t('singleProduct.benefits.free')}</strong>
                  <span>{t('singleProduct.benefits.shipping')}</span>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <CiCreditCard1 size={40} />
                </div>
                <div className="feature-content">
                  <strong>{t('singleProduct.benefits.safe')}</strong>
                  <span>{t('singleProduct.benefits.payment')}</span>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <BsPostcard size={37} />
                </div>
                <div className="feature-content">
                  <strong>{t('singleProduct.benefits.safe')}</strong>
                  <span>{t('singleProduct.benefits.payment')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
