// import React, { useEffect, useRef, useState } from 'react';
// import './ImageGallery.css';

// const ImageGallery = ({ onChange, initialImages = [] }) => {
//   const [images, setImages] = useState([]);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const newImages = initialImages.map((img) => {
//       // If it's a string, it's a URL from the server
//       if (typeof img === 'string') {
//         return { file: null, preview: img, isUrl: true };
//       }
//       // If it has a preview and isUrl property, it's one of our internal objects.
//       if (img.preview && img.isUrl !== undefined) {
//         return img;
//       }
//       // Otherwise, assume it's a File object that we haven't processed yet.
//       return {
//         file: img,
//         preview: URL.createObjectURL(img),
//         isUrl: false,
//       };
//     });
//     setImages(newImages);
//   }, [initialImages]);

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map(file => ({
//       file,
//       preview: URL.createObjectURL(file),
//       isUrl: false,
//     }));
    
//     const updatedImages = [...images, ...newImages];
//     setImages(updatedImages);
//     onChange(updatedImages);

//     e.target.value = null;
//   };

//   const handleRemove = (index) => {
//     const updated = [...images];
//     const removedImage = updated.splice(index, 1)[0];
    
//     if (!removedImage.isUrl) {
//       URL.revokeObjectURL(removedImage.preview);
//     }
    
//     setImages(updated);
//     onChange(updated);
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current.click();
//   };

//   return (
//     <div className="gallery-container">
//       <h2 style={{
//   fontSize: "1.5rem",
//   fontFamily:"lisu bosa",
//   fontWeight: 600,
//   color: "#202122",
//   marginBottom: "1rem",
//   paddingBottom: "0.5rem",
//   borderBottom: "1px solid #a2a9b1",
//   textAlign: "left"
// }}
//  >Image Gallery</h2>

//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         ref={fileInputRef}
//         onChange={handleImageUpload}
//         style={{ display: 'none' }}
//       />

//       <button type="button" className="custom-upload-btn" onClick={triggerFileInput}>
//         Choose Images
//       </button>

//       {images.length === 0 && <p className="empty-text">No images added yet</p>}

//       <div className="gallery-grid">
//         {images.map((img, idx) => (
//           <div className="image-card" key={idx}>
//             <img src={img.preview} alt={`Preview ${idx}`} />
//             <button type="button" className="remove-btn" onClick={() => handleRemove(idx)}>✖</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ImageGallery;





// import React, { useEffect, useRef, useState } from 'react';
// import './ImageGallery.css';

// const ImageGallery = ({ onChange, initialImages = [] }) => {
//   const [images, setImages] = useState([]);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const newImages = initialImages.map((img) => {
//       if (typeof img === 'string') {
//         return { file: null, preview: img, isUrl: true, alt: '' };
//       }
//       if (img.preview && img.isUrl !== undefined) {
//         return { ...img, alt: img.alt || '' };
//       }
//       return { file: img, preview: URL.createObjectURL(img), isUrl: false, alt: '' };
//     });
//     setImages(newImages);
//   }, [initialImages]);

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map(file => ({
//       file,
//       preview: URL.createObjectURL(file),
//       isUrl: false,
//       alt: '',
//     }));

//     const updatedImages = [...images, ...newImages];
//     setImages(updatedImages);
//     onChange(updatedImages);

//     e.target.value = null;
//   };

//   const handleRemove = (index) => {
//     const updated = [...images];
//     const removedImage = updated.splice(index, 1)[0];
//     if (!removedImage.isUrl) URL.revokeObjectURL(removedImage.preview);
//     setImages(updated);
//     onChange(updated);
//   };

//   const handleAltChange = (index, alt) => {
//     const updated = [...images];
//     updated[index].alt = alt;
//     setImages(updated);
//     onChange(updated);
//   };

//   const triggerFileInput = () => fileInputRef.current.click();

//   return (
//     <div className="gallery-container">
//       <h2 style={{
//         fontSize: "1.5rem",
//         fontFamily:"lisu bosa",
//         fontWeight: 600,
//         color: "#202122",
//         marginBottom: "1rem",
//         paddingBottom: "0.5rem",
//         borderBottom: "1px solid #a2a9b1",
//         textAlign: "left"
//       }}>
//         Image Gallery
//       </h2>

//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         ref={fileInputRef}
//         onChange={handleImageUpload}
//         style={{ display: 'none' }}
//       />

//       <button type="button" className="custom-upload-btn" onClick={triggerFileInput}>
//         Choose Images
//       </button>

//       {images.length === 0 && <p className="empty-text">No images added yet</p>}

//       <div className="gallery-grid">
//         {images.map((img, idx) => (
//           <div className="image-card" key={idx} style={{ position: 'relative' }}>
//             {/* Alt input overlay */}
//             <input
//               type="text"
//               placeholder="Enter alt text"
//               value={img.alt}
//               onChange={(e) => handleAltChange(idx, e.target.value)}
//               style={{
//                 position: 'absolute',
//                 bottom: '0px',
//                 left: '0px',
//                 // width: 'calc(100% - 10px)',
//                 width:'100%',
//                 padding: '5px',
//                 backgroundColor: 'rgba(9,9,9,0.8)',
//                 border: '1px solid #777',
//                 borderRadius: '0px',
//                 zIndex: 2,
//                 color:'#eee'
//               }}
//             />
//             <img src={img.preview} alt={img.alt || `Preview ${idx}`} style={{ width: '100%', display: 'block' }} />
//             <button
//               type="button"
//               // className="remove-btn"
//               onClick={() => handleRemove(idx)}
//               style={{
//                 position: 'absolute',
//                 top: '5px',
//                 right: '5px',
//                 zIndex: 3,
//                 background: 'rgba(255,0,0,0.7)',
//                 color: '#fff',
//                 border: 'none',
//                 borderRadius: '50%',
//                 minWidth: '25px',
//                 minHeight: '25px',
//                 cursor: 'pointer',
//                 textAlign:'center',
//                 display:'flex',
//                 alignItems:'center',
//                 padding:'1px 0px 0px 6px'
//               }}
//             >✖</button>
//           </div>
//         ))}
        
//       </div>
//     </div>
//   );
// };

// export default ImageGallery;





import React, { useEffect, useRef, useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ onChange, initialImages = [] }) => {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const newImages = initialImages.map((img) => {
      if (typeof img === "string") {
        return { file: null, preview: img, isUrl: true, alt: "" };
      }
      if (img.preview && img.isUrl !== undefined) {
        return { ...img, alt: img.alt || "" };
      }
      if (img instanceof File || img instanceof Blob) {
        return { file: img, preview: URL.createObjectURL(img), isUrl: false, alt: "" };
      }
      // fallback for invalid data
      return { file: null, preview: "", isUrl: false, alt: "" };
    });
    setImages(newImages);
  }, [initialImages]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isUrl: false,
      alt: '',
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onChange(updatedImages);

    e.target.value = null;
  };

  const handleRemove = (index) => {
    const updated = [...images];
    const removedImage = updated.splice(index, 1)[0];
    if (!removedImage.isUrl) URL.revokeObjectURL(removedImage.preview);
    setImages(updated);
    onChange(updated);
  };

  const handleAltChange = (index, alt) => {
    const updated = [...images];
    updated[index].alt = alt;
    setImages(updated);
    onChange(updated);
  };

  const triggerFileInput = () => fileInputRef.current.click();

  return (
    <div className="gallery-container">
      <h2 style={{
        fontSize: "1.5rem",
        fontFamily:"lisu bosa",
        fontWeight: 600,
        color: "#202122",
        marginBottom: "1rem",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid #a2a9b1",
        textAlign: "left"
      }}>
        Image Gallery
      </h2>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      <button type="button" className="custom-upload-btn" onClick={triggerFileInput}>
        Choose Images
      </button>

      {images.length === 0 && <p className="empty-text">No images added yet</p>}

      <div className="gallery-grid">
        {images.map((img, idx) => (
          <div className="image-card" key={idx} style={{ position: 'relative' }}>
            {/* Alt input overlay */}
            <input
              type="text"
              placeholder="Enter alt text"
              value={img.alt}
              onChange={(e) => handleAltChange(idx, e.target.value)}
              style={{
                position: 'absolute',
                bottom: '0px',
                left: '0px',
                width:'100%',
                padding: '5px',
                backgroundColor: 'rgba(9,9,9,0.8)',
                border: '1px solid #777',
                borderRadius: '0px',
                zIndex: 2,
                color:'#eee'
              }}
            />
            <img
              src={img.preview}
              alt={img.alt || `Preview ${idx}`}
              style={{ width: '100%', display: 'block' }}
            />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                zIndex: 3,
                background: 'rgba(255,0,0,0.7)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                minWidth: '25px',
                minHeight: '25px',
                cursor: 'pointer',
                textAlign:'center',
                display:'flex',
                alignItems:'center',
                padding:'1px 0px 0px 6px'
              }}
            >✖</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
