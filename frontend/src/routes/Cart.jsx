import { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';
import { getProducts } from '../api/api';
import { useLoader } from '../hooks/useLoader';
import { X, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const { useDataLoader } = useLoader();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await useDataLoader(getProducts);

        const plantProducts = allProducts
          .filter((product) =>
            ['American Marigold', 'Black Eyed Susan', 'Bleeding Heart'].includes(product.title)
          )
          .map((product) => ({
            _id: product._id,
            name: product.title,
            price: product.price,
            image: product.image || product.images[0],
            inStock: product.inStock,
            quantity: 1, // Default quantity
          }));

        setCartItems(plantProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Failed to fetch products:', err);
      }
    };

    fetchCartProducts();
    document.title = 'Shopping Cart - Pronia';
  }, []);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item._id !== itemId));
  };

  const handleQuantityChange = (itemId, change) => {
    setCartItems(cartItems.map(item => {
      if (item._id === itemId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleUpdateCart = () => {
    console.log('Cart updated');
    alert('Cart updated successfully!');
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      console.log('Applying coupon:', couponCode);
      alert('Coupon applied!');
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();

  if (loading) return <div className="loading-indicator">Loading cart...</div>;
  if (error) return <div className="error">Error loading products: {error}</div>;

  return (
    <div className="cart-page">
      <RouteBanner title="Shopping Cart" />
      <div className="shopping-cart">
        <div className="cart-table-container">
          <table className="cart-table">
            <thead>
              <tr className="cart-header">
                <th className="header-cell">Remove</th>
                <th className="header-cell">Images</th>
                <th className="header-cell">Product</th>
                <th className="header-cell">Unit Price</th>
                <th className="header-cell">Quantity</th>
                <th className="header-cell">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="cart-row">
                  <td className="cart-cell remove-cell">
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(item._id)}
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>
                  </td>
                  <td className="cart-cell image-cell">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-image"
                    />
                  </td>
                  <td className="cart-cell product-cell">
                    <a 
                      className="product-link"
                      onClick={() => handleNavigation(`/product/${item._id}`)}
                    >
                      {item.name}
                    </a>
                  </td>
                  <td className="cart-cell price-cell">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="cart-cell quantity-cell">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item._id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item._id, 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="cart-cell total-cell">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-actions">
          <div className="coupon-section">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="coupon-input"
            />
            <button 
              className="apply-coupon-btn"
              onClick={handleApplyCoupon}
            >
              APPLY COUPON
            </button>
          </div>
          <button 
            className="update-cart-btn"
            onClick={handleUpdateCart}
          >
            UPDATE CART
          </button>
        </div>

        <div className="cart-totals">
          <h3 className="totals-title">Cart Totals</h3>
          <div className="totals-content">
            <div className="total-row">
              <span className="total-label">Subtotal</span>
              <span className="total-value">${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row final-total">
              <span className="total-label">Total</span>
              <span className="total-value">${subtotal.toFixed(2)}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={handleProceedToCheckout}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;