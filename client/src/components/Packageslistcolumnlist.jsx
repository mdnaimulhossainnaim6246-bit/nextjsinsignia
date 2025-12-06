// import React, { useMemo, useState, useEffect } from 'react';
// import { useAppContext } from "../context/AppContext";
// import "../individualCSS/Discover/discover.css";
// import Packageslist from './Packageslist';
// import '../individualCSS/components/Packages.css';
// import { Link } from "react-router-dom";

// const Packageslistcolumnlist = () => {
//   const { packages } = useAppContext();

//   const [maxVisible, setMaxVisible] = useState(6); 

//  useEffect(() => {
//   const handleResize = () => {
//     const width = window.innerWidth;

//     if (width > 1550) {
//       setMaxVisible(6);
//     } else if (width > 1400) {
//       setMaxVisible(5);
//     } else if (width > 1120) {
//       setMaxVisible(4);
//     } else if (width > 850) {
//       setMaxVisible(6); 
//     } else if (width > 570) {
//       setMaxVisible(4); 
//     } else {
//       setMaxVisible(3); 
//     }
//   };

 
//   handleResize();


//   window.addEventListener('resize', handleResize);


//   return () => window.removeEventListener('resize', handleResize);
// }, []);


//   const categorizedPackages = useMemo(() => {
//     if (!Array.isArray(packages)) return {};
//     return packages.reduce((acc, pkg) => {
//       if (pkg.packageCategories && pkg.packageCategories.length > 0) {
//         pkg.packageCategories.forEach(category => {
//           if (!acc[category]) acc[category] = [];
//           acc[category].push(pkg);
//         });
//       }
//       return acc;
//     }, {});
//   }, [packages]);

//   return (
//     <div id='package' className="package__landing___BG">
//       <section className="section___container discover_container">
//         <h2 className="section__header">Hand Picked Tour Packages</h2>
//         <p className="section__subheader">Explore our curated selection of travel experiences crafted for unforgettable memories.</p>

//         {Object.entries(categorizedPackages).map(([category, pkgs]) => {
//           if (category !== 'All Prime Destinations' || pkgs.length === 0) return null;

//           return (
//             <div key={category} className="category-section">
//               <div className='packages___grid'>
//                 {pkgs.slice(0, maxVisible).map((pkgItem) => (
//                   <Packageslist key={pkgItem._id} packages={pkgItem} />
//                 ))}
//               </div>

//               <p style={{textAlign:'center',marginTop:'3rem'}}>
//                 <Link
//                   to="/tour-packages-list"
//                   style={{
//                     padding: "12px 30px",
//                     fontSize: "1rem",
//                     fontWeight: "600",
//                     color: "#fff",
//                     background: "linear-gradient(135deg, #2b8dca, #55bde9)",
//                     border: "none",
//                     borderRadius: "50px",
//                     cursor: "pointer",
//                     textDecoration: "none",
//                     transition: "transform 0.2s ease, box-shadow 0.2s ease",
//                     opacity:'1'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.currentTarget.style.transform = "scale(1.05)";
//                     e.currentTarget.style.opacity = "0.9";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.currentTarget.style.transform = "scale(1)";
//                     e.currentTarget.style.opacity = "1";
//                   }}
//                 >
//                   See More
//                 </Link>
//               </p>
//             </div>
//           );
//         })}
//       </section>
//     </div>
//   );
// };

// export default Packageslistcolumnlist;


import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from "../context/AppContext";
import "../individualCSS/Discover/discover.css";
import Packageslist from './Packageslist';
import '../individualCSS/components/Packages.css';
// import { Link } from "react-router-dom";

const Packageslistcolumnlist = () => {
  const { packages } = useAppContext();

  const DEFAULT_COUNT = 12; 
  const [visibleCount, setVisibleCount] = useState(DEFAULT_COUNT);

  // Default scroll to top
  // useEffect(() => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // }, []);

  // Categorizing
  const categorizedPackages = useMemo(() => {
    if (!Array.isArray(packages)) return {};
    return packages.reduce((acc, pkg) => {
      if (pkg.packageCategories && pkg.packageCategories.length > 0) {
        pkg.packageCategories.forEach(category => {
          if (!acc[category]) acc[category] = [];
          acc[category].push(pkg);
        });
      }
      return acc;
    }, {});
  }, [packages]);

  return (
    <div id='package' className="package__landing___BG">
      <section style={{padding:'2rem 0'}}>
        <div style={{display:"flex",justifyContent:'center'}}>
        <h2 className="package-listcolumn-section__header">Most Popular  Tour Packages</h2>
        </div>
        {/* <p className="section__subheader">
          Explore our curated selection of travel experiences crafted for unforgettable memories.
        </p> */}

        {Object.entries(categorizedPackages).map(([category, pkgs]) => {
          if (category !== 'All Prime Destinations' || pkgs.length === 0) return null;

          const total = pkgs.length;
          const shown = Math.min(visibleCount, total);

          // Load More / Show Less Logic
          const handleLoadMore = () => {
            if (visibleCount >= total) {
              setVisibleCount(DEFAULT_COUNT);
            } else {
              setVisibleCount(prev => Math.min(prev + 12, total));
            }
          };

          return (
            <div key={category} className="category-section">

              {/* PACKAGES GRID */}
              <div className='packages___grid__list__column'>
                {pkgs.slice(0, shown).map((pkgItem) => (
                  <Packageslist key={pkgItem._id} packages={pkgItem} />
                ))}
              </div>

              {/* LOAD MORE / SHOW LESS */}
              {total > DEFAULT_COUNT && (
                <div style={{ textAlign: "center", margin: "2.5rem 0 1.5rem 0 ",display:'flex',alignItems:'center',justifyContent:"space-around",gap:'2rem' }}>
                  <span style={{ display: "block", fontWeight: "500",color:"#55bde9" }}>
                    {shown} of {total}
                  </span>

                  <button
                    onClick={handleLoadMore}
                    className='package-loade-more-button'
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {visibleCount >= total ? "Show less ↑" : "Load more..."}
                  </button>
                  <span></span>
                </div>
              )}
                             {/* <p style={{textAlign:'center',marginTop:'3rem',marginBottom:'2rem'}}>
                <Link
                  to="/tour-packages-list"
                  style={{
                    padding: "12px 30px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#fff",
                    background: "linear-gradient(135deg, #2b8dca, #55bde9)",
                    border: "none",
                    borderRadius: "0px",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    opacity:'1'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  Explore Our All Packages
                </Link>
              </p> */}
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Packageslistcolumnlist;
