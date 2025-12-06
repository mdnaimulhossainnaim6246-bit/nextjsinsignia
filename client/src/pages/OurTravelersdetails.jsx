import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import Mobailenav from "../components/Mobailenav";
import LandingFooter from "../components/LandingFooter";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
// Removed: import 'swiper/css/pagination';

// import required modules
import { EffectCoverflow, Autoplay } from 'swiper/modules'; // Removed Pagination
import GroupTourList from "../components/GroupTourList";
import DiscoverArticle from "./discoverarticle";
import Packageslistcolumnlist from "../components/Packageslistcolumnlist";
import BlogListcolumnlist from "../components/BlogListcolumnlist";

const OurTravelersdetails = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const [ourTravelerData, setOurTravelerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [swiperInstance, setSwiperInstance] = useState(null); // Added for click functionality

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/addourtravelers/${id}`);
        if (res.data.success) {
          setOurTravelerData(res.data.ourTraveler);
          if (res.data.ourTraveler.images && res.data.ourTraveler.images.length > 0) {
            setActiveImage(res.data.ourTraveler.images[0]);
          }
        } else {
          toast.error("Failed to load member details");
        }
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id, axios]);

  const styles = {
    page: {
      backgroundColor: '#ffffff',
      fontFamily: `"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
      minHeight:'100vh'
    },
    heroContainer: {
      position: 'relative',
      textAlign: 'center',
      width: '100%',
      height: '55vh', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 2,
    },
    heroText: {
      position: 'relative',
      zIndex: 3,
      color: 'white',
      padding: '36vh 2rem 2rem 2rem',
      marginBottom:'0rem',

    },
    title: {
      fontSize: 'clamp(2.5rem, 10vw, 4rem)',
      fontWeight: '900',
      color: '#ffffff',
      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6)',
      marginTop:'40px'
      
    },
    subtitle: {
      fontSize: 'clamp(1.1rem, 4vw, 1.2rem)', 
      fontWeight: '400',
      color: '#fff',
      textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)',
      margin: '0 0 1rem 0',
      fontStyle: 'italic', 
      opacity: 0.9,
    },
    contentContainer: {
      maxWidth: '1200px',
      margin: '5.3rem auto 0 auto',
      // padding: '2rem 1.3rem 0rem 1.3rem',
      position:'relative'
      
    },
    description: {
      lineHeight: 1.7,
      color: '#495057',
      fontSize: '1rem',
      borderLeft: '4px solid #4a90bd',
      paddingLeft: '1.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '0 8px 8px 0',
      margin: '1rem 0 1rem 0',
      position: 'relative',
    },
    profileChoose: {
      lineHeight: 1.7,
      color: '#495057',
      fontSize: '1.1rem',
      // borderLeft: '4px solid #007bff',
      paddingLeft: '1.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '0 8px 8px 0',
      margin: '2rem 0',
    },
    socialMediaContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      margin: '1rem 0',
      flexWrap:'wrap',
    },
    socialMediaLink: {
      fontSize: '2rem',
      color: '#fff',
      display:'flex',
      alignItems:'center'
      
    },
    imagesContainer: {
      padding: '2rem 1.3rem',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '8px',
    },
    noMember: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#6c757d',
      padding: '4rem 0',
    },
  };

  if (loading) return <Loader />;
  if (!ourTravelerData) return <div style={styles.noMember}>travelers not found</div>;

  return (
    <>
    <style>{`
        .swiper-container-custom {
          width: 100%;
          padding-top: 20px;
          padding-bottom: 50px;
        }

        .swiper-slide-custom {
          background-position: center;
          background-size: cover;
          width: 350px !important;
          height: 180px;
          transition: transform 0.5s;
        }

        .swiper-slide-custom img {
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
            height: 400px; /* Adjust as needed */
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
        
         .travelers-grid-extra {
          display: grid;
          grid-template-columns: repeat(2, 1fr); 
          gap: 30px; 
          padding:1.3rem;
          margin:0 auto;
          max-width:1050px;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          .travelers-grid-extra {
            grid-template-columns: 1fr; 
          }
        }
        
        
        @media (max-width:650px){
          .swiper-slide-custom {
          background-position: center;
          background-size: cover;
          width: 280px !important;
          height: 150px;
          transition: transform 0.5s;
        }
          .preview-image-container {
            width: 100%;
            height: 300px; /* Adjust as needed */
            margin-bottom: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        }
        @media (max-width:480px){
          .swiper-slide-custom {
          background-position: center;
          background-size: cover;
          width: 200px !important;
          height: 120px;
          transition: transform 0.5s;
        }
          .preview-image-container {
            width: 100%;
            height: 280px; /* Adjust as needed */
            margin-bottom: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
          
        }
    `}</style>
    <div style={styles.page}>
      <Helmet>
        <title>{ourTravelerData.seotitle || ourTravelerData.title}</title>
        <meta name="description" content={ourTravelerData.seodescription || ourTravelerData.subTitle} />
        <meta name="keywords" content={ourTravelerData.seokeywords || ourTravelerData.title} />
      </Helmet>
      <header id="hero-container" >
        <nav><Mobailenav/></nav>

        <div style={styles.heroContainer}> 
           
        <img style={styles.heroImage} src={ourTravelerData.image} alt={ourTravelerData.title} />
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroText}>
          <h1 style={styles.title}>{ourTravelerData.title}</h1>            
          
          {ourTravelerData.subTitle && <h2 style={styles.subtitle}>{ourTravelerData.subTitle}</h2>}
          
          {ourTravelerData.profileChoose && <img style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto', display: 'block',position:'relative',top:'0px',border:'4px solid #fff' }} src={ourTravelerData.profileChoose} alt={ourTravelerData.title} />}
        </div>
        </div>
      </header>

      <main style={styles.contentContainer}>
        <div style={{padding:'2rem 1.3rem 0 1.3rem'}}>
        {ourTravelerData.socialMedia && (
          <div style={styles.socialMediaContainer}>

            {ourTravelerData.socialMedia.instagram && < div style={{display:'flex',alignItems:'center',flexDirection:'column',}} > <span><a  href={ourTravelerData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" style={styles.socialMediaLink}><i className="fab fa-instagram"style={{background:"linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", transition: "0.2s ease" }} onMouseEnter={(e) => { e.target.style.background = "linear-gradient(45deg, #ffb366 0%, #ff7a59 25%, #ff4766 50%, #f03b7e 75%, #d929a3 100%)"; e.target.style.WebkitBackgroundClip = "text"; e.target.style.WebkitTextFillColor = "transparent";}}  onMouseLeave={(e) => { e.target.style.background =      "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"; e.target.style.WebkitBackgroundClip = "text";     e.target.style.WebkitTextFillColor = "transparent";   }}></i></a></span> <p style={{fontSize:'15px',display:'flex',color:'#777'}}> See reco on <a  href={ourTravelerData.socialMedia.instagram} target="_blank"rel="noopener noreferrer" style={styles.socialMediaLink}><span style={{fontSize:'15px',paddingLeft:'5px',color:'#ff8562'}}>Instagram</span></a></p> </div>}

            {ourTravelerData.socialMedia.facebook && < div style={{display:'flex',alignItems:'center',flexDirection:'column'}} > <span><a  href={ourTravelerData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" style={styles.socialMediaLink}><i style={{color: "#1877F2"}} onMouseEnter={(e) => (e.target.style.color = "#3b8bff")} onMouseLeave={(e) => (e.target.style.color = "#1877F2")} className="fab fa-facebook"></i></a></span> <p style={{fontSize:'15px',display:'flex',color:'#777'}}> See reco on <a  href={ourTravelerData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" style={styles.socialMediaLink}><span style={{fontSize:'15px',paddingLeft:'5px',color:'#ff8562'}}>facebook</span></a></p> </div>}

            {ourTravelerData.socialMedia.linkedin && < div style={{display:'flex',alignItems:'center',flexDirection:'column'}} > <span><a  href={ourTravelerData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" style={styles.socialMediaLink}><i className="fa-brands fa-linkedin" style={{    color: "#0A66C2",  transition: "0.2s ease" }} onMouseEnter={(e) => (e.target.style.color = "#0c7ee6")}  onMouseLeave={(e) => (e.target.style.color = "#0A66C2")}/></a></span> <p style={{fontSize:'15px',display:'flex',color:'#777'}}> See reco on <a href={ourTravelerData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" style={styles.socialMediaLink}><span style={{fontSize:'15px',paddingLeft:'5px',color:'#ff8562'}}>Linkedin</span></a></p> </div>}

            {ourTravelerData.socialMedia.youtube && < div style={{display:'flex',alignItems:'center',flexDirection:'column'}} > <span><a  href={ourTravelerData.socialMedia.youtube} target="_blank" rel="noopener noreferrer" style={styles.socialMediaLink}><i className="fa-brands fa-youtube" style={{ color: "#FF0000", transition: "0.2s ease"}} onMouseEnter={(e) => (e.target.style.color = "#ff4d4d")} onMouseLeave={(e) => (e.target.style.color = "#FF0000")} ></i></a></span> <p style={{fontSize:'15px',display:'flex',color:'#777'}}> Watch on <a href={ourTravelerData.socialMedia.youtube} target="_blank" rel="noopener noreferrer" style={styles.socialMediaLink}><span style={{fontSize:'15px',paddingLeft:'5px',color:'#ff8562'}}>Youtube</span></a></p> </div>}

            {ourTravelerData.socialMedia.x && < div style={{display:'flex',alignItems:'center',flexDirection:'column'}} > <span><a  href={ourTravelerData.socialMedia.x} target="_blank" rel="noopener noreferrer" style={styles.socialMediaLink}><i className="fa-brands fa-x-twitter"  style={{ color: "#fff",   transition: "0.2s ease"  }}  onMouseEnter={(e) => (e.target.style.color = "#1DA1F2")}   onMouseLeave={(e) => (e.target.style.color = "#fff")}></i></a></span> <p style={{fontSize:'15px',display:'flex',color:'#777'}}> See reco on <a href={ourTravelerData.socialMedia.x} target="_blank" rel="noopener noreferrer" style={styles.socialMediaLink}><span style={{fontSize:'15px',paddingLeft:'5px',color:'#ff8562'}}>X-Twitter</span></a></p> </div>}

          </div>
         )}
        <div style={styles.description} dangerouslySetInnerHTML={{ __html: ourTravelerData.description }}></div>

        {/* {ourTravelerData.images && ourTravelerData.images.length > 0 && (
          <div style={styles.imagesContainer}>
            {activeImage && (
                <div className="preview-image-container">
                    <img src={activeImage} alt="Active traveler" />
                </div>
            )}
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
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                // Removed: pagination={true} // Removed pagination
                modules={[EffectCoverflow, Autoplay]} // Removed Pagination module
                className="swiper-container-custom"
                onSlideChange={(swiper) => {
                    const activeIndex = swiper.realIndex;
                    setActiveImage(ourTravelerData.images[activeIndex]);
                }}
            >
              {ourTravelerData.images.map((image, index) => (
                <SwiperSlide 
                  key={index} 
                  className="swiper-slide-custom"
                  onClick={() => {
                    if (swiperInstance) {
                      swiperInstance.slideToLoop(index);
                    }
                  }}
                >
                  <img src={image} alt={`Traveler image ${index + 1}`} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )} */}
        </div>

        {ourTravelerData.images && ourTravelerData.images.length > 0 && (
  <div className="imagesContainer-travlers" style={styles.imagesContainer}>
    {activeImage && (
      <div className="preview-image-container">
        <img
          src={activeImage}
          alt="Active traveler"
          style={{ transition: 'transform 0.6s ease', transformStyle: 'preserve-3d' }}
        />
      </div>
    )}
   
    <div style={{ position: 'relative',maxWidth:"1024px",margin:'0 auto' }}>
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
          // Ensure big image always matches the displayed slide
          const realIndex = swiper.realIndex % ourTravelerData.images.length;
          setActiveImage(ourTravelerData.images[realIndex]);
        }}
      >
        {ourTravelerData.images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="swiper-slide-custom"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (swiperInstance) swiperInstance.slideToLoop(index); // move clicked slide to center
            }}
          >
            <img src={image} alt={`Traveler image ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Previous / Next buttons */}
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

<div className="travelers-grid-extra">
  <div style={{maxWidth:'580px',margin:'0 auto'}}><GroupTourList/></div>
  <div style={{maxWidth:'580px',margin:'0 auto'}}><DiscoverArticle/></div>
</div>

      </main>
      <section>
          <BlogListcolumnlist/>
          <Packageslistcolumnlist/>
        </section>
      <footer><LandingFooter/></footer>
    </div>
    </>
  );
};

export default OurTravelersdetails;