import React, { useState, useEffect } from 'react';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';

const Checkout = () => {
  const [formData, setFormData] = useState({
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
  });

  const { useFakeLoader } = useLoader();
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Order placed:', formData);
  };
  useEffect(() => {
    useFakeLoader();
    document.title = 'Checkout - Pronia';
  }, []);

  return (
    <div>
      <RouteBanner title="checkout" />
      <div className="checkout-container">
        <div className="checkout-header">
          <div className="header-links">
            <p>
              <span className="return-customer">
                📋 Returning customer? <a href="/login">Click here to login</a>
              </span>
            </p>
            <p>
              <span className="coupon-link">
                📋 Have a coupon? <a href="#coupon">Click here to enter your code</a>
              </span>
            </p>
          </div>
        </div>

        <div className="checkout-content">
          <div className="billing-section">
            <h2>BILLING DETAILS</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="country">Country *</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="apartment"
                  name="apartment"
                  placeholder="Apartment, suite, unit etc. (optional)"
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">Town / City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="state">State / County *</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="postcode">Postcode / Zip *</label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
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
                <label htmlFor="createAccount">Create an account?</label>
              </div>

              <div className="ship-different-section">
                <h3>SHIP TO A DIFFERENT ADDRESS?</h3>
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="shipToDifferent"
                    name="shipToDifferent"
                    checked={formData.shipToDifferent}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="shipToDifferent"></label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="orderNotes">Order Notes</label>
                <textarea
                  id="orderNotes"
                  name="orderNotes"
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  rows="4"
                />
              </div>
            </form>
          </div>

          <div className="order-summary">
            <div className="order-box">
              <h3>YOUR ORDER</h3>

              <div className="order-header">
                <div className="product-col">PRODUCT</div>
                <div className="total-col">TOTAL</div>
              </div>

              <div className="order-item">
                <div className="product-name">
                  Vestibulum suscipit <span className="quantity">× 1</span>
                </div>
                <div className="product-price">$165.00</div>
              </div>

              <div className="order-item">
                <div className="product-name">
                  Vestibulum suscipit <span className="quantity">× 1</span>
                </div>
                <div className="product-price">$165.00</div>
              </div>

              <div className="order-totals">
                <div className="subtotal">
                  <div className="label">Cart Subtotal</div>
                  <div className="amount">$215.00</div>
                </div>

                <div className="total">
                  <div className="label">Order Total</div>
                  <div className="amount">$215.00</div>
                </div>
              </div>

              <div className="payment-methods">
                <div className="payment-method bank-transfer">
                  <a>Direct Bank Transfer.</a>
                </div>
                <div className="payment-description">
                  Make your payment directly into our bank account. Please use your Order ID as the
                  payment reference. Your order won't be shipped until the funds have cleared in our
                  account.
                </div>

                <div className="payment-method">
                  <a>Cheque Payment</a>
                </div>
                <div className="payment-method">
                  <a>PayPal</a>
                </div>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                onClick={handleSubmit}
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
