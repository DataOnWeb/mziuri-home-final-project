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
const ProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Medium Size & Poot');
  const [selectedColor, setSelectedColor] = useState('Black & White');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const { i18n } = useTranslation();

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

  // Default options that match your screenshot
  const sizeOptions = ['Medium Size & Poot', 'Large Size With Poot', 'Small Size With Poot'];
  const colorOptions = ['Black & White', 'Green & Brown', 'Blue & Gray'];

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

  const handleAddToCart = () => {
    const cartItem = {
      id: _id,
      title: title?.[i18n.language] || title?.en || 'No title',
      price: localizedPrice,
      image,
      quantity,
      selectedSize,
      selectedColor,
    };
    console.log('Added to cart:', cartItem);
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
                src={image}
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
              <span className="rating-count">( 1 Review )</span>
            </div>

            <div className="product-options">
              <div className="option-group">
                <label>Color</label>
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
                <label>Size</label>
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
                ADD TO CART
              </button>

              <button
                className="wishlist-btn"
                onClick={() => handleNavigation('/wishlist')}
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
                  <strong>Free</strong>
                  <span>Shipping</span>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <CiCreditCard1 size={40} />
                </div>
                <div className="feature-content">
                  <strong>Safe</strong>
                  <span>Payment</span>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <BsPostcard size={37} />
                </div>
                <div className="feature-content">
                  <strong>Safe</strong>
                  <span>Payment</span>
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
