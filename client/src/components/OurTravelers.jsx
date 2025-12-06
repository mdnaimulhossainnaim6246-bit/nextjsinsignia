import React, { useState, useEffect } from 'react';
import OurTravelerslist from './OurTravelerslist';
import { useAppContext } from "../context/AppContext";
import './OurTravelers.css'


const OurTravelers = () => {
  const { ourTravelers } = useAppContext();
  const INITIAL_COUNT = 3;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

 useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;
    if (width > 900) setVisibleCount(INITIAL_COUNT);
    else if (width > 600) setVisibleCount(4);
    else setVisibleCount(3);
  };
  handleResize();
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


  const handleLoadMore = () => setVisibleCount(ourTravelers.length);
  const handleShowLess = () => setVisibleCount(INITIAL_COUNT);

  const visibleMembers = ourTravelers ? ourTravelers.slice(0, visibleCount) : [];

  // ✅ Inline CSS for button
  const buttonStyle = {
  background: "linear-gradient(135deg, #2b8dca, #55bde9)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontSize: "1rem",
  fontWeight: 500,
  cursor: "pointer",
  border: "none",
  backgroundClip: "text",
  transition: "transform 0.2s ease, opacity 0.2s ease",
  };

  return (
    <div >
      <section id='ourtravelers' className="our-travelers-container discover_container tour__container">
        {/* <h2 className="section__header">Our Team Members</h2>
        <p className="section__subheader">
          Meet the dedicated team behind our success.
        </p> */}

        <div className="discover__grid">
          {visibleMembers.map((member, index) => (
            <OurTravelerslist key={index} blog={member} />
          ))}
        </div>

        {ourTravelers && ourTravelers.length > INITIAL_COUNT && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            {visibleCount < ourTravelers.length ? (
              <button
                style={buttonStyle}
                onClick={handleLoadMore}
              >
                Load More...
              </button>
            ) : (
              <button
                style={buttonStyle}
                onClick={handleShowLess}
              >
                Show Less↑
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default OurTravelers;