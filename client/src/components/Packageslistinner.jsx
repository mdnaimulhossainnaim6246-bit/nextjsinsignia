import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
// import moment from 'moment';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
import '../individualCSS/Packages/packageslist.css';
// import ScrollReveal from 'scrollreveal';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { useAppContext } from '../context/AppContext';
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Packageslistinner = ({ packages }) => {
  const { place, description, image, _id, rating, duration, latestPrice, oldPrice } = packages;
  const { axios } = useAppContext();
  const [galleryImages, setGalleryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const imageContainerRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const contentEl = contentRef.current;
    const imageContainerEl = imageContainerRef.current;

    if (contentEl && imageContainerEl) {
      const setHeight = () => {
        const contentHeight = contentEl.offsetHeight;
        imageContainerEl.style.height = `${contentHeight}px`;
      };

      setHeight();

      const resizeObserver = new ResizeObserver(setHeight);
      resizeObserver.observe(contentEl);

      // Cleanup observer on component unmount
      return () => resizeObserver.disconnect();
    }
  }, [packages]);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const res = await axios.get(`/addpackages/by-placename/${encodeURIComponent(place)}`);
        if (res.data?.packages) {
          const { galleryImages = [], image: mainImage, dynamicBlocks = [] } = res.data.packages;
          
          const allImages = [mainImage, ...galleryImages];
          
          // Extract images from dynamicBlocks if any
          dynamicBlocks.forEach(block => {
            if (block.image) {
              allImages.push(block.image);
            }
          });

          setGalleryImages([...new Set(allImages.filter(img => img))]); // Filter out null/undefined images and remove duplicates
        }
      } catch (error) {
        console.error("Failed to load package details for gallery", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageDetails();
  }, [place, axios]);

  const calculateDiscount = (oldPrice, latestPrice) => {
  if (!oldPrice || !latestPrice || oldPrice <= latestPrice) {
    return null;
  }
  const discount = ((oldPrice - latestPrice) / oldPrice) * 100;
  return Math.round(discount); 
};


  const discountPercentage = calculateDiscount(oldPrice, latestPrice);

  const cleanDescription = description
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  let trimmed = cleanDescription;
  if (cleanDescription.length > 400) {
    const words = cleanDescription.slice(0, 400).split(' ');
    words.pop();
    trimmed = words.join(' ').trim() + '...';
  }

  // const handleCardClick = (e) => {
  //   if (e.target.closest('.swiper-button-prev, .swiper-button-next, .swiper-pagination, .package-swiper, .image-zoom-icon')) {
  //     return;
  //   }
  //   window.open(`/package-details/${encodeURIComponent(place)}`, '_blank');
  // };
  const handleCardClick = (e) => {
  if (e.target.closest('.swiper-button-prev, .swiper-button-next, .swiper-pagination, .package-swiper, .image-zoom-icon')) {
    return;
  }
  window.location.href = `/tour-packages-details/${encodeURIComponent(place)}`;
};


  return (
    <>
      <div
        className="package-card"
      >
        <div ref={imageContainerRef} className="package-card-image-container">
          {isLoading ? (
            <div className="loading-placeholder"></div>
          ) : (
            <div className="swiper-container-with-count">
              <Swiper
                modules={[Navigation, Pagination, A11y]}
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                spaceBetween={20}
                slidesPerView={'auto'}
                loop={true}
                grabCursor={true}
              slidesOffsetAfter={20} 
                className="package-swiper white-pagination-swiper"
              >
                {galleryImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img src={img} alt={`${place} gallery image ${index + 1}`} className="package-card-image" />
                    <div className="image-count">{index + 1} / {galleryImages.length}</div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          
          {discountPercentage && (
            <div>
            <div className="package-inner-card-discount-badge"> 
             <span> <span className='Flat-discount'>FLAT</span> <br /> <span style={{fontSize:'2.2rem',fontWeight:'800',lineHeight:'1'}}>{discountPercentage}<span  style={{fontSize:'2.2rem',fontWeight:'700',fontFamily:'Poppins'}}>%</span></span> <br /> <span className='offer-text-off'>OFF</span></span> 
             </div>
              
              <div className='package-card-discount-badge-shadow'></div>

              <div className='offer-badge-one-div'>
                <div className='offer-badge-one-span'> SPECIAL OFFER</div>
              <div className='offer-badge-one'>BIG SAVE</div>
             
              </div>
              </div>
          )}
        </div>
        <div ref={contentRef} className="package-card-content">
          <div className="package-card-location-rating">
            <h4 ref={cardRef}
        onClick={handleCardClick} style={{margin:'0'}} className="package-card-title">{place}</h4>
            <div className="package-card-rating">
              <span className="star-icon">★</span> <span style={{color:'#777',fontFamily:'Poppins',fontWeight:'400',fontSize:'14px'}}>{rating}.0</span> 
            </div>
          </div>
          <p className="package-card-description">{trimmed}</p>
          

         
          <div style={{display:'flex',marginTop:'10px'}}><i style={{color:'#4a90bd', marginRight:'5px',marginTop:'5px'}} className="fa-solid fa-location-crosshairs"></i>
          <div className="package-card-locations"> 
  {packages.placesLocation?.map((loc, idx) => (
    <React.Fragment key={idx}>
      {loc.url ? (
        <a href={loc.url} target="_blank" rel="noopener noreferrer" className="package-card-location-link">
          {loc.name}
        </a>
      ) : (
        <span className="package-card-location-name">{loc.name}</span>
      )}
      {idx < packages.placesLocation.length - 1 && <span>, </span>}
    </React.Fragment>
  ))}
</div>
</div>


          <div className="package-card-details">
            <div style={{alignItems:'center'}} className="package-card-price">
             
             <span style={{alignItems:'center',marginBottom:'2px',fontWeight:'600',marginRight:'5px'}}> <span style={{color:'#4a90bd',fontSize:'0.9rem'}}><i style={{fontSize:'0.99rem',marginRight:'2px'}} className="fa-solid fa-sack-dollar"></i> </span> <span style={{color:'#333',fontSize:'0.9rem'}}>From</span> </span>

              <span  className="package-card-latest-price-inner" style={{ color: oldPrice && oldPrice > latestPrice ? 'green' : '#2b8dca' }}>  ${latestPrice}*</span>
              {oldPrice && <span className="package-card-old-price-inner">${oldPrice}</span>} <span style={{color:'#666',fontSize:'13px',marginLeft:'7px',fontWeight:'600'}}>per person</span>
            </div>
            {/* {duration && (
              <p className="package-card-duration">
                <i className="fa-solid fa-clock"></i>
                {duration.value} {duration.unit}(s)
              </p>
            )} */}
            {duration && (
              <p className="package-card-duration">
                <i className="fa-solid fa-clock"></i>
                {duration.value} {duration.unit}{duration.value > 1 ? 's' : ''}
              </p>
            )}

          </div>
          <p ref={cardRef}
        onClick={handleCardClick} className="package-card-button">
            view details
          </p>
        </div>
      </div>
    </>
  );
};

export default Packageslistinner;
