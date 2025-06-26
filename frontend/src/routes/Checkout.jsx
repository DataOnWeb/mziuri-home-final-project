import React, { useState, useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { getCart, removeFromCart } from '../api/api';
import { validateFullName, validateEmail, validateSelect } from '../utils/validations';

const Checkout = () => {
  const initialFormState = {
    country: 'Bangladesh',
    firstName: '',
    lastName: '',
    companyName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postcode: '',
    email: '',
    phone: '',
    createAccount: false,
    shipToDifferent: false,
    orderNotes: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [cartItems, setCartItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const { useDataLoader } = useLoader();
  const { t, i18n } = useTranslation();
  const { formatPrice, getPriceInCurrentCurrency } = useCurrency();

  const validateRequired = (value, fieldName) => {
    if (!value || value.trim() === '') {
      return `${fieldName} is required`;
    }
    return null;
  };

  const validatePhone = (value) => {
    if (!value) {
      return 'Phone number is required';
    }
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  };

  const validatePostcode = (value) => {
    if (!value) {
      return 'Postcode is required';
    }
    if (value.length < 3) {
      return 'Please enter a valid postcode';
    }
    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    const firstNameError = validateRequired(formData.firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validateRequired(formData.lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;

    const addressError = validateRequired(formData.address, 'Address');
    if (addressError) newErrors.address = addressError;

    const cityError = validateRequired(formData.city, 'City');
    if (cityError) newErrors.city = cityError;

    const stateError = validateRequired(formData.state, 'State');
    if (stateError) newErrors.state = stateError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const postcodeError = validatePostcode(formData.postcode);
    if (postcodeError) newErrors.postcode = postcodeError;

    const countryError = validateSelect(formData.country);
    if (countryError) newErrors.country = countryError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    try {
      const orderData = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: cartItems.map(item => ({
          productId: item.productId._id,
          title: getLocalizedText(item.productId.title),
          quantity: item.quantity,
          price: getPriceInCurrentCurrency(item.productId.price)
        })),
        shippingAddress: {
          country: formData.country,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode
        },
        totalAmount: subtotal,
        status: 'completed',
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        }
      };

      const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
      const updatedOrders = [...existingOrders, orderData];
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

      for (const item of cartItems) {
        try {
          await removeFromCart(item.productId._id);
        } catch (error) {
          console.error(`Failed to remove item ${item.productId._id} from cart:`, error);
        }
      }

      setCartItems([]);
      setFormData(initialFormState);
      setErrors({});
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Order failed:', error);
      setErrors({ form: 'Failed to place order. Please try again.' });
    }
  };

  const getLocalizedText = (textObj) => {
    if (typeof textObj === 'string') return textObj;
    if (textObj && typeof textObj === 'object') {
      return textObj[i18n.language] || textObj.en || Object.values(textObj)[0] || '';
    }
    return '';
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await useDataLoader(getCart);
        setCartItems(response.cart || []);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    document.title = `${t('checkout.title')} - Pronia`;
  }, [i18n.language]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = getPriceInCurrentCurrency(item.productId.price);
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="checkout-page">
      <RouteBanner title={t('checkout.title')} />

      {/* Success Message */}
      {showSuccess && (
        <div
          className="success-message"
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#a4ce6a',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            animation: 'slideInRight 0.3s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>✓</span>
            <span>{t('checkout.orderSuccess') || 'Order placed successfully!'}</span>
          </div>
        </div>
      )}

      <div className="checkout-container">
        <div className="checkout-header">
          <div className="header-links">
            <p>
              <span className="return-customer">
                {t('checkout.returningCustomer')} <a href="/login">{t('checkout.loginHere')}</a>
              </span>
            </p>
            <p>
              <span className="coupon-link">
                {t('checkout.haveCoupon')} <a href="#coupon">{t('checkout.enterCode')}</a>
              </span>
            </p>
          </div>
        </div>

        <div className="checkout-content">
          <div className="billing-section">
            <h2>{t('checkout.billingDetails')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="country">{t('checkout.country')} *</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={errors.country ? 'error' : ''}
                  required
                >
                  <option value="Bangladesh">{t('countries.bangladesh')}</option>
                  <option value="United States">{t('countries.usa')}</option>
                  <option value="United Kingdom">{t('countries.uk')}</option>
                  <option value="Canada">{t('countries.canada')}</option>
                  <option value="Australia">{t('countries.australia')}</option>
                  <option value="India">{t('countries.india')}</option>
                  <option value="Germany">{t('countries.germany')}</option>
                  <option value="France">{t('countries.france')}</option>
                </select>
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="firstName">{t('checkout.firstName')} *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? 'error' : ''}
                    required
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="form-group half">
                  <label htmlFor="lastName">{t('checkout.lastName')} *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? 'error' : ''}
                    required
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="companyName">{t('checkout.companyName')}</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">{t('checkout.address')} *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder={t('checkout.streetAddress')}
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  required
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  placeholder={t('checkout.apartmentPlaceholder')}
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">{t('checkout.city')} *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                  required
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="state">{t('checkout.state')} *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={errors.state ? 'error' : ''}
                    required
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
                <div className="form-group half">
                  <label htmlFor="postcode">{t('checkout.postcode')} *</label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    className={errors.postcode ? 'error' : ''}
                    required
                  />
                  {errors.postcode && <span className="error-message">{errors.postcode}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="email">{t('checkout.email')} *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    required
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="form-group half">
                  <label htmlFor="phone">{t('checkout.phone')} *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    required
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="createAccount"
                  name="createAccount"
                  checked={formData.createAccount}
                  onChange={handleInputChange}
                />
                <label htmlFor="createAccount">{t('checkout.createAccount')}</label>
              </div>

              <div className="ship-different-section">
                <h3>{t('checkout.shipDifferent')}</h3>
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="shipToDifferent"
                    name="shipToDifferent"
                    checked={formData.shipToDifferent}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="shipToDifferent">{t('checkout.shipToDifferentAddress')}</label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="orderNotes">{t('checkout.orderNotes')}</label>
                <textarea
                  id="orderNotes"
                  name="orderNotes"
                  placeholder={t('checkout.orderNotesPlaceholder')}
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
            </form>
          </div>

          <div className="order-summary">
            <div className="order-box">
              <h3>{t('checkout.yourOrder')}</h3>

              <div className="order-header">
                <div className="product-col">{t('checkout.product')}</div>
                <div className="total-col">{t('checkout.total')}</div>
              </div>

              {loading ? (
                <div className="loading-message">Loading cart...</div>
              ) : cartItems.length === 0 ? (
                <div className="empty-cart-message">Your cart is empty</div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.productId._id}
                    className="order-item"
                  >
                    <div className="product-name">
                      {getLocalizedText(item.productId.title)}{' '}
                      <span className="quantity">× {item.quantity}</span>
                    </div>
                    <div className="product-price">
                      {formatPrice(getPriceInCurrentCurrency(item.productId.price) * item.quantity)}
                    </div>
                  </div>
                ))
              )}

              <div className="order-totals">
                <div className="subtotal">
                  <div className="label">{t('checkout.cartSubtotal')}</div>
                  <div className="amount">{formatPrice(subtotal)}</div>
                </div>

                <div className="total">
                  <div className="label">{t('checkout.orderTotal')}</div>
                  <div className="amount">{formatPrice(subtotal)}</div>
                </div>
              </div>

              <div className="payment-methods">
                <div className="payment-method bank-transfer">
                  <a>{t('checkout.bankTransfer')}</a>
                </div>
                <div className="payment-description">{t('checkout.bankTransferDescription')}</div>

                <div className="payment-method">
                  <a>{t('checkout.chequePayment')}</a>
                </div>
                <div className="payment-method">
                  <a>{t('checkout.paypal')}</a>
                </div>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                onClick={handleSubmit}
                disabled={loading || cartItems.length === 0}
              >
                {loading ? 'Loading...' : t('checkout.placeOrder')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        .checkout-page .error {
          border-color: #dc3545 !important;
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
        
        .checkout-page .error-message {
          color: #dc3545;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
        }
        
        .success-message {
          animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .checkout-page .loading-message, 
        .checkout-page .empty-cart-message {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        
        .checkout-page .place-order-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        `}
      </style>
    </div>
  );
};

export default Checkout;