import React, { useState, useEffect } from 'react';

const FilterButton = ({ onClick }) => {
  const [visible, setVisible] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const handleMouseEnter = () => {
    setVisible(true);          // DOM te span show korbe
    // fadeIn ke ekto por delay diye true korbo animation properly start hote
    setTimeout(() => setFadeIn(true), 10);
  };

  const handleMouseLeave = () => {
    setFadeIn(false);          // fade out start hobe
    // animation sesh hole DOM theke remove korbo
    setTimeout(() => setVisible(false), 300); // animation duration
  };

  return (
    <div
      className="filter-button-wrapper"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <animated-icons
  src="https://animatedicons.co/get-icon?name=Filter&style=minimalistic&token=3212fd28-c62a-42db-8421-bf1f6a3fd239"
  trigger="click"
  attributes='{"variationThumbColour":"#536DFE","variationName":"Two Tone","variationNumber":2,"numberOfGroups":2,"backgroundIsGroup":false,"strokeWidth":1,"defaultColours":{"group-1":"#000000","group-2":"#007BFFFF","background":"#FFFFFF"}}'
  height="40"
  width="40"
></animated-icons>

      {visible && (
        <span className={`filter-hover-text ${fadeIn ? 'fade-in' : 'fade-out'}`}>
          Filter
        </span>
      )}
    </div>
  );
};

export default FilterButton;
