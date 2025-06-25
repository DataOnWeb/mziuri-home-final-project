import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { getCart, removeFromCart, updateCartItem } from '../api/api';

const ShoppingCartSidebar = ({ isOpen, setIsOpen }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { formatPrice, getPriceInCurrentCurrency } = useCurrency();

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await getCart();
      setCartItems(response.cart || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

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

  const getNumericPrice = (priceObj) => {
    try {
      if (typeof priceObj === 'object' && priceObj !== null) {
        return getPriceInCurrentCurrency(priceObj);
      }
      const numericPrice = typeof priceObj === 'string' ? parseFloat(priceObj) : priceObj;
      return getPriceInCurrentCurrency(numericPrice);
    } catch (error) {
      console.error('Error getting numeric price:', error);
      return 0;
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setCartItems(prev => prev.filter(item => item.productId._id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      alert(t('Failed to remove item. Please try again.'));
      fetchCart(); // Refresh cart on error
    }
  };

  const handleQuantityChange = async (itemId, change) => {
    try {
      const item = cartItems.find(item => item.productId._id === itemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + change);
      await updateCartItem(itemId, newQuantity);
      setCartItems(prev => 
        prev.map(item => 
          item.productId._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert(t('Failed to update quantity. Please try again.'));
      fetchCart(); // Refresh cart on error
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = getNumericPrice(item.productId.price);
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();

  const toCart = () => {
    navigate('/cart');
    setIsOpen(false);
  };

  const toCheckout = () => {
    navigate('/checkout');
    setIsOpen(false);
  };

  return (
    <div className="shopping-cart-sidebar">
      {isOpen && (
        <div className="cart-overlay" onClick={() => setIsOpen(false)}></div>
      )}

      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-content">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <IoMdClose size={24} />
            </button>
          </div>

          <div className="cart-items">
            {loading ? (
              <div className="loading-indicator">Loading...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.productId._id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.productId.image}
                      alt={item.productId.title?.[i18n.language] || item.productId.title?.en || 'Product'}
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item.productId.title?.[i18n.language] || item.productId.title?.en || 'No title'}</h3>
                    <p>
                      {item.quantity} × {getFormattedPrice(item.productId.price)}
                    </p>
                  
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => handleRemoveItem(item.productId._id)}
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

          {cartItems.length > 0 && (
            <div className="cart-footer">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <button className="cart-sidebar-btn" onClick={toCart}>
                View Cart
              </button>
              <button className="checkout-btn" onClick={toCheckout}>
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
                  