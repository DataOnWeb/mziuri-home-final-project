import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import marigold from '../assets/images/marigold.jpg';
import bonzai from '../assets/images/bonzai.jpg';
import viburnum from '../assets/images/viburnum.jpg';
import { useNavigate } from 'react-router-dom';
const ShoppingCartSidebar = ({ isOpen, setIsOpen }) => {
  const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };
  useEffect(() => {
    const fetchCartItems = async () => {
      const items = [
        { id: 1, title: 'American Marigold', price: 23.45, quantity: 1, image: marigold },
        { id: 2, title: 'Black Eyed Susan', price: 25.45, quantity: 1, image: bonzai },
        { id: 3, title: 'Bleeding Heart', price: 30.45, quantity: 1, image: viburnum }
      ];
      setCartItems(items);
    };
    
    fetchCartItems();
  }, []);
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    // In a real app, you would also update your cart state or call an API
  };
  const closeCart = () => {
    handleNavigation('/cart')
    setIsOpen(false)
  }
  
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
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <IoMdClose size={24} />
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.length > 0 ? (
              cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p>{item.quantity} × ${item.price.toFixed(2)}</p>
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
                <span>${subtotal}</span>
              </div>
              <button className="cart-sidebar-btn" onClick={closeCart}>View Cart</button>
              <button className="checkout-btn">Checkout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartSidebar;