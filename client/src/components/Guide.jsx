import React, { useState, useEffect } from 'react';
import GuideList from './GuideList';
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom"; 
import './GuideStyles.css';
import Loader from './Loader';

const Guide = () => {
  const { axios } = useAppContext();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const navigate = useNavigate(); 

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

  // useEffect(() => {
  //   const handleResize = () => {
  //     const width = window.innerWidth;
  //     if (width > 1250) setVisibleCount(3);
  //     else if (width > 950) setVisibleCount(4);
  //     else setVisibleCount(2);
  //   };
  //   handleResize();
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  useEffect(() => {
  setVisibleCount(2);
}, []);


  const handleShowMore = () => {
    navigate("/travel-guides"); // This will be the route for the full list
  };

  if (loading) {
      return <Loader />
  }

  return (
    <div id='highlights' className="guide-section-landing">
      <h2 className="section__header">Bangladesh Travel Highlights</h2>
      <p className="section__subheader">Complete guide to Bangladesh’s destinations, culture, food, and travel essentials.</p>

      <div className="guide-grid">
        {guides && guides.length > 0 ? (
          guides.slice(0, visibleCount).map((guide, i) => (
            <GuideList key={i} guide={guide} />
          ))
        ) : (
          <p>No guides to display</p>
        )}
      </div>

      {guides && guides.length > visibleCount && (
        <button className="guide-show-more-btn" onClick={handleShowMore}>
          See More 
        </button>
      )}
    </div>
  );
};

export default Guide;
