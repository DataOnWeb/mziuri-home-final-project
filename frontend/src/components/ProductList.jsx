import React from 'react';
import Product from './Product';


const ProductList = ({ products, viewMode }) => {
  if (viewMode === 'grid') {
    return (
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id}>
            <Product product={product} />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="products-list">
      {products.map((product) => (
        <div key={product.id} className="product-list-item">
          {/* <div className="product-image">
            <img 
              src={product.image} 
              alt={product.title}
            />
          </div> */}
          <div className="product-details">
            <Product product={product} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;