import React, { useState, useEffect } from 'react';
import './FullScreenGallery.css';

const FullScreenGallery = ({ images, onClose, startIndex = 0, startInGridMode = false }) => {
  const [lightboxState, setLightboxState] = useState({
    isOpen: !startInGridMode,
    currentIndex: startIndex,
  });
  const [isFullScreen, setIsFullScreen] = useState(false);

  const openLightbox = (index) => {
    setLightboxState({ isOpen: true, currentIndex: index });
  };

  const closeLightbox = () => {
    setLightboxState({ isOpen: false, currentIndex: 0 });
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    if (onClose) {
      onClose();
    }
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setLightboxState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % images.length,
    }));
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setLightboxState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + images.length) % images.length,
    }));
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const imageUrl = images[lightboxState.currentIndex].src;
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `image_${lightboxState.currentIndex + 1}.jpg`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };

  const toggleFullScreen = (e) => {
    e.stopPropagation();
    const elem = document.querySelector('.lightbox-overlay');
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxState.isOpen) {
        if (e.key === 'ArrowRight') {
          goToNext(e);
        } else if (e.key === 'ArrowLeft') {
          goToPrevious(e);
        } else if (e.key === 'Escape') {
          closeLightbox();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxState.isOpen, goToNext, goToPrevious, closeLightbox]);


  return (

    <div style={{zIndex:'99999' , position:'absolute'}}>
    <div className="full-screen-gallery">

      <div style={{height:"63px",background:'#fff',position:'fixed',zIndex:"9",width:'100%',top:'0',maxWidth:'1250px',display:'flex',alignItems:'center',justifyContent:'space-between',}} >
        <h2 style={{margin:'0',background: 'linear-gradient(135deg, rgb(44, 82, 130), rgb(74, 144, 189)) text',WebkitBackgroundClip: 'text',color: 'transparent', marginLeft:'20px',fontSize:"1.9rem",fontWeight:'700',}}>Gallery</h2>
      {!lightboxState.isOpen && (
      <button style={{ background: "#fff", borderRadius: '50%',height:'35px',width:'35px',boxShadow:'0 2px 12px #00000026',cursor:'pointer',marginRight:'20px' }} className="show-less-button" onClick={onClose}>
        ✕
      </button>
      )} 
      </div>
      
      <div className="gallery-content">
        {images.map((image, index) => (
        <figure key={index}>
          <img
            src={image.src}
            alt={`Gallery image ${index + 1}`}
            className="gallery-image"
            onClick={() => openLightbox(index)}
          />
          </figure>
        ))}        
      </div>
      

      {lightboxState.isOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          {/* {isFullScreen && (
            <button className="lightbox-fullscreen-close-btn" onClick={toggleFullScreen} title="Exit Fullscreen">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )} */}
          <div className="lightbox-toolbar">
            <div style={{display:'flex',alignItems:'center',columnGap:'15px'}}>
            <div className="lightbox-counter">
              {lightboxState.currentIndex + 1} / {images.length}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxState(prev => ({ ...prev, isOpen: !prev.isOpen }));
              }}
              className="lightbox-action-btn"
              title="Show Gallery Grid"
            >
              {lightboxState.isOpen ? (
                // Lightbox open → show grid icon (your existing one)
                <svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#EFEFEF"><path              d="M520-600v-240h320v240H520ZM120-440v-400h320v400H120Zm400 320v-400h320v400H520Zm-400 0v-240h320v240H120Zm80-400h160v-240H200v240Zm400              320h160v-240H600v240Zm0-480h160v-80H600v80ZM200-200h160v-80H200v80Zm160-320Zm240-160Zm0 240ZM360-280Z"/></svg>
              ) : (
                // Lightbox closed → show some icon, e.g. expand (optional)
                <i className="fa-solid fa-images"></i>
              )}
            </button>
            </div>
            <div className="lightbox-actions">
              <button className="lightbox-action-btn" onClick={handleDownload} title="Download">
                <i className="fa-solid fa-download"></i>
              </button>
              <button className="lightbox-action-btn" onClick={toggleFullScreen} title="Toggle Fullscreen">
                 {isFullScreen ? (
                   <i className="fa-solid fa-compress"></i>   
                 ) : (
                   <i className="fa-solid fa-expand"></i>     
                 )}
               </button>

              <button className="lightbox-action-btn" onClick={closeLightbox} title="Close">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          
          <button className="lightbox-prev" onClick={goToPrevious}>&#10094;</button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[lightboxState.currentIndex].src} 
              alt={images[lightboxState.currentIndex].alt || `Lightbox view ${lightboxState.currentIndex + 1}`}
              className="lightbox-image" 
            />
            {images[lightboxState.currentIndex].alt && (
              <p className="lightbox-alt-text" style={{ color: '#fff', textAlign: 'center', marginTop: '5px', fontSize: '0.9rem',fontFamily:'Ubuntu'}}>
                {images[lightboxState.currentIndex].alt}
              </p>
            )}
          </div>

          <button className="lightbox-next" onClick={goToNext}>&#10095;</button>
        </div>
      )}
    </div>
    </div>
  );
};

export default FullScreenGallery;