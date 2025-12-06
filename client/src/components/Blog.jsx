import React, { useState, useEffect } from 'react';
import BlogList from './BlogList';
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom"; 
import './BlogStyles.css';

const Blog = () => {
  const { blogs } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(3);
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width > 1250) {
        setVisibleCount(3);
      } else if (width > 950) {
        setVisibleCount(4);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ navigate to Bloginner page when button clicked
  const handleShowMore = () => {
    navigate("/Blog");
  };

  return (
    <div id='blog' className="blog-section-landing">
      <h2  className="section__header">Popular Travel Stories & Trip Reports</h2>
      <p className="section__subheader">Journey through our inspiring travel experiences.</p>

      <div className="blog-grid">
        {blogs && blogs.length > 0 ? (
          blogs.slice(0, visibleCount).map((blog, i) => (
            <BlogList key={i} blog={blog} />
          ))
        ) : (
          <p>No blogs to display</p>
        )}
      </div>

      {blogs && blogs.length > visibleCount && (
        <button className="blog-show-more-btn" onClick={handleShowMore}>
          See More
        </button>
      )}
    </div>
  );
};

export default Blog;
