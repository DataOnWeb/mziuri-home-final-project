import { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import { X, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { getCart, removeFromCart, updateCartItem } from '../api/api';
import { useUserData } from '../context/UserContext';
function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const { useDataLoader } = useLoader();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { formatPrice, getPriceInCurrentCurrency } = useCurrency();
  const { isLoggedIn } = useUserData();

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
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await useDataLoader(getCart);
        setCartItems(response.cart || []);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/login');
        } else {
          setError(err.message);
          console.error('Failed to fetch cart:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isLoggedIn]);

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
      const currentItem = cartItems.find((item) => item.productId._id === itemId);
      if (!currentItem) return;

      const newQuantity = Math.max(1, currentItem.quantity + change);

      setCartItems((prev) =>
        prev.map((item) =>
          item.productId._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      const response = await updateCartItem(itemId, newQuantity);

      const { cart } = await getCart();
      setCartItems(cart);
    } catch (error) {
      console.error('Update failed:', error);

      const { cart } = await getCart();
      setCartItems(cart);
      alert('Failed to update quantity. Please try again.');
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

  return (
    <div className="cart-page">
      <RouteBanner title="cartTitle" />
      <div className="shopping-cart">
        <div className="cart-table-container">
          <table className="cart-table">
            <thead>
              <tr className="cart-header">
                <th className="header-cell">{t('cart.remove')}</th>
                <th className="header-cell">{t('cart.image')}</th>
                <th className="header-cell">{t('cart.product')}</th>
                <th className="header-cell">{t('cart.unitPrice')}</th>
                <th className="header-cell">{t('cart.quantity')}</th>
                <th className="header-cell">{t('cart.total')}</th>
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
                      aria-label={t('cart.removeItem')}
                    >
                      <X size={18} />
                    </button>
                  </td>
                  <td className="cart-cell image-cell">
                    <img
                      src={`/productImg/product${item.productId.image}.jpg`}
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
              placeholder={t('cart.couponPlaceholder')}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="coupon-input"
            />
            <button
              className="apply-coupon-btn"
              onClick={handleApplyCoupon}
            >
              {t('cart.applyCoupon')}
            </button>
          </div>
          <button
            className="update-cart-btn"
            onClick={handleUpdateCart}
          >
            {t('cart.updateCart')}
          </button>
        </div>

        <div className="cart-totals">
          <h3 className="totals-title">{t('cart.total')}</h3>
          <div className="totals-content">
            <div className="total-row">
              <span className="total-label">{t('cart.subtotal')}</span>
              <span className="total-value">{formatPrice(subtotal)}</span>
            </div>
            <div className="total-row final-total">
              <span className="total-label">{t('cart.total')}</span>
              <span className="total-value">{formatPrice(subtotal)}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={handleProceedToCheckout}
            >
              {t('cart.proceedToCheckout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
