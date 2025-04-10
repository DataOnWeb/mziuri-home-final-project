// import { useEffect } from 'react';
// 
// export default function Shop() {
//   useEffect(() => {
//     document.title = "Shop - Pronia";
//   }, []);

//   return (
//     <div>
//       
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { products, categories, colors, totalProducts } from '../data/data';
import ProductList from '../components/ProductList';

import RouteBanner from '../components/RouteBanner';
const Shop = () => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeColor, setActiveColor] = useState('All');
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    let result = [...products];
    document.title = "Shop - Pronia";
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (activeCategory !== 'All') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Apply color filter
    if (activeColor !== 'All') {
      result = result.filter(product => product.color === activeColor);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        
        break;
    }
    
    setFilteredProducts(result);
  }, [searchTerm, activeCategory, activeColor, sortOption]);

  return (
    <div>
      <RouteBanner title="Shop" />
      <div className="shop-container">
      
      <div className="sidebar">

        <div className="search-box">
          <div className="search-wrapper">
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button" aria-label="Search"></button>
          </div>
        </div>
        
 
        <div className="filter-section">
          <h2>Categories</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.name}>
                <a 
                  href="#" 
                  className={activeCategory === category.name ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveCategory(category.name);
                  }}
                >
                  <span className="category-label">› {category.name}</span>
                  <span className="count">({category.count})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        
 
        <div className="filter-section">
          <h2>Color</h2>
          <ul>
            {colors.map((color) => (
              <li key={color.name}>
                <a 
                  href="#" 
                  className={activeColor === color.name ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveColor(color.name);
                  }}
                >
                  <span className="category-label">› {color.name}</span>
                  <span className="count">({color.count})</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      

      <div className="products-area">
        <div className="toolbar">
          <div className="product-count">
            {filteredProducts.length} Product Found of {totalProducts}
          </div>
          <div className="view-options">
            <div className="view-buttons">
              <button
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'active' : ''}
                aria-label="Grid view"
              >
                ☰
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'active' : ''}
                aria-label="List view"
              >
                ≡
              </button>
            </div>
            
            <div className="sort-dropdown">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Sort by Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
          </div>
        </div>
        

        <ProductList products={filteredProducts} viewMode={viewMode} />
      </div>
    </div>
    </div>
    
  );
};

export default Shop;