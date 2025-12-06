



// import React, { useState, useMemo } from 'react';
// import Gallery from 'react-photo-gallery';
// import FullScreenGallery from './FullScreenGallery';
// import './ImageGalleryGrid.css';

// const ImageGalleryGrid = ({
//   images = [],             
//   onImageClickWithIndex,
//   maxVisible = 8
// }) => {
//   const [isFullScreen, setIsFullScreen] = useState(false);
//   const [startIndex, setStartIndex] = useState(0);
//   const [startInGrid, setStartInGrid] = useState(false);

//   // Only show maxVisible images in grid
//   const visibleImages = useMemo(() => images.slice(0, maxVisible), [images, maxVisible]);

//   const remainingCount = images.length - maxVisible;

//   const handleImageClick = (event, { photo, index }) => {
//     setStartInGrid(false); // Lightbox mode
//     if (onImageClickWithIndex) {
//       onImageClickWithIndex(index);
//     } else {
//       setStartIndex(index);
//       setIsFullScreen(true);
//     }
//   };

//   const handleLastImageClick = (e) => {
//     e.stopPropagation();
//     setStartInGrid(true); 
//     setStartIndex(0);
//     setIsFullScreen(true);
//   };

//   const handleCloseFullScreen = () => {
//     setIsFullScreen(false);
//     setStartInGrid(false);
//   };

//   const columns = (containerWidth) => {
//     if (containerWidth < 400) return 2;
//     if (containerWidth < 768) return 3;
//     return 4;
//   };

//   const imageRenderer = ({ index, photo }) => {
//     const isLastVisible = index === maxVisible - 1 && remainingCount > 0;

//     return (
//       <div
//         key={photo.src}  
//         style={{ position: 'relative', cursor: 'pointer' }}
//         onClick={(e) =>
//           isLastVisible ? handleLastImageClick(e) : handleImageClick(e, { photo, index })
//         }
//       >
//         <img {...photo} alt={`Gallery image ${index + 1}`} />
//         {isLastVisible && (
//           <div className="gallery-overlay">
//             <span className="gallery-overlay-text">+{remainingCount}</span>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       <div className="gallery-container-" id="image-gallery-container">
//         <h3 style={{
//   fontSize: "22px",
//   fontFamily:"lisu bosa",
//   fontStyle:'italic',
//   fontWeight: 600,
//   color: "#202122",
//   marginBottom: "0.5rem",
//   paddingBottom: "0.1rem",
//   borderBottom: "1px solid #d3d5d8",
//   textAlign: "left"
// }}
// >Gallery</h3>
//         <Gallery
//           photos={visibleImages}
//           columns={columns}
//           renderImage={imageRenderer}
//         />
//       </div>

//       {isFullScreen && (
//         <FullScreenGallery
//           images={images}          
//           onClose={handleCloseFullScreen}
//           startIndex={startIndex}
//           startInGridMode={startInGrid}
//         />
//       )}
//     </>
//   );
// };

// export default ImageGalleryGrid;



import React, { useState, useMemo } from 'react';
import FullScreenGallery from './FullScreenGallery';
import './ImageGalleryGrid.css';

const ImageGalleryGrid = ({
  images = [],
  onImageClickWithIndex,
  maxVisible = 6
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [startInGrid, setStartInGrid] = useState(false);

  // Show only maxVisible images in grid
  const visibleImages = useMemo(() => images.slice(0, maxVisible), [images, maxVisible]);
  const remainingCount = images.length - maxVisible;

  const handleImageClick = (index) => {
    setStartInGrid(false);
    if (onImageClickWithIndex) {
      onImageClickWithIndex(index);
    } else {
      setStartIndex(index);
      setIsFullScreen(true);
    }
  };

  const handleLastImageClick = (e) => {
    e.stopPropagation();
    setStartInGrid(true);
    setStartIndex(0);
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
    setStartInGrid(false);
  };

  return (
    <>
      <div className="image-gallery-wrapper" id="image-gallery-container">
        <h3
          style={{
            fontSize: "1.6rem",
            fontWeight: 900,
            fontFamily: "lisu bosa, sans-serif",
            fontStyle: "italic",
            background: "linear-gradient(135deg, #2c5282, #4a90bd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
            marginTop: "0.4rem",
            paddingBottom: "0rem",
            borderBottom: "3px solid",
            borderImage: "linear-gradient(135deg, #2c5282, #4a90bd) 1",
            textAlign: "left",
            lineHeight: 1.3,
            display: "inline-block"
          }}

        >
          Gallery
        </h3>

        <div className="gallerygrid-content">
          {visibleImages.map((image, index) => {
            const isLastVisible = index === maxVisible - 1 && remainingCount > 0;

            return (
              
              <figure
                key={index}
                onClick={(e) =>
                  isLastVisible ? handleLastImageClick(e) : handleImageClick(index)
                }
                style={{ cursor: "pointer" }}
              >
                <img
                  src={image.src}
                  alt={`Gallery image ${index + 1}`}
                  className="gallerygrid-image"
                />

                {isLastVisible && (
                  <div className="gallery-overlay">
                    <span className="gallery-overlay-text">
                      +{remainingCount}
                    </span>
                  </div>
                )}
              </figure>
              
            );
          })}
        </div>
      </div>

      {isFullScreen && (
        <FullScreenGallery
          images={images}
          onClose={handleCloseFullScreen}
          startIndex={startIndex}
          startInGridMode={startInGrid}
        />
      )}
    </>
  );
};

export default ImageGalleryGrid;
