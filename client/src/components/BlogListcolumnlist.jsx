// BlogListColumn.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import './BlogStyles.css';
import HorizontalImageSlider from './HorizontalImageSlider';

const BlogListcolumnlist = () => {
  const { blogs } = useAppContext();
  const DEFAULT_COUNT = 12;
  const [visibleCount, setVisibleCount] = useState(DEFAULT_COUNT);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLoadMore = () => {
    if (visibleCount >= blogs.length) {
      setVisibleCount(DEFAULT_COUNT);
    } else {
      setVisibleCount(prev => Math.min(prev + 12, blogs.length));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const options = { year: "numeric", month: "short", day: "numeric" };
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", options);
  };

  const renderBlogCard = (blog) => {
    if (!blog) return null;
    const { title = "Untitled", description = "", _id = "", author = "Unknown", date = null, travelersPhoto, travelersName } = blog;

    const cleanDescription = (description || "")
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const trimmedDescription =
      cleanDescription.length > 60
        ? cleanDescription.substring(0, 60) + "..."
        : cleanDescription;

    return (
      <div key={_id} className="blog-card" onClick={() => _id && navigate(`/blog/${_id}`)}>
        {/* <div className="blog-card-image-container">
          <img className="blog-card-image" src={image} alt={title} />
          <div className="blog-card-overlay">
            <h3>Read More</h3>
          </div>
        </div> */}
        <div className="blog-card-content">
          <h3 className="blog-card-title">{title}</h3>
          <p className="blog-card-description">{trimmedDescription}</p>
          <div className="blog-card-footer">
            <p className="blog-card-author" style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
              {travelersPhoto && (
                <img
                  src={travelersPhoto}
                  alt={travelersName || author}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '10px'
                  }}
                />
              )}
              <span style={{ paddingTop: '2px', fontStyle: 'italic', fontSize: '14px', color: '#2c5282', fontFamily: 'Lisu Bosa' }}>
                {travelersName || author}
              </span>
            </p>
            <p className="blog-card-date">
              <i className="fa-solid fa-calendar-days"></i>
              {formatDate(date)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!Array.isArray(blogs) || blogs.length === 0) {
    return (
      <div id='blog' className="blog-section">
        {/* <h2 className="Discover-section__header">Popular Travel Stories & Trip Reports</h2>
        <p className="section__subheader">Explore our latest travel blogs.</p> */}
        <p>No blogs to display</p>
      </div>
    );
  }

  const total = blogs.length;
  const shown = Math.min(visibleCount, total);

  return (
    <div id='blog' className="blog-section">
      <div style={{ background: 'linear-gradient(135deg, rgb(44, 82, 130) 0%, rgb(74, 144, 189) 100%)', padding: '2.5rem 1.3rem' }}>
        <h2 className='blog---inner---title'>Popular Travel Stories & Trip Reports</h2>
        <p className="blog---inner---sub">Journey through our inspiring travel experiences.</p>
      </div>

      <div><HorizontalImageSlider/></div>

      <div className="blog-grid blog-grid-inner-pa">
        {blogs.slice(0, visibleCount).map(renderBlogCard)}
      </div>

      {total > DEFAULT_COUNT && (
        <div style={{marginBottom:"2.5rem"}} className="blog-inner-footer">

          <div>
            <span className="blog-count">{shown} of {total}</span>
          </div>
          <button className="blog-loadmore-text" onClick={handleLoadMore}>
            {visibleCount >= blogs.length ? 'Show less ↑' : 'Load more...'}
          </button>
           <div></div>
        </div>
      )}

     
    </div>
  );
};

export default BlogListcolumnlist;
