import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { id } = product
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? '' : 'inactive'}`}>
          ★
        </span>
      );
    }
    return stars;
  }; 

  return (
    <div 
      className="product-card"
    >
      <div className="product-image">
      <Link to={`/product/${id}`}>
      <img 
          src={product.image} 
          alt={product.title}
          onError={(e) => {
          }}
        />
        
      </Link>
        
        
        {isHovered && (
          <div className="product-actions">
            <button className="action-button like">♡</button>
            <button className="action-button view">👁</button>
            <button className="action-button cart">🛒</button>
          </div>
        )}
      </div>
      <h3 className="product-title">{product.title}</h3>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <div className="product-rating">
        {renderStars(product.rating)}
      </div>
    </div>
  );
};

export default Product;