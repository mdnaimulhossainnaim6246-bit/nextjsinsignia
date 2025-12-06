

import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useLocation } from 'react-router-dom';



const Navbar = () => {
  const { token } = useAppContext();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

    const sections = [
    // { id: "home", label: "Home" },
    { id: "discover", label: "Destination" },
    // { id: "tour", label: "Tour" },
    { id: "package", label: "Tour" },
    // { id: "Packages-filter", label: "Packages-filter" },
    // { id: "history", label: "History" },
    { id: "blog", label: "Blog" },
    { id: "highlights", label: "Highlights" },
    { id: "ourtravelers", label: "Our Travelers" },
    { id: "grouptour", label: "Group Tour" },
    { id: "reviews", label: "Reviews" }, 
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    // { id: "cart", label: "Cart" },
  ];

  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const isRouteActive = (route) => location.pathname === route;


  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);




  useEffect(() => {
  const handleScroll = () => {
    if (window.scrollY > 50) { 
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  // Restore scroll position on mount
  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection");
    const savedScroll = localStorage.getItem("scrollPosition");

    if (savedSection) {
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(savedSection);
        if (el) {
          if (savedScroll) {
            window.scrollTo({ top: parseInt(savedScroll, 10), behavior: "auto" });
          } else {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: "auto" });
          }
        } else if (attempts < 15) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };
      setTimeout(tryScroll, 300);
    }
  }, []);

  // Set active section
  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection");
    if (savedSection) {
      setActiveSection(savedSection);
    }
  }, []);

  // Navbar slide down animation on mount (restore your animation)
  useEffect(() => {
    const navbar = document.querySelector(".uper-main-nav");
    if (!navbar) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    navbar.style.transition = "none";
    navbar.style.top = "-100px";

    requestAnimationFrame(() => {
      if (scrollTop === 0) {
        navbar.style.transition = "top 0.5s ease-in-out";
        navbar.style.top = "0";
      } else {
        navbar.style.transition = "none";
        navbar.style.top = "0";
      }
    });
  }, []);

  // Scroll detection for active section and menu
  useEffect(() => {
    const navbar = document.querySelector(".uper-main-nav");
    if (!navbar) return;

    let lastScrollTop = 0;
    let ignoreScroll = true;

    const handleScroll = () => {
      if (ignoreScroll) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      // Navbar show/hide on scroll
      if (scrollTop <= 0) {
        navbar.style.top = "0";
      } else if (scrollTop > lastScrollTop && scrollTop > 10) {
        navbar.style.top = "-100px";
      } else if (scrollTop < lastScrollTop && scrollTop > 100) {
        navbar.style.top = "0";
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

      // Section highlight
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveSection(section.id);
            localStorage.setItem("activeSection", section.id);
          }
        }
      });

      // Save scroll position debounce
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        localStorage.setItem("scrollPosition", window.pageYOffset);
      }, 150);

      if (isMenuOpen) setIsMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    const timer = setTimeout(() => { ignoreScroll = false }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      clearTimeout(timer);
    };
  }, [isMenuOpen]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
      localStorage.setItem("scrollPosition", y);
    }
    setActiveSection(id);
    localStorage.setItem("activeSection", id);
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className={`uper-main-nav ${isScrolled ? "scrolled" : ""}`}>
      
      <div style={{display:'flex',alignItems:'center'}}>
         {/* <img style={{width:'65px'}} src="\assets\Adobelogo.png" alt="logo" /> */}
         <a style={{display:'flex',alignItems:'center'}} href="#home">
         <img  style={{width:'100px',marginRight:'7px'}} src="/assets/Insignia-Logo-2nd.png" alt="logo" />
         <img style={{width:'100%',height:'40px',marginTop:'5px'}} src="/assets/textlogo3..png" alt="logo" />
         </a>
      </div>

      <div
        className={`menu-button ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") toggleMenu();
        }}
      >
        <span className="menu-bars">
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
        </span>
        <span className="menu-label">Menu</span>
      </div>

      <ul 
      // className={`nav-links ${isMenuOpen ? "mobile-active" : ""}`}
      className={`nav-links ${isMenuOpen ? "mobile-active" : ""} ${isScrolled ? "scrolled" : ""}`}

      >
        {/* {sections.map((section) => {
          if (section.id === "package") {
            return (
              <React.Fragment key={section.id}>
                <li className={`link ${isScrolled ? "scrolled" : ""}`}>
                  <a
                    href={`#${section.id}`}
                    className={`alink ${isScrolled ? "scrolled" : ""} ${activeSection === section.id ? "active" : ""}`}

                    onClick={(e) => handleClick(e, section.id)}
                  >
                    {section.label}
                  </a>
                </li>

                <li className="link dropdown" ref={dropdownRef}>
                  <span
                    // className={`dropdown-toggle ${isDropdownOpen ? "active" : ""}`}
                    className={`dropdown-toggle ${isDropdownOpen ? "active" : ""} ${isScrolled ? "scrolled" : ""}`}

                    onClick={toggleDropdown}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") toggleDropdown();
                    }}
                  >
                    Booking ▾
                  </span>
                  {isDropdownOpen && (
                    <ul className="dropdown-menu">
                      <li
                       className='nav-section-border'
                       
                        >
                        <Link
                          to="/cart"
                          className={ location.pathname === "/cart" ? "active" : ""}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Cart
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/track-order"
                          className={location.pathname === "/track-order" ? "active" : ""}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Track Order
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </React.Fragment>
            );
          }

          if (section.id === "contact") {
            return (
              <li className="link" key={section.id}>
                <Link
                  to="/contact"
                  className={`alink ${isScrolled ? "scrolled" : ""} ${isRouteActive("/contact") ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {section.label}
                </Link>
              </li>
            );
          }

          if (section.id !== "package" && section.id !== "contact") {
            return (
              <li className="link" key={section.id}>
                <a
                  href={`#${section.id}`}
                  // className={activeSection === section.id ? "active" : ""}
                  className={`alink ${isScrolled ? "scrolled" : ""} ${activeSection === section.id ? "active" : ""}`}
                  onClick={(e) => handleClick(e, section.id)}
                >
                  {section.label}
                </a>
              </li>
            );
          }

          return null;
        })} */}

        {sections.map((section) => {
  // // ✅ Cart page (opens separately)
  // if (section.id === "cart") {
  //   return (
  //     <li className="link" key="cart">
  //       <Link
  //         to="/cart"
  //         className={`alink ${isScrolled ? "scrolled" : ""} ${
  //           isRouteActive("/cart") ? "active" : ""
  //         }`}
  //         onClick={() => setIsMenuOpen(false)}
  //       >
  //         My Cart
  //       </Link>
  //     </li>
  //   );
  // }

  // ✅ About page (opens separately)
  if (section.id === "about") {
    return (
      <li className="link" key="about">
        <Link
          to="/about"
          className={`alink ${isScrolled ? "scrolled" : ""} ${
            isRouteActive("/about") ? "active" : ""
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          {section.label}
        </Link>
      </li>
    );
  }
  // // ✅ About page (opens separately)
  // if (section.id === "Packages-filter") {
  //   return (
  //     <li className="link" key="Packages-filter">
  //       <Link
  //         to="/Packages-filter"
  //         className={`alink ${isScrolled ? "scrolled" : ""} ${
  //           isRouteActive("/Packages-filter") ? "active" : ""
  //         }`}
  //         onClick={() => setIsMenuOpen(false)}
  //       >
  //         {section.label}
  //       </Link>
  //     </li>
  //   );
  // }

  // ✅ Group Tour page (opens separately)
  if (section.id === "grouptour") {
    return (
      <li className="link" key="grouptour">
        <Link
          to="/grouptour"
          className={`alink ${isScrolled ? "scrolled" : ""} ${
            isRouteActive("/grouptour") ? "active" : ""
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          {section.label}
        </Link>
      </li>
    );
  }

  // ✅ Reviews page (opens separately)
  if (section.id === "reviews") {
    return (
      <li className="link" key="reviews">
        <Link
          to="/reviews"
          className={`alink ${isScrolled ? "scrolled" : ""} ${
            isRouteActive("/reviews") ? "active" : ""
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          {section.label}
        </Link>
      </li>
    );
  }

  if (section.id === "contact") {
    return (
      <li className="link" key="our-travelers">
        <Link
          to="/contact"
          className={`alink ${isScrolled ? "scrolled" : ""} ${
            isRouteActive("/contact") ? "active" : ""
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          {section.label}
        </Link>
      </li>
    );
  }

  // ✅ All other nav sections → same-page smooth scroll
  return (
    <li className="link" key={section.id}>
      <a
        href={`#${section.id}`}
        className={`alink ${isScrolled ? "scrolled" : ""} ${
          activeSection === section.id ? "active" : ""
        }`}
        onClick={(e) => handleClick(e, section.id)}
      >
        {section.label}
      </a>
    </li>
  );
})}

      </ul>
    </nav>
  );
};

export default Navbar;
