import React, { useState, useEffect } from 'react';

const BackwardIcon = ({ onClick }) => {
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
      className="BackwardIcon-button-wrapper"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
     <animated-icons className="icon-inline"
  src="https://animatedicons.co/get-icon?name=Back&style=minimalistic&token=7a22709d-7dc4-4654-b0d6-df0167ffeb74"
  trigger="click"
  attributes='{"variationThumbColour":"#FFFFFF","variationName":"Normal","variationNumber":1,"numberOfGroups":1,"backgroundIsGroup":false,"strokeWidth":2.5,"defaultColours":{"group-1":"#000000","background":"#FFFFFF"}}'
  height="35"
  width="39"
  
></animated-icons>
      
    </div>
  );
};


export default BackwardIcon;
