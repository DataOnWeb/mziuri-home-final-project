import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";


const Pagination = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="pagination">
      <div className="pagination__container">
        <button 
          onClick={scrollToTop}
          className="pagination__button pagination__button--active"
        >
          1
        </button>
        <button 
          onClick={scrollToTop}
          className="pagination__button"
        >
          2
        </button>
        <button 
          onClick={scrollToTop}
          className="pagination__button"
        >
          3
        </button>
        <button 
          onClick={scrollToTop}
          className="pagination__button pagination__button--next"
        >
          <FontAwesomeIcon icon={faArrowRight}/>
        </button>
      </div>
    </div>
  );
};

export default Pagination;