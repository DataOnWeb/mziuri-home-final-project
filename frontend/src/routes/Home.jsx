import PlantCarousel from '../components/PlantCarousel';
import Product from '../components/Product';
import CarouselImage1 from '../assets/images/plant1.png';
import CarouselImage2 from '../assets/images/plant2.png';
import { useEffect, useState } from 'react';
import { useLoader } from '../hooks/useLoader';
import { useTranslation } from 'react-i18next';
import { getProducts } from '../api/api';
import { CiHeart, CiDeliveryTruck, CiCreditCard1 } from 'react-icons/ci';
import { PiShoppingCartThin } from 'react-icons/pi';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { IoChevronDown } from 'react-icons/io5';
import { BsPostcard } from 'react-icons/bs';
import { FaArrowsRotate } from 'react-icons/fa6';

const Home = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('Featured');
  const { useDataLoader } = useLoader();

  const carouselSlides = [
    {
      discount: t('plantCarousel.discount1'),
      title: t('plantCarousel.title1'),
      description: t('plantCarousel.description1'),
      buttonText: t('plantCarousel.buttonText'),
      imageUrl: CarouselImage1,
      imageAlt: 'Leafy Green Plant in Gray Pot',
    },
    {
      discount: t('plantCarousel.discount2'),
      title: t('plantCarousel.title2'),
      description: t('plantCarousel.description2'),
      buttonText: t('plantCarousel.buttonText2'),
      imageUrl: CarouselImage2,
      imageAlt: 'Geometric Planters with Green Plants',
    },
  ];

  useEffect(() => {

    document.title = 'Pronia - Home';
    
    // Fetch featured products
    const fetchFeaturedProducts = async () => {
      try {
        const data = await useDataLoader(getProducts);
        // Get only first 8 products for the grid (2 rows × 4 products)
        setFeaturedProducts(data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const tabs = ['Featured', 'Bestseller', 'Latest'];

  return (
    <div className='homepage'>
      <PlantCarousel slides={carouselSlides}></PlantCarousel>
      
      <div className="product-feature-home">
        <div className="feature-home">
          <div className="feature-home-icon">
            <div className="feature-home-icon">
              <CiDeliveryTruck size={40} />
            </div>
          </div>
          <div className="feature-home-content">
            <strong>Free Shipping</strong>
            <span>Capped at $319 per order</span>
          </div>
        </div>

        <div className="feature-home">
          <div className="feature-home-icon">
            <CiCreditCard1 size={40} />
          </div>
          <div className="feature-home-content">
            <strong>Safe Payment</strong>
            <span>With our payment gateway</span>
          </div>
        </div>

        <div className="feature-home">
          <div className="feature-home-icon">
            <BsPostcard size={25} />
          </div>
          <div className="feature-home-content">
            <strong>Best Services</strong>
            <span>Friendly & Supper Services</span>
          </div>
        </div>
      </div>

      {/* Our Products Section */}
      <section className="our-products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">OUR PRODUCTS</h2>
            <div className="product-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="home-products-grid">
            {featuredProducts.map((product, index) => (
              <div key={product._id} className="home-product-item">
                <Product
                  product={product}
                  viewMode="grid"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;