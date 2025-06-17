import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../api/api';
import Product from './Product';
import { useLoader } from '../hooks/useLoader';

const ProductCarousel = ({ title = 'New Products' }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const { useDataLoader } = useLoader();
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await useDataLoader(getProducts);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };


  const displayProducts = products;

  return (
    <div className="product-carousel-container">
      <h2 className="product-carousel-title">{title}</h2>
      <h6 className="product-carousel-subtitle">
        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
        of classical Latin literature
      </h6>
      <div
        className={`product-carousel ${isDragging ? 'dragging' : ''}`}
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div className="carousel-track">
          {displayProducts.map((product, index) => (
            <div
              key={product._id}
              className="product-carousel-item"
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
  );
};

export default ProductCarousel;
