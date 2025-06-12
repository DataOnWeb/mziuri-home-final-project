import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCreditCard,
  faTruckFast,
  faHeart,
  faAddressCard,
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faTumblr, faDribbble } from '@fortawesome/free-brands-svg-icons';
import RouteBanner from '../components/RouteBanner';
import Product from '../components/Product';
import CommentsSection from '../components/CommentsSection';
import { getProducts, getProduct } from '../api/api';
import { useLoader } from '../hooks/useLoader';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext'; // Add currency context

const SingleProduct = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { formatPrice, getPriceInCurrentCurrency } = useCurrency(); // Add currency hooks
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
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const { loading, useDataLoader } = useLoader();

  // Updated helper function to get formatted price using currency context
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
              const sameCategory = allProducts.filter(
                (p) => p._id !== id && p.category === productData.category
              );

              if (sameCategory.length >= 4) {
                setRelatedProducts(sameCategory.slice(0, 4));
              } else {
                const otherProducts = allProducts
                  .filter((p) => p._id !== id && p.category !== productData.category)
                  .slice(0, 4 - sameCategory.length);

                setRelatedProducts([...sameCategory, ...otherProducts]);
              }
            }
          } catch (productsError) {
            if (isMounted) {
              setRelatedProducts([]);
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || t('product.errorFetching'));
        }
      }
    };

    fetchData();

    document.title = 'Single Product Variable - Pronia';
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
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="product-detail__loading">
        <div>{t('product.loading')}</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail__not-found">
        <h1>{t('product.notFound')}</h1>
        <p>{t('product.notFoundDescription')}</p>
        <Link
          to="/shop"
          className="btn-primary"
        >
          {t('product.backToShop')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <RouteBanner title="singleproduct" />
      <div className="product-detail">
        <div className="product-detail__container">
          <div className="product-detail__images">
            <div className="product-detail__main-image">
              <img
                src={product.image}
                alt={product.title?.[i18n.language] || product.title?.en || product.title}
              />
            </div>
            <div className="product-detail__thumbnails">
              <div
                className={`product-detail__thumbnail ${selectedThumbnail === 0 ? 'active' : ''}`}
                onClick={() => setSelectedThumbnail(0)}
              >
                <img
                  src={product.image}
                  alt={`${product.title?.[i18n.language] || product.title?.en || product.title} ${t('product.view')} 1`}
                />
              </div>
              <div
                className={`product-detail__thumbnail ${selectedThumbnail === 1 ? 'active' : ''}`}
                onClick={() => setSelectedThumbnail(1)}
              >
                <img
                  src={product.image}
                  alt={`${product.title?.[i18n.language] || product.title?.en || product.title} ${t('product.view')} 2`}
                />
              </div>
              <div
                className={`product-detail__thumbnail ${selectedThumbnail === 2 ? 'active' : ''}`}
                onClick={() => setSelectedThumbnail(2)}
              >
                <img
                  src={product.image}
                  alt={`${product.title?.[i18n.language] || product.title?.en || product.title} ${t('product.view')} 3`}
                />
              </div>
            </div>
          </div>

          <div className="product-detail__info">
            <h1 className="product-detail__title">
              {product.title?.[i18n.language] || product.title?.en || product.title}
            </h1>
            <div className="product-detail__price">
              {getFormattedPrice(product.price)}
            </div>

            <div className="product-detail__rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < (product.rating || 0) ? 'star active' : 'star'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="review-count">(1 review)</span>
            </div>

            <div className="product-detail__options">
              <div className="option">
                <div className="option__label">Product Color</div>
                <div className="option__value">
                  <p>{product.color || t('product.na')}</p> <span className="check">✓</span>
                </div>
              </div>

              <div className="option">
                <div className="option__label">Product Size</div>
                <div className="option__value">
                  {product.category || t('product.na')} <span className="check">✓</span>
                </div>
              </div>
            </div>

            <div className="product-detail__description">
              <p>
                {product.description?.[i18n.language] ||
                  product.description?.en ||
                  t('product.defaultDescription')}
              </p>
            </div>

            <div className="product-detail__actions">
              <div className="quantity-selector">
                <button
                  className="quantity-btn minus"
                  onClick={decreaseQuantity}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                />
                <button
                  className="quantity-btn plus"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>

              <button className="add-to-cart-btn">Add To Cart</button>

              <button className="wishlist-btn">
                <FontAwesomeIcon icon={faHeart} />
              </button>

              <button className="compare-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 3 21 3 21 8"></polyline>
                  <line
                    x1="4"
                    y1="20"
                    x2="21"
                    y2="3"
                  ></line>
                  <polyline points="21 16 21 21 16 21"></polyline>
                  <line
                    x1="15"
                    y1="15"
                    x2="21"
                    y2="21"
                  ></line>
                  <line
                    x1="4"
                    y1="4"
                    x2="9"
                    y2="9"
                  ></line>
                </svg>
              </button>
            </div>

            <div className="product-detail__benefits">
              <div className="benefit">
                <div className="benefit__icon">
                  <FontAwesomeIcon icon={faTruckFast} />
                </div>
                <div className="benefit__text">
                  <div className="benefit__title">Free</div>
                  <div className="benefit__subtitle">Shipping</div>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit__icon">
                  <FontAwesomeIcon icon={faCreditCard} />
                </div>
                <div className="benefit__text">
                  <div className="benefit__title">Safe</div>
                  <div className="benefit__subtitle">Payment</div>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit__icon">
                  <FontAwesomeIcon icon={faAddressCard} />
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
                <span className="meta-item__label">Product Categories:</span>
                <span className="meta-item__value">
                  {product.category || t('product.uncategorized')}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-item__label">Product Tags:</span>
                <span className="meta-item__value">Product Furtniture</span>
              </div>
              <div className="meta-item">
                <span className="meta-item__label">Share Product:</span>
                <div className="social-icons">
                  <a
                    href="#"
                    className="social-icon"
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a
                    href="#"
                    className="social-icon"
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a
                    href="#"
                    className="social-icon"
                  >
                    <FontAwesomeIcon icon={faTumblr} />
                  </a>
                  <a
                    href="#"
                    className="social-icon"
                  >
                    <FontAwesomeIcon icon={faDribbble} />
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
              Product Information
            </button>
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Product Description
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Product Reviews(3)
            </button>
          </div>

          <div className="product-tabs__content">
            {activeTab === 'information' && (
              <div className="tab-content">
                <h3>Product Shipping</h3>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et eaque fugit dolore
                  reiciendis quos aut praesentium tempora tenetur distinctio atque.
                </p>
                <h3>About Product</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus sit culpa iusto
                  provident modi placeat ipsum rem optio possimus blanditiis!
                </p>
                <h3>Guarranteed Product</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit consectetur
                  explicabo expedita soluta illo recusandae quisquam adipisci dolorum ex quia.
                </p>
              </div>
            )}

            {activeTab === 'description' && (
              <div className="tab-content">
                <p>
                  {product.description?.[i18n.language] ||
                    product.description?.en ||
                    t('product.defaultDescription')}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="comment-container">
                <CommentsSection />
                <h2 className="comment-title">Leave a Comment</h2>
                <form
                  className="comment-form"
                  onSubmit={handleSubmit}
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label
                        htmlFor="name"
                        className="form-label required"
                      ></label>
                      <input
                        type="text"
                        className="form-input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="email"
                        className="form-label required"
                      ></label>
                      <input
                        type="email"
                        className="form-input"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="subject"
                      className="form-label"
                    ></label>
                    <input
                      type="text"
                      className="form-input"
                      name="subject"
                      value={formData.subject}
                      placeholder="Subject"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="message"
                      className="form-label"
                    ></label>
                    <textarea
                      className="form-textarea"
                      name="message"
                      value={formData.message}
                      placeholder="Message"
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="submit-button"
                  >
                    Post Your Comment
                  </button>
                </form>
                {showSuccess && <div className="success-message">Posted Succesfully</div>}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2 className="related-products__title">Related Products</h2>
            <p className="related-products__subtitle">Find Your related products</p>

            <div className="related-products__grid">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Product
                  key={relatedProduct._id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SingleProduct;