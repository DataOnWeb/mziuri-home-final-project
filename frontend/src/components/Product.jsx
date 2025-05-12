import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CiHeart } from 'react-icons/ci';
import { PiEyeThin, PiShoppingCartThin } from 'react-icons/pi';
const Product = ({ product }) => {
  const { _id, title, price, rating, image } = product;

  const [isHovered, setIsHovered] = useState(false);

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

  return (
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
            onClick={() => console.log('Added to wishlist')}
          >
            <CiHeart size="25px" />
          </button>
          <button
            style={buttonStyle}
            className="view-btn"
            onClick={() => console.log('Quick view')}
          >
            <PiEyeThin size="25px" />
          </button>
          <button
            style={buttonStyle}
            className="cart-btn"
            onClick={() => console.log('Added to cart')}
          >
            <PiShoppingCartThin size="25px" />
          </button>
        </div>
      </div>

      <h3 className="product-title">{title}</h3>
      <p className="product-price">${price.toFixed(2)}</p>
      <div className="product-rating">{renderStars(rating)}</div>
    </div>
  );
};

export default Product;
