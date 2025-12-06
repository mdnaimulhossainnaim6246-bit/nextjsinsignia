// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../individualCSS/discovernewlanding.css";

// const Discoverlistlanding = ({ discover }) => {
//   const {
//     place,
//     description,
//     image,
//     _id,
//     rating,
//     destinationTagline,
//     destinationTheme,
//     whatToExperience,
//   } = discover;
//   const navigate = useNavigate();

//   const getCategoryName = (discover) => {
//     if (!discover) return "";
//     if (discover.customCity) return discover.customCity;
//     if (discover.category && discover.category.title)
//       return discover.category.title;
//     return "Unknown City";
//   };

//   const cleanAndTrimDescription = (htmlDescription, letterLimit) => {
//     const doc = new DOMParser().parseFromString(htmlDescription, 'text/html');
//     const textContent = doc.body.textContent || "";

//     if (textContent.length > letterLimit) {
//         return textContent.slice(0, letterLimit) + '...';
//     }
//     return textContent;
// };


//   const trimmedDescription = cleanAndTrimDescription(description, 220);

//   return (
//     <div
//       className="destination-card"
//       onClick={() => navigate(`/discoverplace/${encodeURIComponent(place)}`)}
//     >
//       <div className="destination-image-container">
//         <img src={image} alt={place} className="destination-image" />
//         {destinationTagline && (
//           <div className="destination-badge">{destinationTagline}</div>
//         )}
//       </div>
//       <div className="destination-content">
//         <div style={{display:'flex',justifyContent:"space-between",alignItems:'center'}}>
//         <h3 className="destination-title">
//           {place}         
//         </h3>
//         {rating > 0 && (
//             <span className="destination-rating">
//              <span style={{fontSize:'16px'}}>★</span> {rating.toFixed(1)}
//             </span>
//           )}
//         </div>

//         <div className="destination-meta">
//           <span className="meta-item">📍 {getCategoryName(discover)}</span>
//           {destinationTheme && (
//             <span className="meta-item"> {destinationTheme}</span>
//           )}
//         </div>
//         <p className="destination-description">{trimmedDescription}</p>
//         {whatToExperience && whatToExperience.some(item => item.checked) && (
//           <div className="destination-highlights">
//             <div className="highlights-title">What to Experience</div>
//             <div className="highlights-list">
//               {whatToExperience
//                 .filter((item) => item.checked)
//                 .map((item, index) => (
//                   <div key={index} className="highlight-item">
//                     {item.title}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         )}
//         <a href="#" className="btn">
//           Explore Tours
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Discoverlistlanding;


import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../individualCSS/discovernewlanding.css";

const DynamicDescription = ({ htmlDescription }) => {
  const containerRef = useRef(null);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const doc = new DOMParser().parseFromString(htmlDescription, 'text/html');
    const textContent = doc.body.textContent || "";
    if (!containerRef.current) return;

    let low = 0;
    let high = textContent.length;
    let mid;
    const container = containerRef.current;

    while (low < high) {
      mid = Math.floor((low + high + 1) / 2);
      container.innerText = textContent.slice(0, mid);
      if (container.scrollHeight <= container.clientHeight) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }

    container.innerText = textContent.slice(0, low) + (low < textContent.length ? '...' : '');
    setDisplayText(container.innerText);
  }, [htmlDescription]);

  return (
    <p
      ref={containerRef}
      className="destination-description"
      style={{ height: '100%', margin: 0 }}
    >
      {displayText}
    </p>
  );
};

const Discoverlistlanding = ({ discover }) => {
  const {
    place,
    description,
    image,
    _id,
    rating,
    destinationTagline,
    destinationTheme,
    whatToExperience,
    mapEmbedUrl,
  } = discover;

  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);

  const getCategoryName = (discover) => {
    if (!discover) return "";
    if (discover.customCity) return discover.customCity;
    if (discover.category && discover.category.title) return discover.category.title;
    return "Unknown City";
  };

  return (
    <div
      className="destination-card"
    >
      <div className="destination-image-container">
        {showMap ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <div
              onClick={() => setShowMap(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                backgroundColor: 'rgba(255,255,255)',
                // padding: '0.5px 5px 1px 5px',
                padding: '5px 14px 5px 14px',
                boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px',
                fontFamily:'Roboto',
                fontFamily:'sans-serif',
                fontSize:'12px',
                // border:'1px solid #333',
                color: "#1a73e8",
                lineHeight:'1.2',
                
              }}
            >
              Back<i style={{ color:'#1a73e8',fontSize:'12px',lineHeight:'1',width:'7px',height:'4px' }}  className="fa-solid fa-angle-right"></i>
            </div>
            
          </div>
        ) : (
          <>
            <img src={image} alt={place} className="destination-image" />
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowMap(true);
              }}
              style={{
                position: 'absolute',
                display:'flex',
                alignItems:'center',
                bottom: '6px',
                left: '6px',
                cursor: 'pointer',
                // backgroundColor: 'rgba(255,255,255,0.9)',
                padding: '0px 4px 8px 4px ',
                borderRadius: '50%',
              }}
              className='google-map-icon-div'
            >
              <img className='google-map-icon'  style={{width:'36px',height:'100%',transition:'all 0.3s'}} src="./assets/gps.png" alt="google-map" />
              <p className="google-map-label">Map</p>
            </div>
            
            {destinationTagline && (
              <div className="destination-badge">{destinationTagline}</div>
            )}
          </>
        )}
      </div>

      <div className="destination-content">
        <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
          <h3 className="destination-title">{place}</h3>
          {rating > 0 && (
            <span className="destination-rating">
              <span style={{ fontSize: '16px' }}>★</span> {rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="destination-meta">
          <span className="meta-item"><i className="fa-solid fa-city"></i> {getCategoryName(discover)}</span>
          {destinationTheme && (
            <span className="meta-item"> {destinationTheme}</span>
          )}
        </div>

        {/* Dynamic description that fills available space */}
        {/* <DynamicDescription htmlDescription={description} /> */}

        {whatToExperience && whatToExperience.some(item => item.checked) && (
          <div className="destination-highlights">
            <div className="highlights-title">What to Experience</div>
            <div className="highlights-list">
              {whatToExperience
                .filter((item) => item.checked)
                .map((item, index) => (
                  <div key={index} className="highlight-item">
                    {item.title}
                  </div>
                ))}
            </div>
          </div>
        )}

        <button onClick={() => navigate(`/discoverplace/${encodeURIComponent(place)}`)} className="btn">
          Explore
        </button>
      </div>
    </div>
  );
};

export default Discoverlistlanding;



