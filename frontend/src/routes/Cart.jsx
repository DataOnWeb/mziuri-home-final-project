import { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import { X, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { getCart, removeFromCart, updateCartItem } from '../api/api';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const { useDataLoader } = useLoader();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { formatPrice, getPriceInCurrentCurrency } = useCurrency();

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

  const getNumericPrice = (priceObj) => {
    try {
      if (typeof priceObj === 'object' && priceObj !== null) {
        return getPriceInCurrentCurrency(priceObj);
      } else {
        const numericPrice = typeof priceObj === 'string' ? parseFloat(priceObj) : priceObj;
        return getPriceInCurrentCurrency(numericPrice);
      }
    } catch (error) {
      console.error('Error getting numeric price:', error);
      return 0;
    }
  };

  const getLocalizedTitle = (titleObj) => {
    if (typeof titleObj === 'string') {
      return titleObj;
    } else if (titleObj && typeof titleObj === 'object') {
      return titleObj[i18n.language] || titleObj.en || Object.values(titleObj)[0] || '';
    }
    return '';
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await useDataLoader(getCart);
        setCartItems(response.cart || []);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    document.title = `My Cart - Pronia`;
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      setCartItems((prevItems) => prevItems.filter((item) => item.productId._id !== itemId));

      const response = await removeFromCart(itemId);

      if (response && response.cart) {
        setCartItems(response.cart);
      } else {
        const updatedCart = await getCart();
        setCartItems(updatedCart.cart || []);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      const currentCart = await getCart();
      setCartItems(currentCart.cart || []);
      alert(t('Failed to remove item. Please try again.'));
    }
  };

  const handleQuantityChange = async (itemId, change) => {
    try {
      setCartItems((prevItems) => {
        return prevItems.map((item) => {
          if (item.productId._id === itemId) {
            const newQuantity = Math.max(1, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      });
      const item = cartItems.find((item) => item.productId._id === itemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + change);

      await updateCartItem(itemId, newQuantity);

      const updatedCart = await getCart();
      setCartItems(updatedCart.cart || []);
    } catch (error) {
      console.error('Error updating quantity:', error);
      const originalCart = await getCart();
      setCartItems(originalCart.cart || []);
      alert(t('Failed to update quantity. Please try again.'));
    }
  };

  const handleUpdateCart = () => {
    console.log('Cart updated');
    alert(t('Cart Updated'));
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      console.log('Applying coupon:', couponCode);
      alert('Coupon Applied');
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = getNumericPrice(item.productId.price);
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();

  if (loading) return <div className="loading-indicator">{t('common.loading')}</div>;
  if (error)
    return (
      <div className="error">
        {t('common.errorLoading')}: {error}
      </div>
    );

  return (
    <div className="cart-page">
      <RouteBanner title="cart" />
      <div className="shopping-cart">
        <div className="cart-table-container">
          <table className="cart-table">
            <thead>
              <tr className="cart-header">
                <th className="header-cell">REMOVE</th>
                <th className="header-cell">IMAGE</th>
                <th className="header-cell">PRODUCT</th>
                <th className="header-cell">UNIT PRICE</th>
                <th className="header-cell">QUANTITY</th>
                <th className="header-cell">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr
                  key={item.productId._id}
                  className="cart-row"
                >
                  <td className="cart-cell remove-cell">
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(item.productId._id)}
                      aria-label="REMOVE ITEM"
                    >
                      <X size={18} />
                    </button>
                  </td>
                  <td className="cart-cell image-cell">
                    <img
                      src={item.productId.image}
                      alt={getLocalizedTitle(item.productId.title)}
                      className="product-image"
                    />
                  </td>
                  <td className="cart-cell product-cell">
                    <a
                      className="product-link"
                      onClick={() => handleNavigation(`/product/${item.productId._id}`)}
                    >
                      {getLocalizedTitle(item.productId.title)}
                    </a>
                  </td>
                  <td className="cart-cell price-cell">
                    {getFormattedPrice(item.productId.price)}
                  </td>
                  <td className="cart-cell quantity-cell">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.productId._id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.productId._id, 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="cart-cell total-cell">
                    {formatPrice(getNumericPrice(item.productId.price) * item.quantity)}
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
              placeholder="Enter Coupon"
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
          <h3 className="totals-title">TOTAL</h3>
          <div className="totals-content">
            <div className="total-row">
              <span className="total-label">SUBTOTAL</span>
              <span className="total-value">{formatPrice(subtotal)}</span>
            </div>
            <div className="total-row final-total">
              <span className="total-label">TOTAL</span>
              <span className="total-value">{formatPrice(subtotal)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={handleProceedToCheckout}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
