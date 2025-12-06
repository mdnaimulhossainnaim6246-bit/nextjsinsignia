import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from "../context/AppContext";
import "../individualCSS/Discover/discover.css";
import Packageslist from './Packageslist';
import '../individualCSS/components/Packages.css';
import { Link } from "react-router-dom";

const Packages = () => {
  const { packages } = useAppContext();

  const [maxVisible, setMaxVisible] = useState(6); // default max 6

 useEffect(() => {
  const handleResize = () => {
    const width = window.innerWidth;

    if (width > 1550) {
      setMaxVisible(6);
    } else if (width > 1400) {
      setMaxVisible(5);
    } else if (width > 1120) {
      setMaxVisible(4);
    } else if (width > 850) {
      setMaxVisible(6); 
    } else if (width > 570) {
      setMaxVisible(4); 
    } else {
      setMaxVisible(3); 
    }
  };

 
  handleResize();


  window.addEventListener('resize', handleResize);


  return () => window.removeEventListener('resize', handleResize);
}, []);


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
      <section className=" package__section___container discover_container">
        <h2 className="section__header">Hand Picked Tour Packages</h2>
        <p className="section__subheader">Explore our curated selection of travel experiences crafted for unforgettable memories.</p>

        {Object.entries(categorizedPackages).map(([category, pkgs]) => {
          if (category !== 'All Prime Destinations' || pkgs.length === 0) return null;

          return (
            <div key={category} className="category-section">
              <div className='packages___grid'>
                {pkgs.slice(0, maxVisible).map((pkgItem) => (
                  <Packageslist key={pkgItem._id} packages={pkgItem} />
                ))}
              </div>

              <p style={{textAlign:'center',marginTop:'3rem'}}>
                <Link
                  to="/tour-packages-list"
                  style={{
                    padding: "12px 30px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#fff",
                    background: "linear-gradient(135deg, #2b8dca, #55bde9)",
                    border: "none",
                    borderRadius: "50px",
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
                  See More
                </Link>
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Packages;
