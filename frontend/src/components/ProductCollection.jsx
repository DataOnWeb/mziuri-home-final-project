import React, { useEffect } from 'react'
import CollectionImage1 from '../assets/images/collection1.jpg';
import CollectionImage2 from '../assets/images/collection2.jpg';
import CollectionImage3 from '../assets/images/collection3.jpg';
import CollectionImage4 from '../assets/images/collection4.jpg';
import { useNavigate } from 'react-router-dom';

function ProductCollection() {
  const collectionData = [
    {
      id: 1,
      category: "Collection Of Cactus",
      title: "Pottery Pots & Plant",
      buttonText: "SHOP NOW",
      imageUrl: CollectionImage1,
      className: "product-collection-item-large"
    },
    {
      id: 2,
      category: "New Collection",
      title: "Plant Port",
      buttonText: "SHOP NOW",
      imageUrl: CollectionImage2,
      className: "product-collection-item-medium"
    },
    {
      id: 3,
      category: "New Collection",
      title: "Plant Port",
      buttonText: "SHOP NOW",
      imageUrl: CollectionImage3,
      className: "product-collection-item-small"
    },
    {
      id: 4,
      category: "Collection Of Cactus",
      title: "Hanging Pots & Plant",
      buttonText: "SHOP NOW",
      imageUrl: CollectionImage4,
      className: "product-collection-item-wide"
    }
  ]; 

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Product Collections Section */}
      <section className="product-collections-section">
        <div className="product-collection-container">
          <div className="product-collections-grid">
            {collectionData.map((collection) => (
              <div key={collection.id} className={`product-collection-item ${collection.className}`}>
                <div className="product-collection-content">
                  <span className="product-collection-category">{collection.category}</span>
                  <h3 className="product-collection-title">{collection.title}</h3>
                  <button 
                    className="product-collection-button" 
                    onClick={() => handleNavigation('/shop')}
                  >
                    {collection.buttonText}
                  </button>
                </div>
                <div className="product-collection-image">
                  <img src={collection.imageUrl} alt={collection.title} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductCollection