
// import React, { useRef, useState, useEffect } from 'react';
// import useCountUp from '../hooks/useCountUp';
// import "./About.css";

// const AchievementCard = ({ item }) => {
//   const { key, value } = item;
//   const ref = useRef();
//   const [startCount, setStartCount] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           // Trigger count when entering viewport
//           setStartCount(false); // reset first
//           setTimeout(() => setStartCount(true), 50); // small delay to reset hook
//         }
//       },
//       { threshold: 0.3 }
//     );

//     if (ref.current) observer.observe(ref.current);

//     return () => observer.disconnect();
//   }, []);

//   const count = useCountUp(startCount ? value : 0, 2000);

//   const formatValue = (key, val) => {
//     if (key === 'satisfactionRate' || key === 'successRate') return `${val}%`;
//     else if (
//       key === 'happyTravelers' ||
//       key === 'tourPackages' ||
//       key === 'yearsExperience' ||
//       key === 'destinationCovered' ||
//       key === 'freeTour' ||
//       key === 'positiveReviews'
//     )
//       return `${val}+`;
//     return val;
//   };

//   return (
//     <div className="achievement-card" ref={ref}>
//       <h3 className='about-stat-number'>{formatValue(key, count)}</h3>
//       <p className='about-stat-label'>{key.replace(/([A-Z])/g, ' $1')}</p>
//     </div>
//   );
// };

// export default AchievementCard;


import React, { useRef, useState, useEffect } from 'react';
import useCountUp from '../hooks/useCountUp';
import "./About.css";

const AchievementCard = ({ item }) => {
  const { key, value } = item;

  // ✅ Hide successRate + teamMember
  if (key === "successRate" || key === "totalTeamMember" || key === "positiveReviews" || key === "tourPackages" || key === "freeTour") return null;

  const ref = useRef();
  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(false);
          setTimeout(() => setStartCount(true), 50);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  const count = useCountUp(startCount ? value : 0, 2000);

  const formatValue = (key, val) => {
    if (key === 'satisfactionRate') return `${val}%`;
    else if (
      key === 'happyTravelers' ||
      key === 'tourPackages' ||
      key === 'yearsExperience' ||
      key === 'destinationCovered' ||
      key === 'freeTour' ||
      key === 'positiveReviews'
    )
      return `${val}+`;
    return val;
  };

  return (
    <div className="achievement-card" ref={ref}>
      <h3 className='about-stat-number'>{formatValue(key, count)}</h3>
      <p className='about-stat-label'>
        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
     </p>

    </div>
  );
};

export default AchievementCard;
