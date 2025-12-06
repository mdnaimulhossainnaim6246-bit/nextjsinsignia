// // src/pages/admin/nav.jsx 

// import React from 'react';
// import Navbar from '../components/Navbar';
// import Tour from  '../components/Tour';
// import Contactmain from  '../components/Contactmain';
// import LandingFooter from  '../components/LandingFooter';

// // import Discover from '../components/Discover';
// import VideoTextWithStroke from './VideoTextMask';
// import Packages from '../components/Packages';
// import Blog from '../components/Blog';
// import About from '../components/About';
// import Home from '../pages/Home';
// import Discoverlanding from '../components/Discoverlanding';




// const Nav = () => {
//   return (
//     <>
//       <Navbar/>
//        <Home/>
//        <Discoverlanding/>
//        {/* <Discover/> */}
//       <Tour/>
//       <Packages/>
//       <Blog/>
//       <About/>
//       <Contactmain/>
//       <LandingFooter/>
//       <VideoTextWithStroke/>

//       <div style={{position:'fixed', top:'60vh',right:'20px',background:'#0a2c12',alignItems:'center',padding:'3px 12px 3px 10px',borderRadius:'5px'}} className="Live-Chat">
//     <a 
//       href="https://wa.me/8801977784132" 
//       target="_blank" 
//       rel="noopener noreferrer" 
//       className="whatsapp-link"
//     >

//       <div style={{display:'flex'}}>
//       <span style={{color:'#25D366',fontSize:'23px'}}>
//         <i className="fa-brands fa-whatsapp"></i>
//       </span>
//       <h4 style={{padding:'0 0 0 4px',margin:'0',color:'#fff',fontSize:'14px',display:'flex',alignItems:'center'}}>Live Chat</h4>
//       </div>
//     </a>
//   </div>
//     </>
//   );
// };

// export default Nav;



// src/pages/admin/nav.jsx 

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Themepreview from '../components/Themepreview'
// import Theme_demo from '../components/Theme-demo'
// import Tour from  '../components/Tour';
// import Contactmain from  '../components/Contactmain';
import Contactus from  '../components/Contactus';
import LandingFooter from  '../components/LandingFooter';
// import Discover from '../components/Discover';
// import VideoTextWithStroke from './VideoTextMask';
import OurTravelersLanding from './OurTravelersLanding';
import Packages from '../components/Packages';
// import Bangladeshhistory from '../components/bangladeshhistory';
import Blog from '../components/Blog';
// import DestinationsPage from './DestinationsPage';
// import Packagesfilter from "../components/Packagesfilter";

// import Aboutus from '../components/Aboutus';
// import About from '../components/About';
// import Home from '../pages/Home';
import Discoverlanding from '../components/Discoverlanding';
import PopupViewer from '../components/PopupViewer';
import Guide from '../components/Guide';



// import AllPackages from './AllPackages'

const Nav = () => {
  const [showText, setShowText] = useState(true);
  const [hover, setHover] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);



//   useEffect(() => {
//   const handleScroll = () => {
//     const scrollY = window.scrollY;
//     const innerHeight = window.innerHeight;
//     const docHeight = document.body.scrollHeight;

//     // Top hide if at top
//     setShowTop(scrollY > 0);

//     // Bottom hide if at bottom
//     setShowBottom(scrollY + innerHeight < docHeight);
//   };

//   window.addEventListener('scroll', handleScroll);
//   handleScroll(); // initial check
//   return () => window.removeEventListener('scroll', handleScroll);
// }, []);

useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const docHeight = document.body.scrollHeight;

    // WhatsApp text show/hide based on scroll direction
    if (scrollY > lastScrollY) setShowText(false);
    else setShowText(true);
    lastScrollY = scrollY;

    // Top button → hide if at very top
    setShowTop(scrollY > 0);

    // Bottom button → hide if at very bottom
    // threshold 5px for safety
    setShowBottom(scrollY + innerHeight < docHeight - 5);
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // initial check
  return () => window.removeEventListener('scroll', handleScroll);
}, []);



  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scroll down → hide text
        setShowText(false);
      } else {
        // Scroll up → show text
        setShowText(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar/>
      <PopupViewer />
      <Themepreview/>
      {/* <Theme_demo/> */}
      {/* <Home/> */}
      <Discoverlanding/>
      {/* <Discover/> */}
      {/* <Tour/> */}
      <Packages/>
      {/* <Bangladeshhistory/> */}
      <Blog/>
      <Guide/>
      {/* <OurTravelers/> */}
      <OurTravelersLanding/>
      {/* <DestinationsPage/> */}
      
      {/* <Packagesfilter/> */}
      {/* <AllPackages/> */}
      {/* <About/> */}
      {/* <Aboutus/> */}
      {/* <Contactmain/> */}
      <Contactus/>
      <LandingFooter/>
      {/* <VideoTextWithStroke/> */}
     

 {showTop && (     
<div
  style={{
    position: 'fixed',
    bottom: '14vh',
    left: '20px',
    // background: '#0a2c12',
    background: hover ? '#178c42' : '#1ebe57',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: showText ? '3px 12px 3px 10px' : '3px 7px 3px 10px', 
    borderRadius: showText ? '20px 5px 20px 5px' : '50%', 
    transition: 'all 0.3s ease', 
    zIndex:'9999999'
  }}
  className="Live-Chat"
  onMouseEnter={() => setHover(true)}
  onMouseLeave={() => setHover(false)}
>
  <a
    href="https://wa.me/8801977784132"
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'flex', alignItems: 'center' }}
  >
    <span style={{ color: '#fff', fontSize: showText ? '23px': '24px' }}>
      <i className="fa-brands fa-whatsapp"></i>
    </span>
    <h4
      style={{
        padding: '0 0 0 4px',
        margin: 0,
        color: '#fff',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.3s ease, max-width 0.3s ease',
        opacity: showText ? 1 : 0,
        maxWidth: showText ? '100px' : '0px',
      }}
    >
      WhatsApp
    </h4>
  </a>
</div>
)}


{/* {showTop && (
  <div
    style={{
      position: 'fixed',
      bottom: '14vh',
      left: '20px',
      background: hover ? '#178c42' : '#1ebe57',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '3px 12px 3px 10px',
      borderRadius: '20px 5px 20px 5px',
      transition: 'all 0.3s ease',
      zIndex: 9999999
    }}
    onMouseEnter={() => setHover(true)}
    onMouseLeave={() => setHover(false)}
  >
    <a
      href="https://wa.me/8801977784132"
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <span style={{ color: '#fff', fontSize: '23px' }}>
        <i className="fa-brands fa-whatsapp"></i>
      </span>
      <h4
        style={{
          padding: '0 0 0 4px',
          margin: 0,
          color: '#fff',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          transition: 'opacity 0.3s ease, max-width 0.3s ease',
          opacity: 1,
          maxWidth: '100px',
        }}
      >
        WhatsApp
      </h4>
    </a>
  </div>
)} */}


{/* Top Button */}
{/* {showTop && (
  <div
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    style={{
      position: 'fixed',
      bottom: '65px',
      right: '20px',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: '#51b3f0',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: 999999,
      transition: 'all 0.3s ease',
      fontSize:'13px'
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#4a90bd'}
    onMouseLeave={e => e.currentTarget.style.background = '#51b3f0'}
  >
    <i className="fa-solid fa-arrow-up"></i>
  </div>
)} */}

{showTop && (
  <div
    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    style={{
      position: 'fixed',
      bottom: '65px',
      right: '20px',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: '#51b3f0',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: 999999,
      transition: 'all 0.3s ease',
      fontSize:'13px'
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#4a90bd'}
    onMouseLeave={e => e.currentTarget.style.background = '#51b3f0'}
  >
    <i className="fa-solid fa-arrow-up"></i>
  </div>
)}


{/* Bottom Button */}
{/* {showBottom && (
  <div
    onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
    style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: '#51b3f0',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: 999999,
      transition: 'all 0.3s ease',
      fontSize:'13px'
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#4a90bd'}
    onMouseLeave={e => e.currentTarget.style.background = '#51b3f0'}
  >
    <i className="fa-solid fa-arrow-down"></i>
  </div>
)} */}

{showBottom && (
  <div
    onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
    style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: '#51b3f0',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      zIndex: 999999,
      transition: 'all 0.3s ease',
      fontSize:'13px'
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#4a90bd'}
    onMouseLeave={e => e.currentTarget.style.background = '#51b3f0'}
  >
    <i className="fa-solid fa-arrow-down"></i>
  </div>
)}



    </>
  );
};

export default Nav;