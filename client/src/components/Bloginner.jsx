

import React, { useState, useEffect } from 'react';
import BlogList from './BlogList';
import { useAppContext } from "../context/AppContext";
import './BlogStyles.css';
import Mobailenav from './Mobailenav';
import LandingFooter from './LandingFooter';
import HorizontalImageSlider from './HorizontalImageSlider';

const Bloginner = () => {
  const { blogs } = useAppContext();
  const DEFAULT_COUNT = 12; 
  const [visibleCount, setVisibleCount] = useState(DEFAULT_COUNT);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  if (!blogs || blogs.length === 0) {
    return (
      <div id='blog' className="blog-section">
        <h2 className="Discover-section__header">Popular Travel Stories & Trip Reports</h2>
        <p className="section__subheader">Journey through our inspiring travel experiences.</p>
        <p>No blogs to display</p>
      </div>
    );
  }

  const total = blogs.length;
  const shown = Math.min(visibleCount, total);

  const handleLoadMore = () => {
    if (visibleCount >= blogs.length) {
      setVisibleCount(DEFAULT_COUNT);
    } else {

      setVisibleCount(prev => Math.min(prev + 12, blogs.length));
    }
  };

  return (
    <div id='blog' className="blog-section">
      <Mobailenav/>
      <div style={{background:'linear-gradient(135deg, rgb(44, 82, 130) 0%, rgb(74, 144, 189) 100%)',padding:'2.5rem 1.3rem'}}>
      <h2 className='blog---inner---title'>Popular Travel Stories & Trip Reports</h2>
      <p className="blog---inner---sub">Journey through our inspiring travel experiences.</p>
      </div>
      <div>
        <HorizontalImageSlider/>
      </div>
      <div className="blog-grid  blog-grid-inner-pa">
        {blogs.slice(0, visibleCount).map((blog, i) => (
          <BlogList key={i} blog={blog} />
        ))}
      </div>

      {/* Show footer only if total blogs exceed DEFAULT_COUNT */}
      {total > DEFAULT_COUNT && (
        <div className="blog-inner-footer">
          <div>
            <span className="blog-count">{shown} of {total}</span>
          </div>
          <button className="blog-loadmore-text" onClick={handleLoadMore}>
            {visibleCount >= blogs.length ? 'Show less ↑' : 'Load more...'}
          </button>
          <span></span>
        </div>
      )}

      <LandingFooter/>
    </div>
  );
};

export default Bloginner;
