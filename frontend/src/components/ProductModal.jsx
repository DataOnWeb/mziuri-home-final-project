import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { CiHeart, CiDeliveryTruck, CiCreditCard1  } from 'react-icons/ci';
import { PiShoppingCartThin } from 'react-icons/pi';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { IoChevronDown } from 'react-icons/io5';
import { BsPostcard } from "react-icons/bs";
import { FaArrowsRotate } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
const ProductModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Medium Size & Poot');
  const [selectedColor, setSelectedColor] = useState('Black & White');
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
    const navigate = useNavigate();
    const handleNavigation = (path) => {
      navigate(path);
    };
  if (!isOpen || !product) return null;

  const { _id, title, price, rating, image, description, category } = product;

  // Default options that match your screenshot
  const sizeOptions = [
    'Medium Size & Poot',
    'Large Size With Poot', 
    'Small Size With Poot'
  ];

  const colorOptions = [
    'Black & White',
    'Green & Brown',
    'Blue & Gray'
  ];

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
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: _id,
      title,
      price,
      image,
      quantity,
      selectedSize,
      selectedColor
    };
    console.log('Added to cart:', cartItem);

  };



  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };



  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <IoClose size={24} />
        </button>
        
        <div className="modal-body">
          <div className="modal-image-section">
            <div className="product-image-container">
              <img src={image} alt={title} className="product-image" />
            </div>
          </div>
          
          <div className="modal-details-section">
            <h2 className="product-title">{title}</h2>
            <div className="product-price">
              <span className="current-price">${price.toFixed(2)}</span>
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
                    onClick={() => setShowColorDropdown(!showColorDropdown)}
                  >
                    <span>{selectedColor}</span>
                    <IoChevronDown className={`dropdown-arrow ${showColorDropdown ? 'rotated' : ''}`} />
                  </div>
                  {showColorDropdown && (
                    <div className="dropdown-menu">
                      {colorOptions.map((color, index) => (
                        <div
                          key={index}
                          className={`dropdown-item ${selectedColor === color ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedColor(color);
                            setShowColorDropdown(false);
                          }}
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
                    onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                  >
                    <span>{selectedSize}</span>
                    <IoChevronDown className={`dropdown-arrow ${showSizeDropdown ? 'rotated' : ''}`} />
                  </div>
                  {showSizeDropdown && (
                    <div className="dropdown-menu">
                      {sizeOptions.map((size, index) => (
                        <div
                          key={index}
                          className={`dropdown-item ${selectedSize === size ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedSize(size);
                            setShowSizeDropdown(false);
                          }}
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
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.</p>
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
              
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                ADD TO CART
              </button>
              
              <button className="wishlist-btn" onClick={() => handleNavigation('/wishlist')}>
                <CiHeart size={20} />
              </button>
              
              <button className="compare-btn" onClick={() => handleNavigation('/compare')}>
                <FaArrowsRotate size={15}/>
              </button>
            </div>
            
            <div className="product-features">
              <div className="feature">
                <div className="feature-icon">
                  <div className="feature-icon">
                  <CiDeliveryTruck size={40}/>
                </div>
                </div>
                <div className="feature-content">
                  <strong>Free</strong>
                  <span>Shipping</span>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                   <CiCreditCard1 size={40}/>
                </div>
                <div className="feature-content">
                  <strong>Safe</strong>
                  <span>Payment</span>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">
                  <BsPostcard size={37}/>
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