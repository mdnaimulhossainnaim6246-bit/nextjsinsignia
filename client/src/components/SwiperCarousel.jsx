

// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, A11y } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import '../individualCSS/components/SwiperCarousel.css';

// const SwiperCarousel = ({ items, renderItem }) => {
//   return (
//     <div className="swiper-carousel-container">
//       <Swiper
//         modules={[Navigation, Pagination, A11y]}
//         navigation={{
//           nextEl: '.swiper-button-next-custom',
//           prevEl: '.swiper-button-prev-custom',
//         }}
//         pagination={{ clickable: true, dynamicBullets: true }}
//         spaceBetween={20}
//         slidesPerView={'auto'}
//         loop={true}                  // loop thakbe
//         // centeredSlides={true}        // main slide always center
//         grabCursor={true}            // cursor pointer effect
//         slidesOffsetBefore={18}      // left side spacing
//         slidesOffsetAfter={0}       // right side spacing
//       >
//         {items.map((item, i) => (
//           <SwiperSlide key={i}>
//             <div className="discover___item___wrapper">
//               {renderItem(item)}
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//       <div className="swiper-button-next-custom"></div>
//       <div className="swiper-button-prev-custom"></div>
//     </div>
//   );
// };

// export default SwiperCarousel;


import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './SwiperCarousel.css';

const SwiperCarousel = ({ items, renderItem }) => {
  // Slide duplicate করে loop warning এড়ানো
  const slides =
    items.length < 3 ? [...items, ...items] : items;

  return (
    <div className="swiper-carousel-container">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
        pagination={{ clickable: true, dynamicBullets: true }}
        spaceBetween={20}
        slidesPerView={'auto'}
        loop={slides.length > 2} 
        grabCursor={true}
        slidesOffsetBefore={18}
        slidesOffsetAfter={0}
      >
        {slides.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="discover___item___wrapper">
              {renderItem(item)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-button-next-custom"></div>
      <div className="swiper-button-prev-custom"></div>
    </div>
  );
};

export default SwiperCarousel;
