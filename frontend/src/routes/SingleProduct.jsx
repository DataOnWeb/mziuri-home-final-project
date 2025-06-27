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
import { useCurrency } from '../context/CurrencyContext';
import { addToCart, addToWishlist } from '../api/api';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';
import { useUserData } from '../context/UserContext'; 

const SingleProduct = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { formatPrice, getPriceInCurrentCurrency } = useCurrency();
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
  const { isLoggedIn } = useUserData();
  const { loading, useDataLoader } = useLoader();

  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };
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

    document.title = t('singleProduct.pageTitle');
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [id, t]);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id, quantity);
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        navigate('/login');
      } else {
        alert(t('product.failedToAddToCart'));
      }
    }
  };


  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      await addToWishlist(product._id);
      navigate('/wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        navigate('/login');
      } else if (error.message.includes('already in your wishlist')) {
        alert(t('This product is already in your wishlist!'));
      } else {
        alert(t('Failed to add to wishlist'));
      }
    }
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
                src={`/productImg/product${product.image}.jpg`}
                alt={product.title?.[i18n.language] || product.title?.en || product.title}
              />
            </div>
            <div className="product-detail__thumbnails">
              <div
                className={`product-detail__thumbnail ${selectedThumbnail === 0 ? 'active' : ''}`}
                onClick={() => setSelectedThumbnail(0)}
              >
                <img
                  src={`/productImg/product${product.image}.jpg`}
                  alt={`${product.title?.[i18n.language] || product.title?.en || product.title} ${t('product.view')} 1`}
                />
              </div>
              <div
                className={`product-detail__thumbnail ${selectedThumbnail === 1 ? 'active' : ''}`}
                onClick={() => setSelectedThumbnail(1)}
              >
                <img
                  src={`/productImg/product${product.image}.jpg`}
                  alt={`${product.title?.[i18n.language] || product.title?.en || product.title} ${t('product.view')} 2`}
                />
              </div>
              <div
                className={`product-detail__thumbnail ${selectedThumbnail === 2 ? 'active' : ''}`}
                onClick={() => setSelectedThumbnail(2)}
              >
                <img
                  src={`/productImg/product${product.image}.jpg`}
                  alt={`${product.title?.[i18n.language] || product.title?.en || product.title} ${t('product.view')} 3`}
                />
              </div>
            </div>
          </div>

          <div className="product-detail__info">
            <h1 className="product-detail__title">
              {product.title?.[i18n.language] || product.title?.en || product.title}
            </h1>
            <div className="product-detail__price">{getFormattedPrice(product.price)}</div>

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
              <span className="review-count">{t('singleProduct.reviewCount', { count: 1 })}</span>
            </div>

            <div className="product-detail__options">
              <div className="option">
                <div className="option__label">{t('singleProduct.productColor')}</div>
                <div className="option__value">
                  <p>{product.color || t('product.na')}</p> <span className="check">✓</span>
                </div>
              </div>

              <div className="option">
                <div className="option__label">{t('singleProduct.productSize')}</div>
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
                <FontAwesomeIcon icon={faHeart} />
              </button>

              <button
                className="compare-btn"
                onClick={() => handleNavigation('/compare')}
              >
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
                  <div className="benefit__title">{t('singleProduct.benefits.free')}</div>
                  <div className="benefit__subtitle">{t('singleProduct.benefits.shipping')}</div>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit__icon">
                  <FontAwesomeIcon icon={faCreditCard} />
                </div>
                <div className="benefit__text">
                  <div className="benefit__title">{t('singleProduct.benefits.safe')}</div>
                  <div className="benefit__subtitle">{t('singleProduct.benefits.payment')}</div>
                </div>
              </div>

              <div className="benefit">
                <div className="benefit__icon">
                  <FontAwesomeIcon icon={faAddressCard} />
                </div>
                <div className="benefit__text">
                  <div className="benefit__title">{t('singleProduct.benefits.safe')}</div>
                  <div className="benefit__subtitle">{t('singleProduct.benefits.payment')}</div>
                </div>
              </div>
            </div>

            <div className="product-detail__meta">
              <div className="meta-item">
                <span className="meta-item__label">{t('singleProduct.meta.sku')}:</span>
                <span className="meta-item__value">Ch-256xl</span>
              </div>
              <div className="meta-item">
                <span className="meta-item__label">{t('singleProduct.meta.categories')}:</span>
                <span className="meta-item__value">
                  {product.category || t('product.uncategorized')}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-item__label">{t('singleProduct.meta.tags')}:</span>
                <span className="meta-item__value">{t('singleProduct.meta.tagsValue')}</span>
              </div>
              <div className="meta-item">
                <span className="meta-item__label">{t('singleProduct.meta.share')}:</span>
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
              {t('singleProduct.tabs.information')}
            </button>
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              {t('singleProduct.tabs.description')}
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              {t('singleProduct.tabs.reviews')}
            </button>
          </div>

          <div className="product-tabs__content">
            {activeTab === 'information' && (
              <div className="tab-content">
                <h3>{t('singleProduct.information.shippingTitle')}</h3>
                <p>{t('singleProduct.information.shippingText')}</p>
                <h3>{t('singleProduct.information.aboutTitle')}</h3>
                <p>{t('singleProduct.information.aboutText')}</p>
                <h3>{t('singleProduct.information.guaranteeTitle')}</h3>
                <p>{t('singleProduct.information.guaranteeText')}</p>
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
                <h2 className="comment-title">{t('singleProduct.comments.title')}</h2>
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
                        placeholder={t('singleProduct.comments.namePlaceholder')}
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
                        placeholder={t('singleProduct.comments.emailPlaceholder')}
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
                      placeholder={t('singleProduct.comments.subjectPlaceholder')}
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
                      placeholder={t('singleProduct.comments.messagePlaceholder')}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="submit-button"
                  >
                    {t('singleProduct.comments.submitButton')}
                  </button>
                </form>
                {showSuccess && (
                  <div className="success-message">
                    {t('singleProduct.comments.successMessage')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2 className="related-products__title">{t('singleProduct.relatedProducts.title')}</h2>
            <p className="related-products__subtitle">
              {t('singleProduct.relatedProducts.subtitle')}
            </p>

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
      <ScrollToTop
        showAfter={500}
        smooth={true}
      />
    </>
  );
};

export default SingleProduct;
