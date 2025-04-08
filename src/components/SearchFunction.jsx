import React, { useEffect}  from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";



const SearchFunction = ({ searchVisible, closeSearch, handleSearchSubmit }) => {
  useEffect(() => {

      document.addEventListener('keydown', closeSearch);
      return () => {
        document.removeEventListener('keydown', closeSearch);
      };
    }, []);
    return (
      <div className={`search-overlay ${searchVisible ? 'show' : ''}`}>
        <div className="search-popup">
          <div className="search-instruction">
            Start typing and press Enter to search or ESC to close
          </div>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  closeSearch();
                }
              }}
            />
            <button type="submit" className="search-button">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
        </div>
      </div>
    );
  };

export default SearchFunction;
