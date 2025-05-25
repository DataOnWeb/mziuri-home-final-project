import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CiHeart } from 'react-icons/ci';
import { PiEyeThin, PiShoppingCartThin } from 'react-icons/pi';
import ProductModal from './ProductModal'; // Import the modal component
import { useNavigate } from 'react-router-dom';
const Product = ({ product }) => {
  const { _id, title, price, rating, image } = product;

  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add modal state
  const navigate = useNavigate()
  const handleNavigation = (path) => {
    navigate(path)
  }
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

  // Modal handlers
  const handleQuickView = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);

  };



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
              alt={title}
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
              onClick={() => handleNavigation("/wishlist")}
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
              onClick={() => handleNavigation("/cart")}
              title="Add to Cart"
            >
              <PiShoppingCartThin size="25px" />
            </button>
          </div>
        </div>

        <h3 className="product-title">{title}</h3>
        <p className="product-price">${price.toFixed(2)}</p>
        <div className="product-rating">{renderStars(rating)}</div>
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