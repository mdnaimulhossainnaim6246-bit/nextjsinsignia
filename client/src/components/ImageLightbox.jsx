import React from 'react';
import './ImageLightbox.css';

const ImageLightbox = ({ src, onClose, onDownload }) => {
  if (!src) return null;

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Enlarged view" className="lightbox-image" />
        <div className="discover-lightbox-actions">
          <button onClick={onDownload} className="lightbox-btn download-btn">Download</button>
          <button onClick={onClose} className="lightbox-btn close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;