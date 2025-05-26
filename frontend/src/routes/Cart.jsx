import { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';
import { getProducts } from '../api/api';
import { useLoader } from '../hooks/useLoader';
import { X, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const { useDataLoader } = useLoader();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Helper function to get localized product title
  const getLocalizedTitle = (titleObj) => {
    if (typeof titleObj === 'string') {
      return titleObj;
    } else if (titleObj && typeof titleObj === 'object') {
      return titleObj[i18n.language] || titleObj.en || Object.values(titleObj)[0] || '';
    }
    return '';
  };

  // Helper function to check if product should be in cart
  const isCartProduct = (product) => {
    const localizedTitle = getLocalizedTitle(product.title);
    const englishTitle = typeof product.title === 'object' && product.title.en 
      ? product.title.en 
      : localizedTitle;
    
    const targetProducts = ['Bloody Viburnum', 'Black Eyed Susan', 'Bleeding Heart'];
    return targetProducts.includes(englishTitle) || targetProducts.includes(localizedTitle);
  };

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await useDataLoader(getProducts);

        const plantProducts = allProducts
          .filter(isCartProduct)
          .map((product) => {
            const productName = getLocalizedTitle(product.title);
            
            return {
              _id: product._id,
              name: productName || 'Unknown Product',
              price: product.price || 0,
              image: product.image || (product.images && product.images[0]) || '',
              inStock: product.inStock !== undefined ? product.inStock : true,
              quantity: 1, // Default quantity
            };
          });

        setCartItems(plantProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Failed to fetch products:', err);
      }
    };

    fetchCartProducts();
    document.title = `${t('cart.title')} - Pronia`;
  }, [t]);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item._id !== itemId));
  };

  const handleQuantityChange = (itemId, change) => {
    setCartItems(
      cartItems.map((item) => {
        if (item._id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleUpdateCart = () => {
    console.log('Cart updated');
    alert(t('Cart Updated'));
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      console.log('Applying coupon:', couponCode);
      alert("Coupon Applied");
    }
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();

  if (loading) return <div className="loading-indicator">{t('common.loading')}</div>;
  if (error) return <div className="error">{t('common.errorLoading')}: {error}</div>;

  return (
    <div className="cart-page">
      <RouteBanner title='cart' />
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
                  key={item._id}
                  className="cart-row"
                >
                  <td className="cart-cell remove-cell">
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(item._id)}
                      aria-label="REMOVE ITEM"
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
                  <td className="cart-cell price-cell">${item.price.toFixed(2)}</td>
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
              <span className="total-value">${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row final-total">
              <span className="total-label">TOTAL</span>
              <span className="total-value">${subtotal.toFixed(2)}</span>
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