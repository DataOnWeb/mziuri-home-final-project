import { useEffect, useState } from 'react';
import RouteBanner from '../components/RouteBanner';
import { getProducts } from '../api/api'; // Import getProducts just like in Shop.jsx
import { useLoader } from '../hooks/useLoader'; // Import the useLoader hook
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
function Wishlist() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    document.title = 'My Wishlist - Pronia';
  }, []);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item._id !== itemId));
  };

  const handleAddToCart = (itemId) => {
    console.log(`Added item ${itemId} to cart`);

    alert(`Item added to cart!`);
  };

  if (loading) return <div className="loading-indicator">Loading cart...</div>;
  if (error) return <div className="error">Error loading products: {error}</div>;

  return (
    <div>
      <RouteBanner title="Wishlist" />
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
              <div className="cart-cell price-cell">${item.price.toFixed(2)}</div>
              <div className="cart-cell stock-cell">
                <span className={item.inStock ? 'in-stock' : 'out-stock'}>
                  {item.inStock ? 'In Stock' : 'Out Stock'}
                </span>
              </div>
              <div className="cart-cell action-cell">
                <button
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(item._id)}
                  disabled={!item.inStock}
                >
                  ADD TO CART
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
