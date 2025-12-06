// import React, { useEffect, useRef } from 'react';

// const HorizontalImageSlider = () => {
//   const sliderRef = useRef(null);

//   // Auto scroll effect
//   useEffect(() => {
//     const slider = sliderRef.current;
//     let scrollAmount = 0;

//     const scroll = () => {
//       if (slider) {
//         scrollAmount += 1; // speed
//         if (scrollAmount >= slider.scrollWidth / 2) {
//           scrollAmount = 0; // loop
//         }
//         slider.scrollTo({ left: scrollAmount, behavior: 'smooth' });
//       }
//     };

//     const interval = setInterval(scroll, 20); // adjust speed here
//     return () => clearInterval(interval);
//   }, []);

//   const images = [
//     '/assets/bgg2.jpeg',
//     '/assets/bgg3.jpeg',
//     '/assets/bgg4.jpeg',
//     '/assets/bgg5.jpeg',
//     '/assets/bgg6.jpeg',
//     '/assets/bgg7.jpeg',
//     '/assets/bgg8.jpeg',
//     '/assets/bgg9.jpeg',
//     '/assets/bgg10.jpeg',
//     '/assets/bgg11.jpeg',
//   ];

//   return (
//     <div
//       style={{
//         position: 'relative',
//         height: '200px',
//         overflow: 'hidden',
//         width: '100%',
//         backgroundColor: '#000',
//       }}
//     >
//       {/* Overlay with title */}
//       <div
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           backgroundColor: 'rgba(0, 0, 255, 0.3)', // semi-transparent blue
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 2,
//         }}
//       >
//         <h1 style={{ color: 'white', fontSize: '24px', textAlign: 'center' }}>
//           Popular Travel Stories & Trip Reports
//         </h1>
//       </div>

//       {/* Image slider */}
//       <div
//         ref={sliderRef}
//         style={{
//           display: 'flex',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           height: '200px',
//           width: 'max-content',
//           zIndex: 1,
//         }}
//       >
//         {images.concat(images).map((src, index) => (
//           <img
//             key={index}
//             src={src}
//             alt={`travel-${index}`}
//             style={{
//               height: '200px',
//               width: '300px',
//               objectFit: 'cover',
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HorizontalImageSlider;


import React from 'react';

const HorizontalImageSlider = () => {
  const images = [
    '/assets/blogslideimg1.jpg',
    '/assets/blogslideimg2.jpg',
    '/assets/blogslideimg3.jpg',
    '/assets/blogslideimg4.jpg',
    '/assets/blogslideimg5.jpg',
    '/assets/blogslideimg6.jpg',
    '/assets/blogslideimg7.jpg',
    '/assets/blogslideimg8.jpg',
    '/assets/blogslideimg9.jpg',
    '/assets/blogslideimg10.jpg',
    '/assets/blogslideimg11.jpg',
    '/assets/blogslideimg12.jpg',
    '/assets/blogslideimg13.jpg',
    '/assets/blogslideimg14.jpg',
    
  ];

  // Duplicate images for infinite loop
  const allImages = images.concat(images);

  return (
    <div
      style={{
        position: 'relative',
        height: '180px',
        overflow: 'hidden',
        width: '100%',
        backgroundColor: '#000',
      }}
    >
      {/* Overlay with title */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
         
        //   backgroundColor: 'rgba(74, 144, 189, 0.4)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        //  background:"linear-gradient(135deg, rgba(44, 82, 130, 0.3), rgba(74, 144, 189, 0.5))",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        {/* <h1 style={{ color: 'white', fontSize: '3rem', textAlign: 'center' ,fontWeight:'500',fontFamily:'inter'}}>
          Popular Travel Stories & Trip Reports
        </h1> */}
      </div>

      {/* Image slider */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '180px',
          width: 'max-content',
          animation: 'scrollLeft 40s linear infinite',
        }}
      >
        {allImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`travel-${index}`}
            style={{
              height: '180px',
              width: '400px',
              objectFit: 'cover',
            }}
          />
        ))}
      </div>

      {/* Inline keyframes */}
      <style>
        {`
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </div>
  );
};

export default HorizontalImageSlider;
