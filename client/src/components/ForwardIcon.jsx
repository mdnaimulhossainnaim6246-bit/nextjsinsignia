import React, { useState, useEffect } from 'react';

const ForwardIcon = ({ onClick }) => {
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
      className="ForwardIcon-button-wrapper"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
     <animated-icons
  src="https://animatedicons.co/get-icon?name=Forward&style=minimalistic&token=61ef98d6-f61b-49ac-a0f3-46fec965e300"
  trigger="click"
  attributes='{"variationThumbColour":"#FFFFFF","variationName":"Normal","variationNumber":1,"numberOfGroups":1,"backgroundIsGroup":false,"strokeWidth":2.5,"defaultColours":{"group-1":"#000000","background":"#FFFFFF"}}'
  height="28"
  width="28"
></animated-icons>
      
    </div>
  );
};

export default ForwardIcon;
