import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../individualCSS/components/ImageGalleryCarousel.css';

const ImageGalleryCarousel = ({ image, galleryImages }) => {
  const [isHovered, setIsHovered] = useState(false);
  const images = [image, ...galleryImages];

  return (
    <div 
      className="image-gallery-carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        navigation={isHovered}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
          renderBullet: function (index, className) {
            const totalBullets = this.slides.length;
            let bullets = '';
            let start = Math.max(0, index - 2);
            let end = Math.min(totalBullets - 1, index + 2);

            if (index < 2) {
              end = Math.min(4, totalBullets - 1);
            }

            if (index > totalBullets - 3) {
              start = Math.max(0, totalBullets - 5);
            }

            for (let i = 0; i < totalBullets; i++) {
              if (i >= start && i <= end) {
                bullets += `<span class="${className} ${i === index ? 'swiper-pagination-bullet-active' : ''}" data-index="${i}"></span>`;
              } else {
                bullets += `<span class="swiper-pagination-bullet-hidden" data-index="${i}"></span>`;
              }
            }
            return bullets;
          },
        }}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} alt={`gallery image ${i + 1}`} className="package-card-image" />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination"></div>
    </div>
  );
};

export default ImageGalleryCarousel;