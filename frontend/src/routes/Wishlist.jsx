import { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';
import { useLoader } from '../hooks/useLoader';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';
import { getWishlist, removeFromWishlist, addToCart } from '../api/api';
function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const getLocalizedTitle = (titleObj) => {
    if (!titleObj) return 'Unknown Product';
    if (typeof titleObj === 'string') {
      return titleObj;
    }
    if (typeof titleObj === 'object') {
      return (
        titleObj[i18n.language] || titleObj.en || Object.values(titleObj)[0] || 'Unknown Product'
      );
    }
    return 'Unknown Product';
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await useDataLoader(getWishlist);
        setWishlistItems(response.wishlist);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setError(err.message || 'Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
    document.title = `Wishlist - Pronia`;
  }, [t]);

  useEffect(() => {
    if (wishlistItems.length > 0) {
      setWishlistItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          name: getLocalizedTitle(item.productId.title),
        }))
      );
    }
  }, [i18n.language]);

  const handleRemoveItem = async (itemId) => {
    try {
      setWishlistItems((prevItems) => prevItems.filter((item) => item.productId._id !== itemId));

      const response = await removeFromWishlist(itemId);

      if (response && response.wishlist) {
        setWishlistItems(response.wishlist);
      } else {
        const updatedWishlist = await getWishlist();
        setWishlistItems(updatedWishlist.wishlist || []);
      }
    } catch (error) {
      console.error('Error removing item:', error);

      const currentWishlist = await getWishlist();
      setWishlistItems(currentWishlist.wishlist || []);
      alert(t('Failed to remove item. Please try again.'));
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      await addToCart(itemId, 1);
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  if (loading) return <div className="loading-indicator">Loading...</div>;
  if (error) return <div className="error">Error loading wishlist: {error}</div>;

  return (
    <div>
      <RouteBanner title="wishlist" />
      <div className="shopping-cart">
        <div className="cart-table">
          <div className="cart-header">
            <div className="header-cell">{t('cart.remove')}</div>
            <div className="header-cell">{t('cart.image')}</div>
            <div className="header-cell">{t('cart.product')}</div>
            <div className="header-cell">{t('cart.unitPrice')}</div>
            <div className="header-cell">{t('cart.stockStatus')}</div>
            <div className="header-cell">{t('cart.addToCart')}</div>
          </div>

          {wishlistItems.map((item) => (
            <div
              key={item.productId._id}
              className="cart-row"
            >
              <div className="cart-cell remove-cell">
                <button
                  className="remove-button"
                  onClick={() => handleRemoveItem(item.productId._id)}
                  aria-label="Remove item"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="cart-cell image-cell">
                <img
                  src={`/productImg/product${item.productId.image}.jpg`}
                  alt={getLocalizedTitle(item.productId.title)}
                  className="product-image"
                />
              </div>
              <div className="cart-cell product-cell">
                <a onClick={() => handleNavigation(`/product/${item.productId._id}`)}>
                  {getLocalizedTitle(item.productId.title)}
                </a>
              </div>
              <div className="cart-cell price-cell">{getFormattedPrice(item.productId.price)}</div>
              <div className="cart-cell stock-cell">
                <span className={item.productId.inStock ? 'in-stock' : 'out-stock'}>
                  {item.productId.inStock ? t('inStock') : t('outStock')}
                </span>
              </div>
              <div className="cart-cell action-cell">
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(item.productId._id)}
                  disabled={!item.productId.inStock}
                >
                  {t('addToCart')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
