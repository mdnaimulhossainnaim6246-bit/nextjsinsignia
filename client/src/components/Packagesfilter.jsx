

// import React, { useState, useMemo, useEffect } from 'react';
// import { useAppContext } from "../context/AppContext";
// import "../individualCSS/Discover/discover.css";
// import Packageslistinner from './Packageslistinner';
// import { useNavigate } from 'react-router-dom';

// const categoryDescriptions = {
//   "Free Tour": "Explore the city's hidden gems without spending a dime. Our free tours are led by passionate local guides who will show you the best of what the city has to offer.",
//   "All Prime Destinations": "Visit all the must-see attractions with our All Prime Destinations package. This comprehensive tour covers all the iconic landmarks and hidden treasures.",
//   "Historic Places Tour": "Step back in time with our Historic Places Tour. Discover the rich history and heritage of the region as you explore ancient ruins, majestic palaces, and sacred sites.",
//   "Dhaka City Tour": "Experience the vibrant culture and bustling energy of Dhaka with our city tour. We'll take you to the most famous landmarks, markets, and restaurants.",
//   "Aquatic Destinations": "Dive into a world of adventure with our Aquatic Destinations package. Explore pristine beaches, crystal-clear waters, and vibrant marine life.",
//   "Highland Destinations": "Escape to the mountains with our Highland Destinations package. Enjoy breathtaking views, fresh mountain air, and a variety of outdoor activities.",
//   "Highlighted Tourrist Spot": "Discover the most popular and picturesque tourist spots with our Highlighted Tourist Spot package. Perfect for creating unforgettable memories.",
//   "Extra 1": "This is a placeholder description for Extra 1 category.",
//   "Extra 2": "This is a placeholder description for Extra 2 category.",
//   "Extra 3": "This is a placeholder description for Extra 3 category.",
// };

// const Packagesfilter = () => {
//   const { packages } = useAppContext();
//   const navigate = useNavigate();
//   const [activeCategory, setActiveCategory] = useState("");

//   const DEFAULT_COUNT = 3;
//   const [visibleCount, setVisibleCount] = useState(DEFAULT_COUNT);

//   // ✅ সব ইউনিক ক্যাটেগরি বের করা কিন্তু “All” বাদ দিয়ে
//   const allCategories = useMemo(() => {
//     if (!Array.isArray(packages)) return [];
//     const categories = new Set();
//     packages.forEach(pkg => {
//       if (pkg.packageCategories && pkg.packageCategories.length > 0) {
//         pkg.packageCategories.forEach(c => categories.add(c));
//       }
//     });
//     return Array.from(categories); // "All" বাদ
//   }, [packages]);

//   // ✅ প্রথম category টাকেই default active করো
//   useEffect(() => {
//     if (allCategories.length > 0 && !activeCategory) {
//       setActiveCategory(allCategories[0]);
//     }
//   }, [allCategories, activeCategory]);

//   // ✅ Filtered packages
//   const filteredPackages = useMemo(() => {
//     if (!activeCategory) return [];
//     return packages.filter(pkg =>
//       pkg.packageCategories && pkg.packageCategories.includes(activeCategory)
//     );
//   }, [packages, activeCategory]);

//   useEffect(() => {
//     setVisibleCount(DEFAULT_COUNT);
//   }, [activeCategory]);

//   const styles = {
//     nav: {
//       display: "flex",
//       flexWrap: "wrap",
//       justifyContent: "center",
//       gap: "0.8rem",
//       marginTop: "1.2rem",
//     },
//     tab: {
//       background: "transparent",
//       color: "#ccc",
//       border: "1px solid #444",
//       padding: "0.5rem 1.2rem",
//       borderRadius: "20px",
//       cursor: "pointer",
//       transition: "0.3s ease",
//       fontSize: "0.95rem",
//     },
//     activeTab: {
//       // background: "linear-gradient(135deg, #ff7e2f, #ffb067)",
//       background: 'linear-gradient(135deg, #2b8dca, #55bde9)',
//       color: "#fff",
//       border: "none",
//       boxShadow: "0 0 5px rgba(43, 141, 202, 0.4)",
//     },
//     description: {
//       fontSize: "1.1rem",
//       lineHeight: 1.7,
//       color: "#555",
//       textAlign: "center",
//       maxWidth: "800px",
//       margin: "2rem auto 0rem auto",
//     },
//   };

//   const total = filteredPackages.length;
//   const shown = Math.min(visibleCount, total);

//   const handleLoadMore = () => {
//     if (visibleCount >= filteredPackages.length) {
//       setVisibleCount(DEFAULT_COUNT);
//     } else {
//       setVisibleCount(prev => Math.min(prev + 3, filteredPackages.length));
//     }
//   };

//   return (
//     <div id='package' className="package__landing___BG">
//       <section className="section___container discover_container">
//         <h2 className="section__header">Handpicked Packages</h2>

//         {/* ✅ Category Filter Navigation (without All) */}
//         <div style={styles.nav}>
//           {allCategories.map(category => (
//             <button
//               key={category}
//               onClick={() => setActiveCategory(category)}
//               style={{
//                 ...styles.tab,
//                 ...(activeCategory === category ? styles.activeTab : {}),
//               }}
//             >
//               {category}
//             </button>
//           ))}
//         </div>

//         {/* Category Description */}
//         {activeCategory && categoryDescriptions[activeCategory] && (
//           <p style={styles.description}>
//             {categoryDescriptions[activeCategory]}
//           </p>
//         )}

//         {/* Filtered Packages */}
//         {filteredPackages && filteredPackages.length > 0 ? (
//           <>
//             <div
//               className="category-package-item"
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "3rem",
//                 margin: "1.3rem auto 1rem auto",
//                 maxWidth: '1200px'
//               }}
//             >
//               {filteredPackages.slice(0, visibleCount).map((item, index) => (
//                 <Packageslistinner key={index} packages={item} />
//               ))}
//             </div>

//             {filteredPackages.length > DEFAULT_COUNT && (
//               <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
//                 <span style={{ color: "#555", marginRight: "1.5rem", fontSize: '15px' }}>
//                   {shown} of {total}
//                 </span>
//                 <button
//                   className="view-all-btn"
//                   onClick={handleLoadMore}
//                 >
//                   {visibleCount >= filteredPackages.length ? 'Show less ↑' : 'Load more...'}
//                 </button>
//               </div>
//             )}
//           </>
//         ) : (
//           <p style={{ textAlign: "center", marginTop: "2rem", color: "#aaa" }}>
//             No packages found for this category.
//           </p>
//         )}

//         {/* View All Button */}
//         {activeCategory && (
//           <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
//             <button
//               className="view-all-btn"
//               onClick={() => navigate(`/packages/${encodeURIComponent(activeCategory)}`)}
//             >
//               View {activeCategory} Page <i className="fa-solid fa-chevron-right"></i>
//             </button>
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default Packagesfilter;


import React, { useState, useMemo, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import "../individualCSS/Discover/discover.css";
import Packageslistinner from "./Packageslistinner";
import { useNavigate, Link } from "react-router-dom";
import LandingFooter from "./LandingFooter";

const categoryDescriptions = {
  "Free Tour": "Explore the city's hidden gems without spending a dime. Our free tours are led by passionate local guides who will show you the best of what the city has to offer.",
  "All Prime Destinations":
    "Visit all the must-see attractions with our All Prime Destinations package. This comprehensive tour covers all the iconic landmarks and hidden treasures.",
  "Historic Places Tour":
    "Step back in time with our Historic Places Tour. Discover the rich history and heritage of the region as you explore ancient ruins, majestic palaces, and sacred sites.",
  "Dhaka City Tour":
    "Experience the vibrant culture and bustling energy of Dhaka with our city tour. We'll take you to the most famous landmarks, markets, and restaurants.",
  "Aquatic Destinations":
    "Dive into a world of adventure with our Aquatic Destinations package. Explore pristine beaches, crystal-clear waters, and vibrant marine life.",
  "Highland Destinations":
    "Escape to the mountains with our Highland Destinations package. Enjoy breathtaking views, fresh mountain air, and a variety of outdoor activities.",
  "Highlighted Tourrist Spot":
    "Discover the most popular and picturesque tourist spots with our Highlighted Tourist Spot package. Perfect for creating unforgettable memories.",
  "Extra 1": "This is a placeholder description for Extra 1 category.",
  "Extra 2": "This is a placeholder description for Extra 2 category.",
  "Extra 3": "This is a placeholder description for Extra 3 category.",
};

const Packagesfilter = () => {
  const { packages } = useAppContext();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const DEFAULT_COUNT = 3;
  const [visibleCount, setVisibleCount] = useState(DEFAULT_COUNT);

  const allCategories = useMemo(() => {
    if (!Array.isArray(packages)) return [];
    const categories = new Set();
    packages.forEach((pkg) => {
      if (pkg.packageCategories && pkg.packageCategories.length > 0) {
        pkg.packageCategories.forEach((c) => categories.add(c));
      }
    });
    return Array.from(categories);
  }, [packages]);

  useEffect(() => {
    if (allCategories.length > 0 && !activeCategory) {
      setActiveCategory(allCategories[0]);
    }
  }, [allCategories, activeCategory]);

  const filteredPackages = useMemo(() => {
    if (!activeCategory) return [];
    return packages.filter(
      (pkg) =>
        pkg.packageCategories && pkg.packageCategories.includes(activeCategory)
    );
  }, [packages, activeCategory]);

  useEffect(() => {
    setVisibleCount(DEFAULT_COUNT);
  }, [activeCategory]);

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}, []);


  const styles = {
    nav: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0.8rem",
      marginTop: "1.2rem",
    },
    tab: {
      background: "transparent",
      color: "#ccc",
      border: "1px solid #444",
      padding: "0.5rem 1.2rem",
      borderRadius: "20px",
      cursor: "pointer",
      transition: "0.3s ease",
      fontSize: "0.95rem",
    },
    activeTab: {
      background: "linear-gradient(135deg, #2b8dca, #55bde9)",
      color: "#fff",
      border: "none",
      boxShadow: "0 0 5px rgba(43, 141, 202, 0.4)",
    },
    description: {
      fontSize: "1.1rem",
      lineHeight: 1.7,
      color: "#555",
      textAlign: "center",
      maxWidth: "800px",
      margin: "2rem auto 0rem auto",
    },
  };

  const total = filteredPackages.length;
  const shown = Math.min(visibleCount, total);

  const handleLoadMore = () => {
    if (visibleCount >= filteredPackages.length) {
      setVisibleCount(DEFAULT_COUNT);
    } else {
      setVisibleCount((prev) =>
        Math.min(prev + 3, filteredPackages.length)
      );
    }
  };

  return (
    <>
      {/* ✅ Fixed Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
        <div style={{display:'flex',alignItems:'center'}}>
         {/* <img style={{width:'65px'}} src="\assets\Adobelogo.png" alt="logo" /> */}
         <div style={{display:'flex',alignItems:'center'}}>
         <img  style={{width:'100px',marginRight:'7px'}} src="/assets/Insignia-Logo-2nd.png" alt="logo" />
         <img style={{width:'100%',height:'40px',marginTop:'5px'}} src="/assets/textlogo3..png" alt="logo" />
         </div>
      </div>
        </Link>

        <div className="packages-nav-links">
          {/* <Link to="/">Home</Link> */}
          <Link to="/all-place-list">Destinations</Link>
          <Link to="/travel-guides">Highlight</Link>
          <div className="nav-more">
            <span>More ▾</span>

            
            <div className="dropdown-menu">
              <Link to="/blog">Blog</Link>
              <Link to="/OurTravelers">Our Travelers</Link>  
              <Link to="/reviews">Reviews</Link>  
              <Link to="/about">About Us</Link>          
            </div>
          </div>
          <Link to="/contact">Contact</Link>
        </div>

        {/* Hamburger */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        </div>
      </nav>

      {/* ✅ Sidebar for mobile */}
      <div className={`sidebar ${menuOpen ? "show" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/discover" onClick={() => setMenuOpen(false)}>Destinations</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
        <Link to="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
        <Link to="/testimonials" onClick={() => setMenuOpen(false)}>Testimonials</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
      </div>

      {/* ✅ CSS */}
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background-color: #fff;
          color: #2b8dca;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 30px;
          z-index: 99999999999999;
          box-shadow: 0 2px 10px rgba(0,0,0,0.4);
          height:65px
        }

        .logo {
          color: #55bde9;
          font-size: 1.4rem;
          font-weight: 700;
          text-decoration: none;
        }

        .packages-nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .packages-nav-links a {
          color: #2b8dca;
          text-decoration: none;
          font-weight: 500;
        }

        .nav-more {
          position: relative;
        }

        .nav-more span {
          cursor: pointer;
          color: #2b8dca;
          font-weight: 500;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: #111;
          border-radius: 6px;
          display: none;
          flex-direction: column;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          min-width: 150px;
          overflow: hidden;
        }

        .nav-more:hover .dropdown-menu {
          display: flex;
        }
        

        .dropdown-menu a {
          padding: 10px 16px;
          color: #2b8dca;
          text-decoration: none;
          font-weight: 500;
          border-bottom: 1px solid #222;
          transition: all 0.2s ease;
        }

        .dropdown-menu a:hover {
          background: linear-gradient(135deg, #2b8dca, #55bde9);
          color: #fff !important;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
        }
        .hamburger .bar {
          width: 25px;
          height: 3px;
          background: #2b8dca;
          transition: all 0.3s ease;
        }
        .hamburger .bar.open:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }
        .hamburger .bar.open:nth-child(2) {
          opacity: 0;
        }
        .hamburger .bar.open:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 69px;
          right: -250px;
          width: 250px;
          height: 340px;
          background-color: #fff;
          display: flex;
          flex-direction: column;
          padding: 40px 20px;
          transition: right 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); 
          z-index: 99999999999;

        }

        .sidebar.show {
          right: 0;
        }

        .sidebar a {
          color: #2b8dca;
          text-decoration: none;
          font-size: 1.1rem;
          margin-bottom: 1.2rem;
          transition: color 0.2s;
        }

        .sidebar a:hover {
          color: #55bde9;
        }
        
        .packages-inner-main-title {
          background:linear-gradient(135deg, rgb(44, 82, 130) 0%, rgb(74, 144, 189) 100%);
          font-size: 3rem;
          color:#fff;
          padding: 3rem 0 ;
          font-family:"inter"
        }

        /* Responsive */
        @media (max-width: 768px) {
          .packages-nav-links {
            display: none;
          }
          
          .packages-inner-main-title {
          font-size: 2rem;
          padding: 2rem 0 ;
        }
          .hamburger {
            display: flex;
          }
        }
      `}</style>

      {/* ✅ Page Content */}
      <div id="package" className="package__landing___BG" style={{ paddingTop: "80px" }}>
        <section style={{padding:'0 0 1rem 0',background:'#fff'}} >
          <h2 className="packages-inner-main-title">Handpicked Tour Packages</h2>

          <div style={{padding:'0 1.3rem 0 1.3rem'}}>
          <div style={styles.nav}>
            {allCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  ...styles.tab,
                  ...(activeCategory === category ? styles.activeTab : {}),
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {activeCategory && categoryDescriptions[activeCategory] && (
            <p style={styles.description}>
              {categoryDescriptions[activeCategory]}
            </p>
          )}

          {filteredPackages && filteredPackages.length > 0 ? (
            <>
              <div
                className="category-package-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3rem",
                  margin: "1.3rem auto 1rem auto",
                  maxWidth: "1200px",
                }}
              >
                {filteredPackages.slice(0, visibleCount).map((item, index) => (
                  <Packageslistinner key={index} packages={item} />
                ))}
              </div>

              {filteredPackages.length > DEFAULT_COUNT && (
                <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                  <span
                    style={{
                      color: "#555",
                      marginRight: "1.5rem",
                      fontSize: "15px",
                    }}
                  >
                    {shown} of {total}
                  </span>
                  <button className="view-all-btn" onClick={handleLoadMore}>
                    {visibleCount >= filteredPackages.length
                      ? "Show less ↑"
                      : "Load more..."}
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ textAlign: "center", marginTop: "2rem", color: "#aaa" }}>
              No packages found for this category.
            </p>
          )}

          {/* {activeCategory && (
            <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
              <button
                className="view-all-btn"
                onClick={() =>
                  navigate(`/packages/${encodeURIComponent(activeCategory)}`)
                }
              >
                View {activeCategory} Page{" "}
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          )} */}
          </div>
        </section>
      </div>
      <footer><LandingFooter/></footer>
    </>
  );
};

export default Packagesfilter;
