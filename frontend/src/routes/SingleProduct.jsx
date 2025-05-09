import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faTruckFast, faHeart, faAddressCard} from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faTumblr, faDribbble} from "@fortawesome/free-brands-svg-icons";
import RouteBanner from '../components/RouteBanner';
import Product from '../components/Product'; 
import CommentsSection from '../components/CommentsSection';
import { getProducts, getProduct } from '../api/api';
import { useLoader } from '../hooks/useLoader';

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  

  const { loading, useDataLoader } = useLoader();
  
  useEffect(() => {

    let isMounted = true;
    
    const fetchData = async () => {
      try {

        const productData = await useDataLoader(() => getProduct(id));
        
        if (isMounted && productData) {
          setProduct(productData);
          

          try {
            const allProducts = await useDataLoader(() => getProducts());
            
            if (isMounted && allProducts && Array.isArray(allProducts)) {
       
              const sameCategory = allProducts
                .filter(p => p._id !== id && p.category === productData.category);
              
     
              if (sameCategory.length >= 4) {
                setRelatedProducts(sameCategory.slice(0, 4));
              } 

              else {
                const otherProducts = allProducts
                  .filter(p => p._id !== id && p.category !== productData.category)
                  .slice(0, 4 - sameCategory.length);
                
                setRelatedProducts([...sameCategory, ...otherProducts]);
              }
            }
          } catch (productsError) {
            console.error("Error fetching related products:", productsError);
            if (isMounted) {
              setRelatedProducts([]);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        if (isMounted) {
          setError(err.message || 'An error occurred while fetching the product');
        }
      }
    };
    
    fetchData();
    
   
    document.title = 'Pronia - Single Product Variable';
    window.scrollTo(0, 0);
    

    return () => {
      isMounted = false;
    };
  }, [id]);
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  if (loading) {
    return (
      <div className="product-detail__loading">
        <div>Loading product...</div>
      </div>
    );
  }
  
  if (error || !product) {
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
          <div className="product-detail__price">${product.price ? product.price.toFixed(2) : '0.00'}</div>
          
          <div className="product-detail__rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < (product.rating || 0) ? "star active" : "star"}>★</span>
              ))}
            </div>
            <span className="review-count">({1} Review)</span>
          </div>
          
          <div className="product-detail__options">
            <div className="option">
              <div className="option__label">Color</div>
              <div className="option__value"><p>{product.color || 'N/A'}</p> <span className="check">✓</span>
              </div>
            </div>
            
            <div className="option">
              <div className="option__label">Size</div>
              <div className="option__value">{product.category || 'N/A'} <span className="check">✓</span>
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
              <span className="meta-item__value">{product.category || 'Uncategorized'}</span>
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
      
      <div className="product-tabs">
        <div className="product-tabs__header">
          <button 
            className={`tab-btn ${activeTab === 'information' ? 'active' : ''}`}
            onClick={() => setActiveTab('information')}
          >
            Information
          </button>
          <button 
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews(3)
          </button>
        </div>
        
        <div className="product-tabs__content">
          {activeTab === 'information' && (
            <div className="tab-content">
              <h3>Shipping</h3>
              <p>The item will be shipped from China. So it need 15-20 days to deliver. Our product is good with reasonable price and we believe you will worth it. So please wait for it patiently! Thanks.Any question please kindly to contact us and we promise to work hard to help you to solve the problem</p>               
              <h3>About return request</h3>
              <p>If you don't need the item with worry, you can contact us then we will help you to solve the problem, so please close the return request! Thanks</p>               
              <h3>Guarrantee</h3>
              <p>If it is the quality question, we will resend or refund to you; If you receive damaged or wrong items, please contact us and attach some pictures about product, we will exchange a new correct item to you after the confirmation.</p>
            </div>
          )}
          
          {activeTab === 'description' && (
            <div className="tab-content">
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incidid ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non pro</p>
            </div>
          )}
          
          {activeTab === 'reviews' && (
           <div className="comment-container">
            <CommentsSection/>
           <h2 className="comment-title">Leave a comment</h2>
           <form className="comment-form" onSubmit={handleSubmit}>
             <div className="form-row">
               <div className="form-group">
                 <label htmlFor="name" className="form-label required"></label>
                 <input
                   type="text"
                   className="form-input"
                   name="name"
                   value={formData.name}
                   onChange={handleChange}
                   placeholder='Your Name*'
                   required
                 />
               </div>
               <div className="form-group">
                 <label htmlFor="email" className="form-label required"></label>
                 <input
                   type="email"
                   className="form-input"
                   name="email"
                   value={formData.email}
                   onChange={handleChange}
                   placeholder='Your Email*'
                   required
                 />
               </div>
             </div>
             <div className="form-group">
               <label htmlFor="subject" className="form-label"></label>
               <input
                 type="text"
                 className="form-input"
                 name="subject"
                 value={formData.subject}
                 placeholder='Subject (Optional)'
                 onChange={handleChange}
               />
             </div>
             <div className="form-group">
               <label htmlFor="message" className="form-label"></label>
               <textarea
                 className="form-textarea"
                 name="message"
                 value={formData.message}
                 placeholder='Message'
                 onChange={handleChange}
               ></textarea>
             </div>
             <button type="submit" className="submit-button">POST COMMENT</button>
           </form>
           {showSuccess && (
             <div className="success-message">
               Your comment has been submitted successfully!
             </div>
           )}
         </div>
          )}
        </div>
        
      </div>
 
      {/* Only show related products section if we have products to display */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2 className="related-products__title">RELATED PRODUCTS</h2>
          <p className="related-products__subtitle">
            Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots
            in a piece of classical Latin literature
          </p>
          
          <div className="related-products__grid">
            {relatedProducts.slice(0, 4).map(relatedProduct => (
              <Product key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default SingleProduct;