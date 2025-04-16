
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/data';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faTruckFast, faHeart, faAddressCard} from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faTumblr, faDribbble} from "@fortawesome/free-brands-svg-icons";
import RouteBanner from '../components/RouteBanner';
const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  
  useEffect(() => {
    document.title = 'Pronia - Single Product Variable'
    const productId = parseInt(id);
    const foundProduct = products.find(p => p.id === productId);
    
  
    setTimeout(() => {
      setProduct(foundProduct);
      setLoading(false);
    }, 300);
    

    window.scrollTo(0, 0);
  }, [id]);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  if (loading) {
    return (
      <div className="product-detail__loading">
        <div>Loading product...</div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="product-detail__not-found">
        <h1>Product not found</h1>
        <p>The product you're looking for does not exist.</p>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }
  
  return (
    <>
    <RouteBanner title="Single Product"/>
    <div className="product-detail">
      
      <div className="product-detail__container">
        <div className="product-detail__images">
          <div className="product-detail__main-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="product-detail__thumbnails">
            <div className={`product-detail__thumbnail ${selectedThumbnail === 0 ? 'active' : ''}`} onClick={() => setSelectedThumbnail(0)}>
              <img src={product.image} alt={`${product.title} view 1`} />
            </div>
            <div className={`product-detail__thumbnail ${selectedThumbnail === 1 ? 'active' : ''}`} onClick={() => setSelectedThumbnail(1)}>
              <img src={product.image} alt={`${product.title} view 2`} />
            </div>
            <div className={`product-detail__thumbnail ${selectedThumbnail === 2 ? 'active' : ''}`} onClick={() => setSelectedThumbnail(2)}>
              <img src={product.image} alt={`${product.title} view 3`} />
            </div>
          </div>
        </div>
    
        <div className="product-detail__info">
          <h1 className="product-detail__title">{product.title}</h1>
          <div className="product-detail__price">${product.price.toFixed(2)}</div>
          
          <div className="product-detail__rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < product.rating ? "star active" : "star"}>★</span>
              ))}
            </div>
            <span className="review-count">({1} Review)</span>
          </div>
          
          <div className="product-detail__options">
            <div className="option">
              <div className="option__label">Color</div>
              <div className="option__value">
                Black & White <span className="check">✓</span>
              </div>
            </div>
            
            <div className="option">
              <div className="option__label">Size</div>
              <div className="option__value">
                Medium Size & Pot <span className="check">✓</span>
              </div>
            </div>
          </div>
          
          <div className="product-detail__description">
            <p>Lorem ipsum dolor sit amet, consectetur adipisic elit, sed do eiusmod tempo incid ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostru exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate</p>
          </div>
          
          <div className="product-detail__actions">
            <div className="quantity-selector">
              <button className="quantity-btn minus" onClick={decreaseQuantity}>−</button>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} />
              <button className="quantity-btn plus" onClick={increaseQuantity}>+</button>
            </div>
            
            <button className="add-to-cart-btn">ADD TO CART</button>
            
            <button className="wishlist-btn">
              <FontAwesomeIcon icon={faHeart}/>
            </button>
            
            <button className="compare-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8"></polyline>
                <line x1="4" y1="20" x2="21" y2="3"></line>
                <polyline points="21 16 21 21 16 21"></polyline>
                <line x1="15" y1="15" x2="21" y2="21"></line>
                <line x1="4" y1="4" x2="9" y2="9"></line>
              </svg>
            </button>
          </div>
          
          <div className="product-detail__benefits">
            <div className="benefit">
              <div className="benefit__icon">
              <FontAwesomeIcon icon={faTruckFast}/>
              </div>
              <div className="benefit__text">
                <div className="benefit__title">Free</div>
                <div className="benefit__subtitle">Shipping</div>
              </div>
            </div>
            
            <div className="benefit">
              <div className="benefit__icon">
              <FontAwesomeIcon icon={faCreditCard}/>
              </div>
              <div className="benefit__text">
                <div className="benefit__title">Safe</div>
                <div className="benefit__subtitle">Payment</div>
              </div>
            </div>
            
            <div className="benefit">
              <div className="benefit__icon">
              <FontAwesomeIcon icon={faAddressCard}/>
              </div>
              <div className="benefit__text">
                <div className="benefit__title">Safe</div>
                <div className="benefit__subtitle">Payment</div>
              </div>
            </div>
          </div>
          
          <div className="product-detail__meta">
            <div className="meta-item">
              <span className="meta-item__label">SKU:</span>
              <span className="meta-item__value">Ch-256xl</span>
            </div>
            <div className="meta-item">
              <span className="meta-item__label">Categories:</span>
              <span className="meta-item__value">Office, Home</span>
            </div>
            <div className="meta-item">
              <span className="meta-item__label">Tags:</span>
              <span className="meta-item__value">Furniture</span>
            </div>
            <div className="meta-item">
              <span className="meta-item__label">Share:</span>
              <div className="social-icons">
                <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faFacebookF}/>
                </a>
                <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faTwitter}/>
                </a>
                <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faTumblr}/>
                </a>
                <a href="#" className="social-icon">
                <FontAwesomeIcon icon={faDribbble}/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetailPage;