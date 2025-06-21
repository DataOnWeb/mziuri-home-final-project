import { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';
import { getProducts } from '../api/api';
import { useLoader } from '../hooks/useLoader';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

function Compare() {
  const [compareItems, setCompareItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { useDataLoader } = useLoader();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { formatPrice, getPriceInCurrentCurrency } = useCurrency();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Helper function to get formatted price using currency context
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
    if (typeof titleObj === 'string') {
      return titleObj;
    } else if (titleObj && typeof titleObj === 'object') {
      return titleObj[i18n.language] || titleObj.en || Object.values(titleObj)[0] || '';
    }
    return '';
  };

  const getLocalizedDescription = (descObj) => {
    if (typeof descObj === 'string') {
      return descObj;
    } else if (descObj && typeof descObj === 'object') {
      return descObj[i18n.language] || descObj.en || Object.values(descObj)[0] || '';
    }
    return 'No description available';
  };

  const isCompareProduct = (product) => {
    const localizedTitle = getLocalizedTitle(product.title);
    const englishTitle =
      typeof product.title === 'object' && product.title.en ? product.title.en : localizedTitle;

    // More flexible matching to ensure we get both products
    const targetProducts = [
      'American Marigold',
      'Black Eyed Susan',
      'Bloody Viburnum',
      'Bleeding Heart',
    ];

    // Check both English and localized titles, and also check if title contains any of the target names
    return targetProducts.some(
      (target) =>
        englishTitle?.toLowerCase().includes(target.toLowerCase()) ||
        localizedTitle?.toLowerCase().includes(target.toLowerCase()) ||
        englishTitle === target ||
        localizedTitle === target
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i < rating ? 'active' : 'inactive'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    const fetchCompareProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await useDataLoader(getProducts);

        const plantProducts = allProducts
          .filter(isCompareProduct)
          .slice(0, 2)
          .map((product) => {
            const productName = getLocalizedTitle(product.title);
            const productDescription = getLocalizedDescription(product.description);

            // Set default data based on product to ensure we have the right comparison
            let defaultColor = 'Black';
            let defaultSize = 'Medium';
            let stockStatus = true;

            if (
              productName.toLowerCase().includes('susan') ||
              productName.toLowerCase().includes('black')
            ) {
              defaultColor = 'Red';
              defaultSize = 'Large';
              stockStatus = false;
            }

            return {
              _id: product._id,
              name: productName || 'Unknown Product',
              description:
                productDescription ||
                'Nulla pulvinar et urna malesuada elementum. Nunc placerat, quam et tempus ullamcorper, nunc erat imperdiet lacus, vel auctor arcu lacus non ligula.',
              price: product.price,
              image: product.image || (product.images && product.images[0]) || '',
              inStock: product.inStock !== undefined ? product.inStock : stockStatus,
              rating: product.rating || 5,
              color: product.color || defaultColor,
              size: product.size || defaultSize,
            };
          });

        console.log(
          'Found products for comparison:',
          plantProducts.length,
          plantProducts.map((p) => p.name)
        );

        setCompareItems(plantProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Failed to fetch products:', err);
      }
    };

    fetchCompareProducts();
    document.title = `Compare Products - Pronia`;
  }, [t]);

  const handleAddToCart = (productId) => {
    console.log('Adding to cart:', productId);
    navigate('/cart');
  };

  if (loading) return <div className="loading-indicator">{t('common.loading')}</div>;
  if (error)
    return (
      <div className="error">
        {t('common.errorLoading')}: {error}
      </div>
    );

  return (
    <div className="compare-page">
      <RouteBanner title="compare" />
      <div className="compare-container">
        <div className="compare-table">
          <div className="compare-row image-row">
            <div className="compare-cell row-header">
              <span className="row-label">Image</span>
            </div>
            {compareItems.map((item) => (
              <div
                key={`image-${item._id}`}
                className="compare-cell product-cell"
              >
                <div className="product-image-container-compare">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="product-image-compare"
                  />
                  <button
                    className="compare-add-to-cart-btn"
                    onClick={() => handleAddToCart(item._id)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="compare-row">
            <div className="compare-cell row-header">
              <span className="row-label">Product Name</span>
            </div>
            {compareItems.map((item) => (
              <div
                key={`name-${item._id}`}
                className="compare-cell product-cell"
              >
                <span className="product-name">{item.name}</span>
              </div>
            ))}
          </div>

          <div className="compare-row">
            <div className="compare-cell row-header">
              <span className="row-label">Description</span>
            </div>
            {compareItems.map((item) => (
              <div
                key={`desc-${item._id}`}
                className="compare-cell product-cell"
              >
                <p className="product-description">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="compare-row">
            <div className="compare-cell row-header">
              <span className="row-label">Price</span>
            </div>
            {compareItems.map((item) => (
              <div
                key={`price-${item._id}`}
                className="compare-cell product-cell"
              >
                <span className="product-price">{getFormattedPrice(item.price)}</span>
              </div>
            ))}
          </div>

          <div className="compare-row">
            <div className="compare-cell row-header">
              <span className="row-label">Color</span>
            </div>
            {compareItems.map((item) => (
              <div
                key={`color-${item._id}`}
                className="compare-cell product-cell"
              >
                <span className="product-color">{item.color}</span>
              </div>
            ))}
          </div>

          <div className="compare-row">
            <div className="compare-cell row-header">
              <span className="row-label">Size</span>
            </div>
            {compareItems.map((item) => (
              <div
                key={`size-${item._id}`}
                className="compare-cell product-cell"
              >
                <span className="product-size">{item.size}</span>
              </div>
            ))}
          </div>

          <div className="compare-row">
            <div className="compare-cell row-header">
              <span className="row-label">Stock</span>
            </div>
            {compareItems.map((item) => (
              <div
                key={`stock-${item._id}`}
                className="compare-cell product-cell"
              >
                <span className={`stock-status ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {item.inStock ? 'In Stock' : 'Stock Out'}
                </span>
              </div>
            ))}
          </div>

          <div className="compare-row">
            <div className="compare-cell row-header">
              <span className="row-label">Rating</span>
            </div>
            {compareItems.map((item) => (
              <div
                key={`rating-${item._id}`}
                className="compare-cell product-cell"
              >
                <div className="product-rating-compare">{renderStars(item.rating)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compare;
