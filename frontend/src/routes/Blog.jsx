import React, { useState, useEffect } from 'react';
import { categories } from '../data/data';
import RouteBanner from '../components/RouteBanner';
import { IoSearchOutline, IoPlayOutline, IoVolumeHighOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import blog1 from '../assets/images/blog1.webp';
import blog2 from '../assets/images/blog2.webp';
import blog3 from '../assets/images/blog3.webp';
import Pagination from '../components/Pagination';
import { useLoader } from '../hooks/useLoader';
import ScrollToTop from '../components/ScrollToTop';
const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { t } = useTranslation();
  const { useFakeLoader } = useLoader();
  const blogPosts = [
    {
      id: 1,
      title: t('blogCarousel.header'),
      author: t('blogCarousel.author'),
      date: t('blogCarousel.date'),
      excerpt:
        t('blogCarousel.text'),
      image: blog1,
      type: 'text',
      category: 'House Plants',
      tags: ['organic', 'plants'],
    },
    {
      id: 2,
      title: t('blogCarousel.header'),
      author: t('blogCarousel.author'),
      date: t('blogCarousel.date'),
      excerpt:
        t('blogCarousel.text'),
      image: blog2,
      type: 'gallery',
      category: 'Indoor Living',
      tags: ['fashion', 'organic'],
    },
    {
      id: 3,
            title: t('blogCarousel.header'),
      author: t('blogCarousel.author'),
      date: t('blogCarousel.date'),
      excerpt:
        t('blogCarousel.text'),
      type: 'audio',
      category: 'Bonsai',
      tags: ['music', 'audio'],
    },
    {
      id: 4,
            title: t('blogCarousel.header'),
      author: t('blogCarousel.author'),
      date: t('blogCarousel.date'),
      excerpt:
        t('blogCarousel.text'),
      image: blog3,
      type: 'video',
      category: 'Garden Tools',
      tags: ['video', 'tutorial'],
    },
  ];

  const recentPosts = [
    {
      id: 1,
      title: t('blogPage.latest'),
      date: t('blogPage.date'),
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=80&fit=crop',
    },
    {
      id: 2,
      title: t('blogPage.latest'),
      date: t('blogPage.date'),
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=100&h=80&fit=crop',
    },
    {
      id: 3,
      title: t('blogPage.latest'),
      date: t('blogPage.date'),
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&h=80&fit=crop',
    },
    {
      id: 4,
      title: t('blogPage.latest'),
      date: t('blogPage.date'),
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=80&fit=crop',
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    scrollToTop();
  };

  // Filter posts based on search term and active category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    useFakeLoader();
    document.title = 'Blog - Pronia';
  }, []);

  const renderPostMedia = (post) => {
    switch (post.type) {
      case 'gallery':
        return (
          <div className="post-media gallery-post">
            <img
              src={post.image}
              alt={post.title}
            />
            <div className="image-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                  fill="#7fcdcd"
                />
              </svg>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="post-media text-post">
            <img
              src={post.image}
              alt={post.title}
            />
            <div className="image-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                  fill="#7fcdcd"
                />
              </svg>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="post-media audio-post">
            <div className="audio-player">
              <div className="audio-controls">
                <button className="play-btn">
                  <IoPlayOutline />
                </button>
                <div className="audio-info">
                  <div className="audio-title">asianbeats</div>
                  <div className="audio-subtitle">Latest tracks</div>
                </div>
                <IoVolumeHighOutline className="volume-icon" />
              </div>
              <div className="audio-waveform">
                <div className="waveform-bars">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="bar"
                      style={{ height: `${Math.random() * 40 + 10}px` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="post-media video-post">
            <img
              src={post.image}
              alt={post.title}
            />
            <div className="video-overlay">
              <button className="video-play-btn">
                <IoPlayOutline />
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="post-media">
            <img
              src={post.image}
              alt={post.title}
            />
          </div>
        );
    }
  };

  return (
    <div className="blog-page">
      <RouteBanner title="blog" />

      <div className="blog-container">
        <div className="sidebar">
          <div className="blog-search-box">
            <div className="blog-search-wrapper">
              <div className="search-input-container">
                <input
                  type="search"
                  placeholder={t('search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <IoSearchOutline className="input-search-icon" />
              </div>
            </div>
          </div>

          <div className="blog-filter-section">
            <h2 className="blog-categories-title">{t('categories')}</h2>
            <div className="divider"></div>
            <ul className="blog-categories-list">
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
                    <span className="category-label">› {t(`categoriesList.${category.name}`)}</span>
                    <span className="count">({category.count})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="blog-recent-posts">
            <h2 className="blog-recent-title">{t('recentPost')}</h2>
            <div className="divider"></div>
            <div className="blog-recent-list">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="blog-recent-item"
                >
                  <div className="blog-recent-image">
                    <img
                      src={post.image}
                      alt={post.title}
                    />
                  </div>
                  <div className="blog-recent-content">
                    <div className="blog-recent-date">{post.date}</div>
                    <div className="blog-recent-title">{post.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="blog-popular-tags">
            <h2 className="blog-tags-title">{t('popularTags')}</h2>
            <div className="divider"></div>
            <div className="blog-tags-container">
              {['fashion', 'organic', 'oldFashion', 'men', 'dress'].map((tagKey, i) => (
                <span
                  key={i}
                  className="blog-tag"
                  onClick={() => handleTagClick(t(`tags.${tagKey}`))}
                >
                  {t(`tags.${tagKey}`)}
                </span>
              ))}
            </div>
          </div>
          <div className="shop-collection-item shop-collection-item-medium">
            <div className="product-collection-content">
              <span className="product-collection-category">{t('collection.subtitle2')}</span>
              <h3 className="product-collection-title">{t('collection.title2')}</h3>
              <button className="product-collection-button">{t('collection.buttonText')}</button>
            </div>
          </div>
        </div>

        <div className="blog-content-area">
          <div className="blog-posts">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="blog-post"
              >
                {post.image || post.type === 'audio' ? renderPostMedia(post) : null}

                <div className="post-content">
                  <div className="post-meta">
                    <span className="post-author">BY: {post.author}</span>
                    <span className="post-date">{post.date}</span>
                  </div>

                  <h2 className="post-title">
                    <a href="#">{post.title}</a>
                  </h2>

                  <p className="post-excerpt">{post.excerpt}</p>
                </div>
              </article>
            ))}

            {filteredPosts.length === 0 && (
              <div className="no-posts">
                <p>No blog posts found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Pagination />
      <ScrollToTop 
        showAfter={500}        
        smooth={true}            
      />
    </div>
  );
};

export default Blog;
