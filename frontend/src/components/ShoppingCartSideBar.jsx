import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/api';
import { useLoader } from '../hooks/useLoader';
import { useTranslation } from 'react-i18next';

const ShoppingCartSidebar = ({ isOpen, setIsOpen, currency = 'USD' }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { useDataLoader } = useLoader();
  const { i18n } = useTranslation();

  // Helper function to get price value based on currency
  const getProductPrice = (product) => {
    if (typeof product.price === 'object' && product.price !== null) {
      return product.price[currency] || product.price.USD || 0;
    }
    return typeof product.price === 'number' ? product.price : 0;
  };

  // Function to get currency symbol
  const getCurrencySymbol = (curr) => {
    const symbols = {
      USD: '$',
      EUR: '€',
      GEL: '₾',
    };
    return symbols[curr] || curr;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const allProducts = await useDataLoader(getProducts);
        const items = allProducts.slice(0, 3).map((product) => ({
          ...product,
          quantity: 1,
        }));
        setCartItems(items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const subtotal = cartItems
    .reduce((sum, item) => sum + getProductPrice(item) * item.quantity, 0)
    .toFixed(2);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const toCart = () => {
    handleNavigation('/cart');
    setIsOpen(false);
  };
  const toCheckout = () => {
    handleNavigation('/checkout');
    setIsOpen(false);
  };

  return (
    <div className="shopping-cart-sidebar">
      {/* Overlay */}
      {isOpen && (
        <div
          className="cart-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-content">
          {/* Header */}
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              <IoMdClose size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="cart-items">
            {loading ? (
              <div className="loading-indicator">Loading cart...</div>
            ) : cartItems.length > 0 ? (
              cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="cart-item"
                >
                  <div className="item-image">
                    <img
                      src={item.image}
                      alt={item.title?.[i18n.language] || item.title?.en || 'Product image'}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.title?.[i18n.language] || item.title?.en || 'No title'}</h3>
                    <p>
                      {item.quantity} × {getCurrencySymbol(currency)}
                      {getProductPrice(item).toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <IoMdClose size={20} />
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-cart">
                <p>Your cart is empty</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>
                  {getCurrencySymbol(currency)}
                  {subtotal}
                </span>
              </div>
              <button
                className="cart-sidebar-btn"
                onClick={toCart}
              >
                View Cart
              </button>
              <button
                className="checkout-btn"
                onClick={toCheckout}
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartSidebar;
