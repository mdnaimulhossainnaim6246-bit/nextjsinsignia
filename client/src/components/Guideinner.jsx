import React, { useState, useEffect } from 'react';
import GuideList from './GuideList';
import { useAppContext } from "../context/AppContext";
import './GuideStyles.css';
import Mobailenav from './Mobailenav';
import LandingFooter from './LandingFooter';
import Loader from './Loader';

const Guideinner = () => {
  const { axios } = useAppContext();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const DEFAULT_COUNT = 12; 
  const [visibleCount, setVisibleCount] = useState(DEFAULT_COUNT);

  useEffect(() => {
    const fetchGuides = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/addguide/all');
            if (data.success) {
                setGuides(data.guides);
            }
        } catch (error) {
            console.error("Failed to fetch guides", error);
        } finally {
            setLoading(false);
        }
    };
    fetchGuides();
  }, [axios]);

  if (loading) {
      return <Loader />;
  }

  if (!guides || guides.length === 0) {
    return (
      <div id='guide' className="guide-section">
        <h2 className="Discover-section__header">Read Our Latest Guides</h2>
        <p className="section__subheader">Explore our latest travel guides.</p>
        <p>No guides to display</p>
      </div>
    );
  }

  const total = guides.length;
  const shown = Math.min(visibleCount, total);

  const handleLoadMore = () => {
    if (visibleCount >= guides.length) {
      setVisibleCount(DEFAULT_COUNT);
    } else {
      setVisibleCount(prev => Math.min(prev + 12, guides.length));
    }
  };

  return (
    <div id='guide' className="guide-section">
      <Mobailenav/>
      <div style={{background:'linear-gradient(135deg, rgb(44, 82, 130) 0%, rgb(74, 144, 189) 100%)',padding:'2.5rem 0'}}>
        <h2 className='guide---inner---title'>Bangladesh Travel Highlights</h2>
        <p className="guide---inner---sub">Complete guide to Bangladesh’s destinations, culture, food, and travel essentials.</p>
      </div>

      <div style={{padding:'2rem'}}>
      <div className="guide-grid">
        {guides.slice(0, visibleCount).map((guide, i) => (
          <GuideList key={i} guide={guide} />
        ))}
      </div>
      </div>

      {total > DEFAULT_COUNT && (
        <div className="guide-inner-footer">
          <div>
            <span className="guide-count">{shown} of {total}</span>
          </div>
          <button className="guide-loadmore-text" onClick={handleLoadMore}>
            {visibleCount >= guides.length ? 'Show less ↑' : 'Load more...'}
          </button>
          <span></span>
        </div>
      )}

      <LandingFooter/>
    </div>
  );
};

export default Guideinner;
