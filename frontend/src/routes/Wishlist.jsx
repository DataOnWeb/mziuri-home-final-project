import { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';
import { getProducts } from '../api/api';
import { useLoader } from '../hooks/useLoader';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext'; // Import currency context

function Wishlist() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { useDataLoader } = useLoader();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { formatPrice, getPriceInCurrentCurrency } = useCurrency(); // Add currency hooks

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Updated helper function to get formatted price using currency context
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
    const fetchCartProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const allProducts = await useDataLoader(getProducts);

        if (!Array.isArray(allProducts)) {
          throw new Error('Products data is not an array');
        }

        const targetEnglishTitles = ['Bloody Viburnum', 'Black Eyed Susan', 'Bleeding Heart'];

        const plantProducts = allProducts
          .filter((product) => {
            if (!product || !product.title) return false;

            const englishTitle =
              typeof product.title === 'object'
                ? product.title.en || Object.values(product.title)[0]
                : product.title;

            return targetEnglishTitles.includes(englishTitle);
          })
          .map((product) => ({
            _id: product._id,
            name: getLocalizedTitle(product.title), 
            price: product.price, // Keep original price object
            image: product.image || (product.images && product.images[0]) || '',
            inStock: product.inStock !== undefined ? product.inStock : true,
          }));

        setCartItems(plantProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
    document.title = `Wishlist - Pronia`;
  }, [t]);

  useEffect(() => {
    if (cartItems.length > 0) {
      setCartItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          name: getLocalizedTitle(item.title), 
        }))
      );
    }
  }, [i18n.language]);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item._id !== itemId));
  };

  const handleAddToCart = (itemId) => {
    console.log(`Added item ${itemId} to cart`);
    alert('Added to cart successfully!');
  };

  if (loading) return <div className="loading-indicator">Loading...</div>;
  if (error) return <div className="error">Error loading products: {error}</div>;

  return (
    <div>
      <RouteBanner title="wishlist" />
      <div className="shopping-cart">
        <div className="cart-table">
          <div className="cart-header">
            <div className="header-cell">Remove</div>
            <div className="header-cell">Images</div>
            <div className="header-cell">Product</div>
            <div className="header-cell">Unit Price</div>
            <div className="header-cell">Stock Status</div>
            <div className="header-cell">Add To Cart</div>
          </div>

          {cartItems.map((item) => (
            <div
              key={item._id}
              className="cart-row"
            >
              <div className="cart-cell remove-cell">
                <button
                  className="remove-button"
                  onClick={() => handleRemoveItem(item._id)}
                  aria-label="Remove item"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="cart-cell image-cell">
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-image"
                />
              </div>
              <div className="cart-cell product-cell">
                <a onClick={() => handleNavigation(`/product/${item._id}`)}>{item.name}</a>
              </div>
              <div className="cart-cell price-cell">{getFormattedPrice(item.price)}</div>
              <div className="cart-cell stock-cell">
                <span className={item.inStock ? 'in-stock' : 'out-stock'}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="cart-cell action-cell">
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(item._id)}
                  disabled={!item.inStock}
                >
                  Add To Cart
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