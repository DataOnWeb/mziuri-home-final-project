import React, { useEffect, useState } from 'react';
import Product from './Product';
import { getProducts } from '../api/api';
import { useLoader } from '../hooks/useLoader.jsx';

const ProductList = ({ viewMode }) => {
  const [products, setProducts] = useState([]);
  const { useDataLoader } = useLoader();
  useEffect(() => {
    useDataLoader(() => getProducts().then((data) => setProducts(data)));
  }, []);

  if (viewMode === 'grid') {
    return (
      <div className="products-grid">
        {products.map((product, index) => (
          <div key={product._id}>
            <Product
              key={index}
              product={product}
              viewMode="grid"
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
          key={product._id}
          className="product-list-item"
        >
          <Product
            key={index}
            product={product}
            viewMode="list"
          />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
