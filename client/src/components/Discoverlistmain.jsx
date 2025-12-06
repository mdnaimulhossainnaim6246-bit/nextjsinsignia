

// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../individualCSS/Discover/discoverlistmain.css";

// const DynamicDescription = ({ htmlDescription }) => {
//   const containerRef = useRef(null);
//   const [displayText, setDisplayText] = useState("");

//   useEffect(() => {
//     const doc = new DOMParser().parseFromString(htmlDescription, 'text/html');
//     const textContent = doc.body.textContent || "";
//     if (!containerRef.current) return;

//     let low = 0;
//     let high = textContent.length;
//     let mid;
//     const container = containerRef.current;

//     while (low < high) {
//       mid = Math.floor((low + high + 1) / 2);
//       container.innerText = textContent.slice(0, mid);
//       if (container.scrollHeight <= container.clientHeight) {
//         low = mid;
//       } else {
//         high = mid - 1;
//       }
//     }

//     container.innerText = textContent.slice(0, low) + (low < textContent.length ? '...' : '');
//     setDisplayText(container.innerText);
//   }, [htmlDescription]);

//   return (
//     <p
//       ref={containerRef}
//       className="discoverlistmain-description"
//       style={{ height: '50px', }}
//     >
//       {displayText}
//     </p>
//   );
// };

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
//     mapEmbedUrl,
//   } = discover;

//   const navigate = useNavigate();
//   const [showMap, setShowMap] = useState(false);

//   const getCategoryName = (discover) => {
//     if (!discover) return "";
//     if (discover.customCity) return discover.customCity;
//     if (discover.category && discover.category.title) return discover.category.title;
//     return "Unknown City";
//   };

//   return (
//     <div
//       className="discoverlistmain-card"
//     >
//       <div className="discoverlistmain-image-container">
//         {showMap ? (
//           <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//             <iframe
//               src={mapEmbedUrl}
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//               allowFullScreen=""
//               loading="lazy"
//               referrerPolicy="no-referrer-when-downgrade"
//             ></iframe>

//             <div
//               onClick={() => setShowMap(false)}
//               style={{
//                 position: 'absolute',
//                 top: '2px',
//                 left: '15px',
//                 cursor: 'pointer',
//                 backgroundColor: 'rgba(255,255,255)',
//                 padding: '1px 5px',
//                 fontFamily:'sans-serif',
//                 fontSize:'14px',
//                 border:'1px solid #333',
//                 lineHeight:'1.2',
//                 color:'#444'
    

//               }}
//             >
//               <i style={{ color:'#444',fontSize:'14px',lineHeight:'1',width:'7px',height:'4px' }}  className="fa-solid fa-angle-left"></i> Back
//             </div>
            
//           </div>
//         ) : (
//           <>
//             <img src={image} alt={place} className="discoverlistmain-image" />
//             <div
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowMap(true);
//               }}
//               style={{
//                 position: 'absolute',
//                 display:'flex',
//                 alignItems:'center',
//                 bottom: '6px',
//                 left: '6px',
//                 cursor: 'pointer',
//                 // backgroundColor: 'rgba(255,255,255,0.9)',
//                 padding: '0px 4px 8px 4px ',
//                 borderRadius: '50%',
//               }}
//               className='google-map-icon-div'
//             >
//               <img className='google-map-icon'  style={{width:'36px',height:'100%',transition:'all 0.3s'}} src="./assets/gps.png" alt="google-map" />
//               <p className="google-map-label">Map</p>
//             </div>
            
//             {destinationTagline && (
//               <div className="discoverlistmain-badge">{destinationTagline}</div>
//             )}
//           </>
//         )}
//       </div>

//       <div className="discoverlistmain-content">
//         <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center' }}>
//           <h3 className="destination-title">{place}</h3>
//           {rating > 0 && (
//             <span className="discoverlistmain-rating">
//               <span style={{ fontSize: '16px' }}>★</span> {rating.toFixed(1)}
//             </span>
//           )}
//         </div>

//         <div className="discoverlistmain-meta">
//           <span className="meta-item"><i className="fa-solid fa-city"></i> {getCategoryName(discover)}</span>
//           {destinationTheme && (
//             <span className="meta-item"> {destinationTheme}</span>
//           )}
//         </div>

//         {/* Dynamic description that fills available space */}
//         <DynamicDescription htmlDescription={description} />

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

//         <button onClick={() => !showMap && navigate(`/discoverplace/${encodeURIComponent(place)}`)} className="btn">
//           Explore Tours
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Discoverlistlanding;



import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../individualCSS/Discover/discoverlistmain.css";

// ----------- TEXT TRIM COMPONENT -------------
const DynamicDescription = ({ htmlDescription }) => {
  const containerRef = useRef(null);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const doc = new DOMParser().parseFromString(htmlDescription, 'text/html');
    const fullText = doc.body.textContent || "";

    if (!containerRef.current) return;

    const container = containerRef.current;
    let low = 0;
    let high = fullText.length;

    while (low < high) {
      const mid = Math.floor((low + high + 1) / 2);
      const partial = fullText.slice(0, mid);

      container.innerText = partial;
      if (container.scrollHeight <= container.clientHeight) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }

    const finalTrim = fullText.slice(0, low) + (low < fullText.length ? "..." : "");
    setDisplayText(finalTrim);

  }, [htmlDescription]);

  return (
    <p
      ref={containerRef}
      className="discoverlistmain-description"
      style={{ height: "50px", overflow: "hidden" }}
    >
      {displayText} 
    </p>
  );
};


// -------------- MAIN CARD COMPONENT ----------------
const Discoverlistlanding = ({ discover }) => {
  const {
    place,
    description,
    image,
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
    if (discover.category?.title) return discover.category.title;
    return "Unknown City";
  };

  return (
    <div className="discoverlistmain-card">

      <div className="discoverlistmain-image-container">
        {showMap ? (
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <div
              onClick={() => setShowMap(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                backgroundColor: "white",
                padding: '5px 14px 5px 14px',
                // padding: '0.5px 5px 1px 5px',
                // border: "1px solid #333",
                fontSize: "12px",
                color: "#1a73e8",
                lineHeight:'1.2',
                boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px',
                fontFamily:'Roboto'
              }}
            >
              Back<i style={{ color:'#1a73e8',fontSize:'12px',lineHeight:'1',width:'7px',height:'4px' }}  className="fa-solid fa-angle-right"></i>
            </div>
          </div>
        ) : (
          <>
            <img src={image} alt={place} className="discoverlistmain-image" />
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowMap(true);
              }}
              className="google-map-icon-div"
              style={{ position: "absolute", bottom: "6px", left: "6px", cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <img className="google-map-icon" style={{ width: "36px" }} src="./assets/gps.png" alt="map icon" />
              <p className="google-map-label">Map</p>
            </div>

            {destinationTagline && (
              <div className="discoverlistmain-badge">{destinationTagline}</div>
            )}
          </>
        )}
      </div>


      <div className="discoverlistmain-content">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 className="destination-title">{place}</h3>
          {rating > 0 && (
            <span className="discoverlistmain-rating">
              <span style={{ fontSize: "16px" }}>★</span> {rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="discoverlistmain-meta">
          <span className="meta-item"><i className="fa-solid fa-city"></i> {getCategoryName(discover)}</span>
          {destinationTheme && <span className="meta-item">{destinationTheme}</span>}
        </div>

        <DynamicDescription htmlDescription={description} />

        {whatToExperience?.some(item => item.checked) && (
          <div className="destination-highlights">
            <div className="highlights-title">What to Experience</div>
            <div className="highlights-list">
              {whatToExperience.filter(item => item.checked).map((item, index) => (
                <div key={index} className="highlight-item">{item.title}</div>
              ))}
            </div>
          </div>
        )}
        
        <div className='button-div-discovermain'>
        <button
          onClick={() => navigate(`/discoverplace/${encodeURIComponent(place)}`)}
          className="btn"
        >
          Explore
        </button>
        </div>
      </div>

    </div>
  );
};

export default Discoverlistlanding;


