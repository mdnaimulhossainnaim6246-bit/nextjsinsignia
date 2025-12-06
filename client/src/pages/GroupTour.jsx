// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../context/AppContext';
// import toast from 'react-hot-toast';
// import "../pages/admin/QuillEditor.css";
// import DiscoverArticle from './discoverarticle';

// const MONTHS_ORDER = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December'
// ];

// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   const options = { month: "short", day: "numeric", year: "numeric" };
//   return date.toLocaleDateString("en-US", options);
// };

// const formatDateRange = (start, end) => {
//   const startDate = new Date(start);
//   const endDate = new Date(end);

//   const oneDay = 24 * 60 * 60 * 1000;
//   const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

//   let rangeText = "";
//   if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
//     rangeText = `${startDate.getDate()}–${endDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })}, ${startDate.getFullYear()}`;
//   } else {
//     rangeText = `${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })} – ${endDate.getDate()} ${endDate.toLocaleString('default', { month: 'short' })}, ${startDate.getFullYear()}`;
//   }

//   return (
//     <>
//       {rangeText}{" "}
//       <span style={{ fontSize: "12px", color: "#2c5282" }}>({diffDays} days)</span>
//     </>
//   );
// };

// const GroupTour = () => {
//   const { axios } = useAppContext();
//   const [toursByYearMonth, setToursByYearMonth] = useState({});
//   const [loading, setLoading] = useState(true);

//   const [screenWidth, setScreenWidth] = useState(window.innerWidth);
//   const isMobile = screenWidth < 768;

//   useEffect(() => {
//     const resize = () => setScreenWidth(window.innerWidth);
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);

//   useEffect(() => {
//     const fetchTours = async () => {
//       try {
//         const { data } = await axios.get('/addgrouptour/all');

//         if (data.success) {
//           const groups = data.tours.reduce((acc, tour) => {
//             const year = tour.year || new Date(tour.startDate).getFullYear();
//             const month =
//               tour.month ||
//               new Date(tour.startDate).toLocaleString('default', { month: 'long' });

//             if (!acc[year]) acc[year] = {};
//             if (!acc[year][month]) acc[year][month] = [];
//             acc[year][month].push(tour);

//             return acc;
//           }, {});

//           const sorted = Object.keys(groups)
//             .sort((a, b) => b - a)
//             .reduce((acc, year) => {
//               acc[year] = groups[year];
//               return acc;
//             }, {});

//           setToursByYearMonth(sorted);
//         } else {
//           toast.error("Failed to fetch group tours.");
//         }
//       } catch {
//         toast.error("An error occurred while fetching group tours.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTours();
//   }, [axios]);

//   const styles = {
//     container: {
//       maxWidth: "100%",
//       margin: "0 auto",
//       background: "#fff",
//       height:'100%',
//       paddingBottom:'1.5rem'
//     },
//     mainContent: {
//       display: 'flex',
//       flexDirection: isMobile ? 'column' : 'row',
//       maxWidth: '1200px',
//       margin: '0 auto',
//     },
//     leftColumn: {
//       flex: isMobile ? '1' : '2',
//       marginRight: isMobile ? '0' : '20px',
//     },
//     rightColumn: {
//       flex: '1',
//     },
//     header: {
//       textAlign: "center",
//       fontSize: "2rem",
//       fontWeight: "500",
//       marginBottom: "20px",
//       color: "#fff", 
//       background: "linear-gradient(135deg, #2c5282 0%, #4a90bd 100%)",
//       padding: "5rem 6%",
//     },
//     loadingText: {
//       textAlign: "center",
//       fontSize: "18px",
//     },
//     yearHeader: {
//       fontSize: "2rem",
//       marginTop: "40px",
//       marginBottom: "18px",
//       color: "#1d3557",
//       borderBottom: "2px solid #ddd",
//       paddingBottom: "6px",
//       maxWidth:'595px'
//     },
//     monthHeader: {
//       fontSize: "1.5rem",
//       marginBottom: "15px",
//       color: "#457b9d",
//       maxWidth:'590px',
//     },
//     monthSection: {
//       marginBottom: "40px",
//     },
//     card: {
//       background: "#fff",
//       border: "1px solid #eaeaea",
//       borderRadius: "10px",
//       padding: "12px",
//       boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
//       maxWidth:'590px',
//       margin:'10px',
//       position:'relative'
//     },
//     cardImage: {
//       width: "100px",
//       height: "100px",
//       borderRadius: "10px",
//       objectFit: "cover",
//       float: "left",
//       marginRight: "12px",
//       marginBottom: "5px",
//     },
//     tourTitle: {
//       fontSize: "1.2rem",
//       fontWeight: "600",
//       color: "#1d3557",
//       display:'none'
//     },
//     description: {
//       color: "#333",
//       marginTop: "6px",
//       paddingBottom: "14px",
//     },
//     cardText: {
//       fontSize: "14px",
//       color: "#2c5282",
//       fontFamily:'Inter',
//       textAlign:'right',
//       paddingRight:'10px',
//       position:'absolute',
//       right:'10px',
//       bottom:'5px',
//     },
//   };

//   return (
//     <div style={{ background: '#fff', height: '100%' }}>
//       <div style={styles.container}>
//         <h1 style={styles.header}>Group Tour - Packages Schedule in Bangladesh</h1>

//         {loading ? (
//           <p style={styles.loadingText}>Loading...</p>
//         ) : (
//           <div style={styles.mainContent}>
//             <div style={styles.leftColumn}>
//               {Object.keys(toursByYearMonth).map((year) => (
//                 <div key={year}>
//                   <h2 style={styles.yearHeader}>{year}</h2>

//                   {Object.keys(toursByYearMonth[year])
//                     .sort((a, b) => MONTHS_ORDER.indexOf(a) - MONTHS_ORDER.indexOf(b))
//                     .map((month) => (
//                       <div key={month} style={styles.monthSection}>
//                         <h3 style={styles.monthHeader}>{month}</h3>

//                         <div>
//                           {toursByYearMonth[year][month].map((tour) => (
//                             <div key={tour._id} style={styles.card}>
//                               <img
//                                 src={tour.image}
//                                 alt={tour.title}
//                                 style={styles.cardImage}
//                               />
//                               <h3 style={styles.tourTitle}>{tour.title}</h3>
//                               <div
//                                 className='ql_editor'
//                                 style={styles.description}
//                                 dangerouslySetInnerHTML={{ __html: tour.description }}
//                               />
//                               <p style={styles.cardText}>
//                                 {formatDateRange(tour.startDate, tour.endDate)}
//                               </p>
//                               <div style={{ clear: "both" }}></div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               ))}
//             </div>
//             <div style={styles.rightColumn}>
//               <DiscoverArticle />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GroupTour;

import React, { useState, useEffect } from "react";
import DiscoverArticle from "./discoverarticle";
import GroupTourList from "../components/GroupTourList";
import Mobailenav from "../components/Mobailenav";

const GroupTour = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 975);

  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 975);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

   useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}, []);


  const Styles = {
    header: {
      textAlign: "center",
      fontSize: "2rem",
      fontWeight: "500",
      marginBottom: "20px",
      color: "#fff",
      background: "linear-gradient(135deg, #2c5282 0%, #4a90bd 100%)",
      padding: "5rem 6%",
    },

    subheader:{
      textAlign: "left",
      fontSize: "0.9rem",
      fontWeight: "500",
      marginBottom: "20px",
      color: "#333",
      padding:'1rem 6%',
      fontWeight: "400", 
    },

    layout: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      maxWidth: "1200px",
      margin: "0 auto",
      gap: "50px",
      padding: "20px",

      // ✅ Mobile: center content
      alignItems: isMobile ? "center" : "flex-start",
    },

    left: {
      flex: 2,
      width: isMobile ? "100%" : "auto",
      maxWidth: isMobile ? "600px" : "100%",
      margin: isMobile ? "0 auto" : "0",
    },

    right: {
      flex: 1,
      width: isMobile ? "100%" : "auto",
      maxWidth: isMobile ? "450px" : "100%",
      margin: isMobile ? "0 auto" : "0",
    },
  };

  return (
    <div style={{ background: "#fff" }}>
      <Mobailenav/>
      <h1 style={Styles.header}>
        Group Tour - Packages Schedule in Bangladesh
      </h1>

      <h2 style={Styles.subheader} >Discover the most thoughtfully curated <strong style={{fontWeight:'600',color:'#457b9d'}}>group tour packages in Bangladesh</strong>.
          Insignia offers small-group cultural journeys designed for travelers from around the world — crafted to suit people of all ages who seek comfort, authenticity, and adventure.
          With guaranteed departures, expert local guides, and handpicked experiences, every tour ensures a smooth and memorable journey.
          From the <strong style={{fontWeight:'600',color:'#457b9d'}}>mystic Sundarbans to ancient archaeological wonders and the vibrant rhythm of rural life</strong>, explore the true essence of Bangladesh with safety, comfort, and style.🌿
      </h2>

      <div style={Styles.layout}>
        {/* ✅ LEFT CONTENT */}
        <div style={Styles.left}>
          <GroupTourList />
        </div>

        {/* ✅ RIGHT CONTENT */}
        <div style={Styles.right}>
          <DiscoverArticle />
        </div>
      </div>
    </div>
  );
};

export default GroupTour;
