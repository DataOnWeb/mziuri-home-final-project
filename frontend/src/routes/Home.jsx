import PlantCarousel from '../components/PlantCarousel';
import Product from '../components/Product';
import CarouselImage1 from '../assets/images/plant1.png';
import CarouselImage2 from '../assets/images/plant2.png';
import { useEffect, useState } from 'react';
import { useLoader } from '../hooks/useLoader';
import { useTranslation } from 'react-i18next';
import { getProducts } from '../api/api';
import { CiDeliveryTruck, CiCreditCard1 } from 'react-icons/ci';
import { BsPostcard } from 'react-icons/bs';
import ProductCollection from '../components/ProductCollection';
import ProductCarousel from '../components/ProductCarousel';
import ClientCarousel from '../components/ClientCarousel';
import GreenCarousel from '../components/GreenCarousel';
import BlogCarousel from '../components/BlogCarousel';
import ScrollToTop from '../components/ScrollToTop';

const Home = () => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(t('ourProducts.option1'));
  const [productsVisible, setProductsVisible] = useState(true);
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

    const fetchFeaturedProducts = async () => {
      try {
        const data = await useDataLoader(getProducts);
        setFeaturedProducts(data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const tabs = [t('ourProducts.option1'), t('ourProducts.option2'), t('ourProducts.option3')];

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setProductsVisible(false);
      setTimeout(() => {
        setActiveTab(tab);
        setProductsVisible(true);
      }, 200);
    }
  };

  return (
    <div className="route-container">
      <PlantCarousel slides={carouselSlides}></PlantCarousel>

      <div className="product-feature-home">
        <div className="feature-home">
          <div className="feature-home-icon">
            <div className="feature-home-icon">
              <CiDeliveryTruck size={40} />
            </div>
          </div>
          <div className="feature-home-content">
            <strong>{t('features.title1')}</strong>
            <span>{t('features.subtitle1')}</span>
          </div>
        </div>

        <div className="feature-home">
          <div className="feature-home-icon">
            <CiCreditCard1 size={40} />
          </div>
          <div className="feature-home-content">
            <strong>{t('features.title2')}</strong>
            <span>{t('features.subtitle2')}</span>
          </div>
        </div>

        <div className="feature-home">
          <div className="feature-home-icon">
            <BsPostcard size={25} />
          </div>
          <div className="feature-home-content">
            <strong>{t('features.title3')}</strong>
            <span>{t('features.subtitle3')}</span>
          </div>
        </div>
      </div>

      {/* Our Products Section */}
      <section className="our-products-section">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title">{t('ourProducts.title')}</h2>
            <div className="product-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div 
            className="home-products-wrapper"
            style={{
              opacity: productsVisible ? 1 : 0,
              transition: 'opacity 0.4s ease-in-out'
            }}
          >
            <div className="home-products-grid">
              {featuredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="product-card-wrapper"
                >
                  <Product
                    product={product}
                    viewMode="grid"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProductCollection />
      <ProductCarousel />
      <ClientCarousel />
      <GreenCarousel />
      <BlogCarousel />
      <ScrollToTop
        showAfter={600}
        smooth={true}
      />
    </div>
  );
};

export default Home;