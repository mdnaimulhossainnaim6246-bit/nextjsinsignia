// import React, { useState, useCallback } from 'react';
// import Modal from 'react-modal';
// import Cropper from 'react-easy-crop';
// import getCroppedImg from './cropImage';
// import './ImageCropper.css';

// const CropIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path>
//     <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>
//   </svg>
// );

// Modal.setAppElement('#root');

// const ImageCropper = ({ initialImage, onSave, onCancel }) => {
//   const [image, setImage] = useState(initialImage);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [aspect, setAspect] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
//   const [isCropping, setIsCropping] = useState(false);

//   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const handleDoneCropping = async () => {
//     if (!croppedAreaPixels) return;
//     try {
//       const croppedImageUrl = await getCroppedImg(initialImage, croppedAreaPixels);
//       setImage(croppedImageUrl);
//       setIsCropping(false);
//     } catch (e) {
//       console.error('Error cropping image:', e);
//     }
//   };

//   const handleSave = () => {
//     onSave(image);
//   };

//   const handleToggleAspect = (newAspect) => {
//     setAspect(newAspect);
//     setCrop({ x: 0, y: 0 });
//     setZoom(1);
//   };

//   return (
//     <Modal
//       isOpen={true}
//       onRequestClose={onCancel}
//       className="ImageCropper-modal"
//       overlayClassName="ImageCropper-overlay"
//     >
//       <div className="ImageCropper-container">
//         <div className="ImageCropper-header">
//           <button onClick={onCancel} className="ImageCropper-button-text">Back</button>
//           {isCropping ? (
//             <button onClick={handleDoneCropping} className="ImageCropper-button-text primary">Done</button>
//           ) : (
//             <button onClick={handleSave} className="ImageCropper-button-text primary">Save</button>
//           )}
//         </div>

//         <div className="ImageCropper-content">
//           {isCropping ? (
//             <Cropper
//               image={initialImage} // <-- use initialImage
//               crop={crop}
//               zoom={Number(zoom)}
//               aspect={aspect}
//               onCropChange={setCrop}
//               onZoomChange={(z) => setZoom(Number(z))}
//               onCropComplete={onCropComplete}
//               showGrid
//             />
//           ) : (
//             <img src={image} alt="Preview" className="ImageCropper-preview-image" />
//           )}
//         </div>

//         <div className="ImageCropper-footer">
//           {isCropping ? (
//             <div className="ImageCropper-crop-controls">
//               <div className="ImageCropper-aspect-toggles">
//                 <button 
//                   onClick={() => handleToggleAspect(1)} 
//                   className={`ImageCropper-button-toggle ${aspect === 1 ? 'active' : ''}`}
//                 >
//                   Square
//                 </button>
//                 <button 
//                   onClick={() => handleToggleAspect(null)} 
//                   className={`ImageCropper-button-toggle ${aspect === null ? 'active' : ''}`}
//                 >
//                   Custom
//                 </button>
//               </div>
//               <input
//                 type="range"
//                 value={zoom}
//                 min={1}
//                 max={3}
//                 step={0.1}
//                 onChange={(e) => setZoom(Number(e.target.value))}
//                 className="ImageCropper-slider"
//               />
//             </div>
//           ) : (
//             <button onClick={() => setIsCropping(true)} className="ImageCropper-button-icon">
//               <CropIcon />
//               <span>Crop</span>
//             </button>
//           )}
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default ImageCropper;

import React, { useState, useCallback } from 'react';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import './ImageCropper.css';

const CropIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path>
    <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>
  </svg>
);

Modal.setAppElement('#root');

const ImageCropper = ({ initialImage, onSave, onCancel, onCropComplete: onCropFinished }) => {
  const [image, setImage] = useState(initialImage);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1); // 1 = square, null = freeform
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDoneCropping = async () => {
    if (!croppedAreaPixels || croppedAreaPixels.width === 0 || croppedAreaPixels.height === 0) {
      console.error("No valid crop selected");
      return;
    }

    try {
      const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
      if (onCropFinished) {
        onCropFinished(croppedImageUrl);
      }
      setImage(croppedImageUrl);
      setIsCropping(false);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  const handleSave = () => {
    onSave(image);
  };

  // const handleToggleAspect = (newAspect) => {
  //   setAspect(newAspect);
  //   setCrop({ x: 0, y: 0 });
  //   setZoom(1);
  // };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onCancel}
      className="ImageCropper-modal"
      overlayClassName="ImageCropper-overlay"
    >
      <div className="ImageCropper-container">
        {/* <div className="ImageCropper-header">
          <button onClick={onCancel} className="ImageCropper-button-text">Back</button>
          {isCropping ? (
            <button
              onClick={handleDoneCropping}
              disabled={!croppedAreaPixels || croppedAreaPixels.width === 0 || croppedAreaPixels.height === 0}
              className="ImageCropper-button-text primary"
            >
              Done
            </button>
          ) : (
            <button onClick={handleSave} className="ImageCropper-button-text primary">Save</button>
          )}
        </div> */}

        
  {/* <button
    onClick={() => {
      if (isCropping) {
        // If currently cropping, just go back to preview
        setIsCropping(false);
      } else {
        // Otherwise, call the cancel handler (go back to previous page/gallery)
        onCancel();
      }
    }}
    className="ImageCropper-button-text"
  >
    Back
  </button> */}

  <div className="ImageCropper-header">
  {isCropping && (
    <button
      onClick={() => {
        setIsCropping(false); // go back to preview
      }}
      className="ImageCropper-button-text"
    >
      Back
    </button>
  )}
  <div></div>
  {isCropping ? (
    <button
      onClick={handleDoneCropping}
      disabled={!croppedAreaPixels || croppedAreaPixels.width === 0 || croppedAreaPixels.height === 0}
      className="ImageCropper-button-text primary"
    >
      Done
    </button>
  ) : (
    <button onClick={handleSave} className="ImageCropper-button-text primary">Save</button>
  )}
</div>


  {/* {isCropping ? (
    <button
      onClick={handleDoneCropping}
      disabled={!croppedAreaPixels || croppedAreaPixels.width === 0 || croppedAreaPixels.height === 0}
      className="ImageCropper-button-text primary"
    >
      Done
    </button>
  ) : (
    <button onClick={handleSave} className="ImageCropper-button-text primary">Save</button>
  )} */}



        <div className="ImageCropper-content">
          {isCropping ? (
            <Cropper
              image={image} // use current image state
              crop={crop}
              zoom={Number(zoom)}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={(z) => setZoom(Number(z))}
              onCropComplete={onCropComplete}
              showGrid
            />
          ) : (
            <img src={image} alt="Preview" className="ImageCropper-preview-image" />
          )}
        </div>

        <div className="ImageCropper-footer">
          {isCropping ? (
            <div className="ImageCropper-crop-controls">
              {/* <div className="ImageCropper-aspect-toggles">
                <button 
                  onClick={() => handleToggleAspect(1)} 
                  className={`ImageCropper-button-toggle ${aspect === 1 ? 'active' : ''}`}
                >
                  Square
                </button>
                <button 
                  onClick={() => handleToggleAspect(null)} 
                  className={`ImageCropper-button-toggle ${aspect === null ? 'active' : ''}`}
                >
                  Custom
                </button>
              </div> */}
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="ImageCropper-slider"
              />
            </div>
          ) : (
            <button onClick={() => setIsCropping(true)} className="ImageCropper-button-icon">
              <CropIcon />
              <span>Crop</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImageCropper;

