// import { HashLink } from 'react-router-hash-link';
// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";


// const Mobailenav = () => {
//   const location = useLocation();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const menuRef = useRef(null);
//   const toggleBtnRef = useRef(null);

//   // const sections = [
//   //   { id: "home", label: "Home" },
//   //   { id: "discover", label: "Discover" },
//   //   { id: "tour", label: "Tour" },
//   //   { id: "package", label: "Package" },
//   //   { id: "blog", label: "Blog" },
//   //   { id: "wanderlog", label: "Wanderlog" },
//   //   { id: "about", label: "About" },
//   //   { id: "contact", label: "Contact" },
//   // ];

//  const sections = [
//   { hash: "#home", label: "Home" },
//   { hash: "#discover", label: "Destination" },
//   { hash: "#tour", label: "Tour" },

//   { hash: "#blog", label: "Blog" },
 
//   { hash: "#about", label: "About" },
//   { hash: "#contact", label: "Contact" },
// ];



//   const handleToggleClick = (e) => {
//     e.stopPropagation();
//     setIsMobileMenuOpen((prev) => !prev);
//   };

//   const handleMenuClick = (e) => {
//     e.stopPropagation(); 
//   };

//   useEffect(() => {
//     const handleDocumentClick = (e) => {
     
//       if (
//         isMobileMenuOpen &&
//         menuRef.current &&
//         toggleBtnRef.current &&
//         !menuRef.current.contains(e.target) &&
//         !toggleBtnRef.current.contains(e.target)
//       ) {
//         setIsMobileMenuOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleDocumentClick);

//     return () => {
//       document.removeEventListener("mousedown", handleDocumentClick);
//     };
//   }, [isMobileMenuOpen]);

//   const closeMobileMenu = () => setIsMobileMenuOpen(false);




//   return (

     
    
//     <header className="navbar-container">
//       <div className="navbar-inner">
//         <div className="navbar-logo">
//           <img
//             className="place-ditails-logo"
//             src="\assets\Insignia-Logo-2nd.png"
//             alt="logo"
//             onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
//             style={{ cursor: "pointer" }}
//           />
//         </div>

//         {/* <h1 className="common-caption-nav" >Smart guidance, memorable tours — your travel, our care</h1> */}

//         <nav
//           ref={menuRef}
//           className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}
//           onClick={handleMenuClick}
//         >
//           {/* <ul>
//             {sections.map(({ id, label }) => (
//               <li key={id}>
//                 <a
//                   href={`#${id}`}
//                   className={location.hash === `#${id}` ? "active" : ""}
//                   onClick={closeMobileMenu}
//                 >
//                   {label}
//                 </a>
//               </li>
//             ))}
//           </ul> */}

//           <ul>
//   {sections.map(({ hash, label }) => (
//     <li key={hash}>
//       <HashLink
//         smooth
//         to={hash}
//         onClick={closeMobileMenu}
//         className={location.hash === hash ? "active" : ""}
//       >
//         {label}
//       </HashLink>
//     </li>
//   ))}
// </ul>


//         </nav>

//         <button
//           ref={toggleBtnRef}
//           className={`navbar-toggle-btn ${isMobileMenuOpen ? "open" : ""}`}
//           onClick={handleToggleClick}
//           aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
//           aria-expanded={isMobileMenuOpen}
//         >
//           <span className="bar"></span>
//           <span className="bar"></span>
//           <span className="bar"></span>
//         </button>
//       </div>
//     </header>
  
//   );
// };


// export default Mobailenav;

import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const Mobailenav = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 975);

  const menuRef = useRef(null);
  const toggleBtnRef = useRef(null);

  // Handle mobile / desktop mode on resize
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth <= 975);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // ✅ All links — desktop + mobile (same)
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/discover", label: "Destination" },
    { to: "/Packages-filter", label: "Tour" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const handleToggleClick = (e) => {
    e.stopPropagation();
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMenuClick = (e) => e.stopPropagation();

  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        toggleBtnRef.current &&
        !menuRef.current.contains(e.target) &&
        !toggleBtnRef.current.contains(e.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* ✅ CSS inside same component */}
      <style>{`
        .desktop-menu ul {
          display: flex;
          gap: 25px;
          list-style: none;
          align-items: center;
          margin: 0;
          padding: 0;
        }

        .desktop-menu ul li a {
          font-weight: 500;
          text-decoration: none;
          color: #1d3557;
          transition: 0.2s;
        }

        .desktop-menu ul li a:hover {
          color: #457b9d;
        }

        .desktop-menu ul li a.active {
          color: #2c5282;
          border-bottom: 2px solid #2c5282;
          padding-bottom: 4px;
        }

        @media (max-width: 975px) {
          .desktop-menu {
            display: none;
          }
        }
      `}</style>

      <header className="navbar-container">
        <div className="navbar-inner">

          {/* ✅ LOGO */}
          {/* <div className="navbar-logo">
            <img
              className="place-ditails-logo"
              src="/assets/Insignia-Logo-2nd.png"
              alt="logo"
              onClick={() => window.open("/", "_self")}
              style={{ cursor: "pointer" }}
            />
          </div> */}
          <Link to="/" className="logo">
                  <div style={{display:'flex',alignItems:'center'}}>
                   {/* <img style={{width:'65px'}} src="\assets\Adobelogo.png" alt="logo" /> */}
                   <div style={{display:'flex',alignItems:'center'}}>
                   <img  style={{width:'100px',marginRight:'7px'}} src="/assets/Insignia-Logo-2nd.png" alt="logo" />
                   <img style={{width:'100%',height:'40px',marginTop:'5px'}} src="/assets/textlogo3..png" alt="logo" />
                   </div>
                </div>
                  </Link>

          {/* ✅ DESKTOP MENU */}
          {!isMobile && (
            <nav className="desktop-menu">
              <ul>
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={location.pathname === to ? "active" : ""}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* ✅ MOBILE MENU */}
          {isMobile && (
            <>
              <nav
                ref={menuRef}
                className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}
                onClick={handleMenuClick}
              >
                <ul>
                  {navLinks.map(({ to, label }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        onClick={closeMobileMenu}
                        className={location.pathname === to ? "active" : ""}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <button
                ref={toggleBtnRef}
                className={`navbar-toggle-btn ${
                  isMobileMenuOpen ? "open" : ""
                }`}
                onClick={handleToggleClick}
              >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
              </button>
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Mobailenav;
