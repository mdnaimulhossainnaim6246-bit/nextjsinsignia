// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { useAppContext } from '../context/AppContext';
// import Loader from '../components/Loader';
// import '../individualCSS/Reviews.css';

// const StarRating = ({ rating }) => {
//     return (
//         <div className="star-rating">
//             {[...Array(5)].map((_, index) => {
//                 const starClass = index < rating ? 'star-filled' : 'star-empty';
//                 return <span key={index} className={`star ${starClass}`}>★</span>;
//             })}
//         </div>
//     );
// };

// const ReviewDetails = () => {
//     const { id } = useParams();
//     const { axios } = useAppContext();
//     const [review, setReview] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchReviewDetails = async () => {
//             if (!id) return;
//             try {
//                 const { data } = await axios.get(`/addreview/${id}`);
//                 if (data.success) {
//                     setReview(data.review);
//                 } else {
//                     setError('Failed to fetch review details.');
//                 }
//             } catch (err) {
//                 setError('An error occurred while fetching review details.');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchReviewDetails();
//     }, [id, axios]);

//     if (loading) {
//         return <Loader />;
//     }

//     if (error || !review) {
//         return <div className="review-page-error">{error || 'Review not found.'}</div>;
//     }

//     return (
//         <div className="review-details-page">
//             <div className="review-details-card">
//                 <div className="review-details-header">
//                     <img 
//                         src={review.travelersPicture} 
//                         alt={review.travelersName} 
//                         className="review-details-traveler-photo"
//                     />
//                     <div className="review-details-header-info">
//                         <h1 className="review-details-review-title">{review.reviewTitle}</h1>
//                         <p className="review-details-traveler-name">{review.travelersName}</p>
//                         <p className="review-details-traveler-title">{review.travelersTitle}</p>
//                         <StarRating rating={review.rating} />
//                     </div>
//                 </div>

//                 <div 
//                     className="review-details-description"
//                     dangerouslySetInnerHTML={{ __html: review.description }}
//                 />
                
//                 {review.imageGallery && review.imageGallery.length > 0 && (
//                     <div className="review-details-gallery">
//                         <h3 className="gallery-title">Photo Gallery</h3>
//                         <div className="gallery-images-container">
//                             {review.imageGallery.map((img) => (
//                                 <img key={img._id || img.url} src={img.url} alt={img.alt || 'Gallery image'} className="gallery-image" />
//                             ))}
//                         </div>
//                     </div>
//                 )}
                
//                 {review.imageUrls && review.imageUrls.length > 0 && (
//                      <div className="review-details-gallery">
//                         <h3 className="gallery-title">Image URLs</h3>
//                         <div className="gallery-images-container">
//                             {review.imageUrls.map((url, index) => (
//                                 <img key={index} src={url} alt={`Image ${index + 1}`} className="gallery-image" />
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 <div className="review-details-actions">
//                     {review.path && (
//                         <Link to={review.path} className="review-details-btn story-btn">
//                             Read Full Travel Story
//                         </Link>
//                     )}
//                     {review.websiteUrl && (
//                         <a href={review.websiteUrl} target="_blank" rel="noopener noreferrer" className="review-details-btn tripadvisor-btn">
//                             Read Original Review on TripAdvisor
//                         </a>
//                     )}
//                     <Link to="/reviews" className="review-details-btn back-btn">
//                         Back to All Reviews
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ReviewDetails;


import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAppContext } from '../context/AppContext';
import Loader from '../components/Loader';
import '../individualCSS/Reviews.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

// import required modules
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import Mobailenav from '../components/Mobailenav';
import LandingFooter from '../components/LandingFooter';
import ReviewItem from '../components/ReviewItem';
import DiscoverArticle from './discoverarticle';
import GroupTourList from '../components/GroupTourList';
import Packageslistcolumnlist from '../components/Packageslistcolumnlist';
import BlogListcolumnlist from '../components/BlogListcolumnlist';

const StarRating = ({ rating }) => {
    return (
        <div className="star-rating">
            {[...Array(5)].map((_, index) => {
                const starClass = index < rating ? 'star-filled' : 'star-empty';
                return <span key={index} className={`star ${starClass}`}>★</span>;
            })}
        </div>
    );
};

const ReviewDetails = () => {
    const { travelerSlug } = useParams();
    const { axios } = useAppContext();
    const [review, setReview] = useState(null);
    const [allReviews, setAllReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [allImages, setAllImages] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const [swiperInstance, setSwiperInstance] = useState(null);

    useEffect(() => {
        const fetchReviewDetails = async () => {
            if (!travelerSlug) return;
            try {
                const { data } = await axios.get(`/addreview/slug/${travelerSlug}`);
                if (data.success) {
                    setReview(data.review);
                    
                    // Combine image galleries
                    const gallery1 = data.review.imageGallery || [];
                    const gallery2 = data.review.imageUrls || [];
                    const combined = [...gallery1, ...gallery2].filter(img => img.url); // Ensure url exists
                    
                    setAllImages(combined);
                    if (combined.length > 0) {
                        setActiveImage(combined[0].url);
                    }

                } else {
                    setError('Failed to fetch review details.');
                }
            } catch (err) {
                setError('An error occurred while fetching review details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewDetails();
    }, [travelerSlug, axios]);

    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                const { data } = await axios.get('/addreview/all');
                if (data.success) {
                    // Filter out the current review from the list
                    setAllReviews(data.reviews.filter(r => {
                        const slug = (r.travelersName || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
                        return slug !== travelerSlug;
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch all reviews:', error);
            }
        };

        fetchAllReviews();
    }, [axios, travelerSlug]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [travelerSlug]);

    if (loading) return <Loader />;
    if (error || !review) return <div className="review-page-error">{error || 'Review not found.'}</div>;

    const formattedDate = review.reviewDate 
        ? new Date(review.reviewDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : null;

    return (
        <>
            <style>{`
                .swiper-container-custom {
                  width: 100%;
                  padding-top: 20px;
                  padding-bottom: 50px;
                }

                .review-swiper-slide-custom {
                  background-position: center;
                  background-size: cover;
                  width: 350px !important;
                  height: 180px;
                  transition: transform 0.5s;
                }

                .review-swiper-slide-custom img {
                  display: block;
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  border-radius: 5px;
                }
                
                .swiper-slide-active {
                  transform: scale(1.2);
                }

                .preview-image-container {
                    width: 100%;
                    height: 400px;
                    margin-bottom: 1rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .preview-image-container img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
                }
                
                @media (max-width:650px){
                  .review-swiper-slide-custom {
                  width: 280px !important;
                  height: 150px;
                }
                  .preview-image-container {
                    height: 300px;
                }
                }
                @media (max-width:480px){
                  .review-swiper-slide-custom {
                  width: 200px !important;
                  height: 120px;
                }
                  .preview-image-container {
                    height: 280px;
                }
                }
            `}</style>
            <header>
            <Helmet>
                <title>{review.seotitle || review.reviewTitle}</title>
                <meta name="description" content={review.seodescription || ''} />
                <meta name="keywords" content={review.seokeywords || ''} />
                <link rel="canonical" href={window.location.href} />
            </Helmet>
            <div>
                <Mobailenav/>
            </div>
            </header>

            <main style={{background:"#fff"}}>
            <div className='review-main-column-div'>
            
            <div className='review-column-one'>
            <div className="review-details-page">
                <div className="review-details-card">
                    <div className="review-details-header">
                        <img 
                            src={review.travelersPicture} 
                            alt={review.travelersName} 
                            className="review-details-traveler-photo"
                        />
                        <div className="review-details-header-info">
                           
                            <p className="review-details-traveler-name">{review.travelersName}</p>
                            <p className="review-details-traveler-title">{review.travelersTitle}</p>
                            <StarRating rating={review.rating} />
                            {formattedDate && <p className="review-details-date">{formattedDate}</p>}                           
                        </div>
                    </div>

                    <h1 className="review-details-review-title">{review.reviewTitle}</h1>
                    <div 
                        className="review-details-description"
                        dangerouslySetInnerHTML={{ __html: review.description }}
                    />
                    
                    {allImages.length > 0 && (
                        <div className="imagesContainer-travlers" style={{padding: '1.5rem 0'}}>
                            {/* <h3 className="gallery-title">Photo Gallery</h3> */}
                            {activeImage && (
                            <div className="preview-image-container">
                                <img
                                src={activeImage}
                                alt="Active review"
                                style={{ transition: 'transform 0.6s ease', transformStyle: 'preserve-3d' }}
                                />
                            </div>
                            )}
                        
                            <div style={{ position: 'relative', maxWidth:"1024px", margin:'0 auto' }}>
                            <Swiper
                                onSwiper={setSwiperInstance}
                                effect={'coverflow'}
                                grabCursor={true}
                                centeredSlides={true}
                                slidesPerView={'auto'}
                                loop={true}
                                coverflowEffect={{
                                rotate: 50,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true,
                                }}
                                modules={[EffectCoverflow, Autoplay]}
                                className="swiper-container-custom"
                                onSlideChange={(swiper) => {
                                const realIndex = swiper.realIndex % allImages.length;
                                setActiveImage(allImages[realIndex].url);
                                }}
                            >
                                {allImages.map((image, index) => (
                                <SwiperSlide
                                    key={index}
                                    className="review-swiper-slide-custom"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                    if (swiperInstance) swiperInstance.slideToLoop(index);
                                    }}
                                >
                                    <img src={image.url} alt={image.alt || `Review image ${index + 1}`} />
                                </SwiperSlide>
                                ))}
                            </Swiper>

                            <button
                                style={{
                                position: 'absolute',
                                top: '50%',
                                left: '10px',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: 'rgba(0,0,0,0.5)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '35px',
                                height: '35px',
                                cursor: 'pointer',
                                fontWeight:'bold'
                                }}
                                onClick={() => swiperInstance?.slidePrev()}
                            >
                                ‹
                            </button>

                            <button
                                style={{
                                position: 'absolute',
                                top: '50%',
                                right: '10px',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: 'rgba(0,0,0,0.5)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '35px',
                                height: '35px',
                                cursor: 'pointer',
                                fontWeight:'bold',
                                }}
                                onClick={() => swiperInstance?.slideNext()}
                            >
                                ›
                            </button>
                            </div>
                        </div>
                    )}
                      
                      <div className='review-travel-story-link-div'>
                        <img style={{width:'30px'}} src="/assets/info-icon.png" alt="info-icon" />
                        <p className='review-travel-story-link-p' >See their full travel story — {review.path && (
                            <a href={review.path} target="_blank" rel="noopener noreferrer" className="review-travel-story-btn">
                               tap to explore 
                            </a>
                        )}   </p>
                      </div>
                    
                    <div className="review-details-actions">

                        {/* {review.path && (
                            <a href={review.path} target="_blank" rel="noopener noreferrer" className="review-details-btn story-btn">
                                Read Full Travel Story
                            </a>
                        )} */}
                        
                        {review.websiteUrl && (
                            <a href={review.websiteUrl} target="_blank" rel="noopener noreferrer" className="review-details-btn tripadvisor-btn">
                                Read Original Review on TripAdvisor
                            </a>
                        )} 
                         <Link to="/reviews" className="review-details-btn back-btn">
                            Back to Review Page
                        </Link>                     
                    </div>
                </div>
            </div>

            <div className="all-reviews-container">
                <h2 className="all-reviews-title">See more reviews</h2>
                <div className="modern-reviews-grid">
                    {allReviews.map(rev => (
                        <ReviewItem key={rev._id} review={rev} />
                    ))}
                </div>
            </div>

            </div>

             <div className='review-column-tow'>
                <div><DiscoverArticle/></div>
                <div><GroupTourList/></div>
             </div>


            </div>
            </main>
             <section>
              <BlogListcolumnlist/>
              <Packageslistcolumnlist/>
            </section>
            <footer>
                <LandingFooter/>
            </footer>
        </>
    );
};

export default ReviewDetails;
