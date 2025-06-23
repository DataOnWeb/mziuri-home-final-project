import React from 'react';
import Product from './Product';

const ProductList = ({ products, viewMode, currency }) => {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found matching your criteria.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="products-grid">
        {products.map((product, index) => (
          <div key={product._id || index}>
            <Product
              key={product._id || index}
              product={product}
              viewMode="grid"
              currency={currency}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="products-list">
      {products.map((product, index) => (
        <div
          key={product._id || index}
          className="product-list-item"
        >
          <Product
            key={product._id || index}
            product={product}
            viewMode="list"
            currency={currency}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
