// import React, { useState, useEffect, useRef } from 'react';
// import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
// import '../individualCSS/Packages/packageslist.css';

// const Packageslist = ({ packages }) => {
//   const { place, description, image, _id, rating, duration, latestPrice, oldPrice } = packages;
//   const [showFullTitle, setShowFullTitle] = useState(false);
//   const titleRef = useRef(null); // ref for detecting outside click
//   const navigate = useNavigate();

//   // ✅ Close popup when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (titleRef.current && !titleRef.current.contains(event.target)) {
//         setShowFullTitle(false);
//       }
//     };

//     if (showFullTitle) {
//       document.addEventListener('click', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [showFullTitle]);

//   const calculateDiscount = (oldPrice, latestPrice) => {
//     if (!oldPrice || !latestPrice || oldPrice <= latestPrice) {
//       return null;
//     }
//     const discount = ((oldPrice - latestPrice) / oldPrice) * 100;
//     return discount % 1 === 0 ? discount : discount.toFixed(0);
//   };

//   const discountPercentage = calculateDiscount(oldPrice, latestPrice);

//   // ✅ Card click = navigate to details (same tab)
//   const handleCardClick = () => {
//     navigate(`/package-details/${encodeURIComponent(place)}`);
//   };

//   return (
//     <>
//       <div className="package-card-landing">
//         <div className="package-card-image-container">
//           <img src={image} alt={`${place} thumbnail`} className="package-card-image" />
//           {discountPercentage && (
//             <div className="package-card-discount-badge">{discountPercentage}% <br /> <span style={{fontFamily:'lisu bosa'}}>OFF</span> </div>
//           )}
//         </div>

//         <div className="package-card-content">
//           <div className="package-card-location-rating">
//             {/* ✅ Title with truncation, toggle, and arrow rotation */}
//             <h4
//               ref={titleRef}
//               className="package-card-title"
//               onClick={(e) => {
//                 e.stopPropagation(); // prevent card click
//                 if (place.length > 10) {
//                   setShowFullTitle(!showFullTitle);
//                 }
//               }}
//               title={place}
//             >
//               {place.length > 10 ? (
//                 <>
//                   {place.slice(0, 15)}..
//                   <i
//                     className={`fa-solid fa-angle-down ${showFullTitle ? 'rotate-up' : ''}`}
//                     style={{
//                       marginLeft: '4px',
//                       fontSize: '12px',
//                       color: '#555',
//                       transition: 'transform 0.3s ease',
//                     }}
//                   ></i>
//                 </>
//               ) : (
//                 place
//               )}
//             </h4>

//             {/* ✅ Popup */}
//             {showFullTitle && <div className="title-popup">{place}</div>}

//             <div className="package-card-rating">
//               <span className="star-icon">★</span>
//               <span
//                 style={{
//                   color: '#777',
//                   fontFamily: 'Poppins',
//                   fontWeight: '400',
//                   fontSize: '14px',
//                 }}
//               >
//                 {rating}.0
//               </span>
//             </div>
//           </div>

//           <div className="package-card-details">
//             <div className="package-card-price">
//               <span
//                 className="package-card-latest-price-inner"
//                 style={{
//                   color: oldPrice && oldPrice > latestPrice ? 'green' : '#007bff',
//                 }}
//               >
//                 ${latestPrice}
//               </span>
//               {oldPrice && (
//                 <span
//                   style={{ color: '#888', textDecoration: 'line-through' }}
//                   className="package-card-old-price"
//                 >
//                   ${oldPrice}
//                 </span>
//               )}
//             </div>
//             {duration && (
//               <p className="package-card-duration">
//                 <i className="fa-solid fa-clock"></i>
//                 {duration.value} {duration.unit}(s)
//               </p>
//             )}
//           </div>

//           {/* ✅ Only button opens new tab */}

//           <div className="package-card-button-div" >
//           <a
//             className="package-card-button"
//             onClick={handleCardClick}
//           >
//             check Details
//           </a>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Packageslist;




import React, { useState, useEffect, useRef } from 'react';
// import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import '../individualCSS/Packages/packageslist.css';

const Packageslist = ({ packages }) => {
  const { place, description, image, _id, rating, duration, latestPrice, oldPrice } = packages;
  const [showFullTitle, setShowFullTitle] = useState(false);
  const titleRef = useRef(null); // ref for detecting outside click
  const navigate = useNavigate();

  // ✅ Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (titleRef.current && !titleRef.current.contains(event.target)) {
        setShowFullTitle(false);
      }
    };

    if (showFullTitle) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showFullTitle]);

  // ✅ Calculate discount
  const calculateDiscount = (oldPrice, latestPrice) => {
    if (!oldPrice || !latestPrice || oldPrice <= latestPrice) {
      return null;
    }
    const discount = ((oldPrice - latestPrice) / oldPrice) * 100;
    return discount % 1 === 0 ? discount : discount.toFixed(0);
  };

  const discountPercentage = calculateDiscount(oldPrice, latestPrice);

  // ✅ Gradient color based on discount range
  const getGradientColor = (value) => {
    if (value <= 10) return "linear-gradient(135deg, #fa2537f5, #ff5100d2)";
    else if (value <= 20) return "linear-gradient(135deg, #ff6a00, #ee0979)";
    else if (value <= 30) return "linear-gradient(135deg, #ff512f, #dd2476)";
    else if (value <= 40) return "linear-gradient(135deg, #f7971e, #ffd200)";
    else if (value <= 50) return "linear-gradient(135deg, #56ab2f, #a8e063)";
    else if (value <= 60) return "linear-gradient(135deg, #43cea2, #185a9d)";
    else if (value <= 70) return "linear-gradient(135deg, #4776e6, #8e54e9)";
    else if (value <= 80) return "linear-gradient(135deg, #7F00FF, #E100FF)";
    else if (value <= 90) return "linear-gradient(135deg, #f953c6, #b91d73)";
    else return "linear-gradient(135deg, #ff416c, #ff4b2b)";
  };

  // ✅ Card click = navigate to details (same tab)
  const handleCardClick = () => {
    navigate(`/tour-packages-details/${encodeURIComponent(place)}`);
  };

  return (
    <>
      <div className="package-card-landing">
        <div className="package-card-image-container">
          <img style={{cursor:"pointer"}} onClick={handleCardClick} src={image} alt={`${place} thumbnail`} className="package-card-image" />

          {/* ✅ Dynamic discount badge */}
          {discountPercentage && (
            <div
              className="package-card-discount-badge"
              style={{
                background: getGradientColor(discountPercentage),
                color: "#fff",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {discountPercentage}% <br />
              <span style={{ fontFamily: 'Lisu Bosa' }}>OFF</span>
            </div>
          )}
        </div>

        <div className="package-card-content">
          <div className="package-card-location-rating">
            
            <h4
              ref={titleRef}
              className="package-card-title"
              onClick={(e) => {
                e.stopPropagation(); 
                if (place.length > 10) {
                  setShowFullTitle(!showFullTitle);
                }
              }}
              title={place}
            >
              {place.length > 10 ? (
                <>
                  {place.slice(0, 15)}..
                  <i
                    className={`fa-solid fa-angle-down ${showFullTitle ? 'rotate-up' : ''}`}
                    style={{
                      marginLeft: '4px',
                      fontSize: '12px',
                      color: '#555',
                      transition: 'transform 0.3s ease',
                    }}
                  ></i>
                </>
              ) : (
                place
              )}
            </h4>

            {/* ✅ Popup */}
            {showFullTitle && <div className="title-popup">{place}</div>}

            <div className="package-card-rating">
              <span className="star-icon">★</span>
              <span
                style={{
                  color: '#777',
                  fontFamily: 'Poppins',
                  fontWeight: '400',
                  fontSize: '14px',
                }}
              >
                {rating}.0
              </span>
            </div>
          </div>

          <div className="package-card-details">
            <div className="package-card-price">
              <span
                className="package-card-latest-price-inner"
                style={{
                  color: oldPrice && oldPrice > latestPrice ? 'green' : '#2b8dca',
                }}
              >
                ${latestPrice}
              </span>
              {oldPrice && (
                <span
                  style={{ color: '#bd0f0f', textDecoration: 'line-through' }}
                  className="package-card-old-price"
                >
                  ${oldPrice}
                </span>
              )}
            </div>
            {/* {duration && (
              <p className="package-card-duration">
                <i className="fa-solid fa-clock"></i>
                {duration.value} {duration.unit}(s)
              </p>
            )} */}
            {duration && (
               <p className="package-card-duration">
                 <i className="fa-solid fa-clock"></i>
                 {duration.value} {duration.unit}{duration.value > 1 ? 's' : ''}
               </p>
             )}

          </div>

          {/* ✅ Only button opens new tab */}
          <div className="package-card-button-div">
            <a
              className="package-card-button"
              onClick={handleCardClick}
            >
              Check Details
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Packageslist;
