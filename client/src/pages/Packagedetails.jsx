import ImageGalleryGrid from '../components/ImageGalleryGrid';
import FullScreenGallery from '../components/FullScreenGallery'; 
import MapLocationPreview from '../components/MapLocationPreview';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import "quill/dist/quill.snow.css";
import "highlight.js/styles/github.css";
import "../individualCSS/Packages/packagesdetails.css";
import "../individualCSS/Packages/Common-dynamic-blocks.css";
import "../pages/admin/ckeditorcastom.css";
import "../individualCSS/Discover/discoverplace-gallery.css";
import Mobailenav from "../components/Mobailenav";
// import Discoverinner from '../components/Discoverinner';
import { Helmet } from 'react-helmet-async';
import "./admin/quill_castom_common.css";
import DiscoverArticle from "./discoverarticle";
import GroupTourList from '../components/GroupTourList';
import Packageslistcolumnlist from '../components/Packageslistcolumnlist';
import BlogListcolumnlist from '../components/BlogListcolumnlist';
import LandingFooter from '../components/LandingFooter';

const THEME_OPTIONS = [
  { value: "theme1", label: "White", color: "#ffffff" },
  { value: "theme2", label: "Transparent", color: "transparent" },
  // --- Dark Blue / Indigo ---
  { value: "theme21", label: "dark Blue", color: "#112c77" },
  { value: "theme22", label: "deep Blue", color: "#0b2f82" },
  { value: "theme3", label: "dark indigo", color: "#252565" },
  { value: "theme4", label: "dark slate blue", color: "#1F305E" },
  { value: "theme5", label: "navy indigo", color: "#1B1B4B" },
  { value: "theme6", label: "deep purple-blue", color: "#2A1A5E" },

  // --- Purple / Eggplant ---
  { value: "theme7", label: "dark purple", color: "#562B6E" },
  { value: "theme8", label: "deep eggplant", color: "#42275A" },
  { value: "theme9", label: "vibrant purple", color: "#8338EC" },

  // --- Teal / Green ---
  { value: "theme10", label: "dark cyan", color: "#1A535C" },
  { value: "theme11", label: "dark olive green", color: "#3E4C3C" },
  { value: "theme12", label: "Light Green", color: "#007bff" },

  // --- Brown / Neutral / Gray ---
  { value: "theme13", label: "dark brown", color: "#4A3F35" },
  { value: "theme14", label: "charcoal", color: "#3B3B3B" },
  { value: "theme15", label: "dark desaturated", color: "#2d4d4d" },

  // --- Red / Orange ---
  { value: "theme16", label: "crimson red.", color: "#E71D36" },
  { value: "theme17", label: "vivid orange-red", color: "#FF3700" },

  // --- Light / Pastel ---
  { value: "theme18", label: "light pastel green", color: "#bffcc4" },
  { value: "theme19", label: "pale cream", color: "#fcecbf" },
  { value: "theme20", label: "pale sky blue", color: "#e0f0ff" },
  

  // --- Gradients ---
  { value: "theme23", label: "Gradient 1", color: "linear-gradient(135deg, #BFFCC4, #88E0A1)" },
  { value: "theme24", label: "Gradient 2", color: "linear-gradient(135deg, #FCECBF, #FADFA0)" },
  { value: "theme25", label: "Gradient 3", color: "linear-gradient(135deg, #E0F0FF, #B8DFFF)" },
  { value: "theme26", label: "Gradient 4", color: "linear-gradient(135deg, #457B9D, #1A535C)" },
  { value: "theme27", label: "Gradient 6", color: "linear-gradient(135deg, #3E4C3C, #1A535C)" },
  { value: "theme28", label: "Gradient 7", color: "linear-gradient(135deg, #3B3B3B, #2C2C2C)" },
  { value: "theme29", label: "Gradient 8", color: "linear-gradient(135deg, #1F305E, #252565)" },
  { value: "theme30", label: "Gradient 9", color: "linear-gradient(135deg, #1B1B4B, #2A1A5E)" },
  { value: "theme31", label: "Gradient 5", color: "linear-gradient(135deg, #42275A, #562B6E)" },
  { value: "theme32", label: "Gradient 10", color: "linear-gradient(135deg, #E71D36, #833844)" },
  { value: "theme33", label: "Gradient 11", color: "linear-gradient(135deg, #562B6E, #8338EC)" },
  { value: "theme34", label: "Gradient 12", color: "linear-gradient(135deg, #1A535C, #205072)" },
  { value: "theme35", label: "Gradient 13", color: "linear-gradient(135deg, #252565, #42275A)" },
];

const getThemeColor = (themeValue) => {
  return THEME_OPTIONS.find((t) => t.value === themeValue)?.color || "transparent";
};

const extractTitleFromHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  const heading = tmp.querySelector('h1, h2, h3, h4, strong, b');
  if (heading && heading.textContent) return heading.textContent.trim();
  const text = tmp.textContent?.trim().split('\n')[0] || '';
  return text.length > 40 ? text.slice(0, 37) + '...' : text;
};

const Packagedetails = () => {
  const navigate = useNavigate();
  const { placename } = useParams();
  const { axios } = useAppContext();

  // Packagedetails.jsx er moddhe top-level
const [openFAQIndex, setOpenFAQIndex] = useState(null);

const toggleFAQ = (index) => {
  setOpenFAQIndex(openFAQIndex === index ? null : index);
};

  const [data, setData] = useState(null);

  // =================================

  const [galleryPhotos, setGalleryPhotos] = useState([]);

  // Lightbox state
  const [lightboxIsOpen, setLightboxIsOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);
  const [allLightboxImages, setAllLightboxImages] = useState([]);

  // Function to open the lightbox
  const openLightbox = (startIndex) => {
    setLightboxStartIndex(startIndex);
    setLightboxIsOpen(true);
  };

  // Function to close the lightbox
  const closeLightbox = () => {
    setLightboxIsOpen(false);
  };

  // Effect to gather all images for the lightbox
  useEffect(() => {
    if (data) {
      // 1. Get main image (thumbnail)
      const mainImage = data.image ? [{ src: data.image, alt: "" }] : [];

      // 2. Get gallery images
      const galleryImages = data.galleryImages ? data.galleryImages.map(img => ({ src: img.url, alt: img.alt })) : [];

      // 3. Get images from description (dynamic content), excluding block-type-2
      const descriptionEl = document.createElement('div');
      descriptionEl.innerHTML = data.description;
      const allDescImgs = Array.from(descriptionEl.querySelectorAll('img'));
      const block2Imgs = Array.from(descriptionEl.querySelectorAll('.block-type-2 img'));
      const block2ImgSrcs = block2Imgs.map(img => img.src);
      const descriptionGalleryImages = allDescImgs
          .filter(img => !block2ImgSrcs.includes(img.src))
          .map(img => ({ src: img.src, alt: img.alt }));

      // 4. Get summary table images
      const summaryImages = [];
      if (data.summaryTable) {
          if (data.summaryTable.image1) {
              summaryImages.push({ src: data.summaryTable.image1, alt: data.summaryTable.alt1 });
          }
          if (data.summaryTable.image2) {
              summaryImages.push({ src: data.summaryTable.image2, alt: data.summaryTable.alt2 });
          }
      }

      // 5. Get dynamic block images (excluding type 2)
      const dynamicBlockImages = (data.dynamicBlocks || [])
        .filter(block => block.type !== 'image-text-theme' && block.image)
        .map(block => ({ src: block.image, alt: block.alt }));

      // 6. Combine all images
      const combinedImages = [
          ...mainImage,
          ...galleryImages,
          ...descriptionGalleryImages,
          ...summaryImages,
          ...dynamicBlockImages
      ];

      // 7. Get unique images
      const uniqueImages = combinedImages.filter((img, index, self) =>
          img.src && index === self.findIndex((t) => t.src === img.src)
      );

      const processImages = async () => {
        const photos = await Promise.all(
            uniqueImages.map(async (image) => {
                const img = new Image();
                img.src = image.src;
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                }).catch(() => {});
                return {
                    src: image.src,
                    width: img.naturalWidth || 1,
                    height: img.naturalHeight || 1,
                    alt: image.alt,
                };
            })
        );
        setAllLightboxImages(photos.filter(p => p.width > 1));
    };
    processImages();
    }
  }, [data]);

  // Process images for react-photo-gallery
  useEffect(() => {
    if (data && Array.isArray(data.galleryImages)) {
      const processImages = async () => {
        const photos = await Promise.all(
          data.galleryImages.map(async (image) => {
            const img = new Image();
            img.src = image.url;
            await new Promise((resolve) => {
              img.onload = resolve;
            });
            return {
              src: image.url,
              width: img.width,
              height: img.height,
              alt: image.alt,
            };
          })
        );
        setGalleryPhotos(photos);
      };
      processImages();
    }
  }, [data]);

  // Effect to handle clicks on dynamic content images
  useEffect(() => {
    const contentDiv = document.getElementById('leftColumn');
    if (contentDiv) {
        const handleClick = (e) => {
            if (e.target.tagName === 'IMG') {
                const clickedSrc = e.target.src;
                // Exclude block-type-2 images
                if (e.target.closest('.block-type-2')) {
                    return;
                }
                const index = allLightboxImages.findIndex(img => img.src === clickedSrc);
                if (index !== -1) {
                    openLightbox(index);
                }
            }
        };
        contentDiv.addEventListener('click', handleClick);
        return () => contentDiv.removeEventListener('click', handleClick);
    }
}, [allLightboxImages]);

 const calculateDiscount = (oldPrice, latestPrice) => {
  if (!oldPrice || !latestPrice || oldPrice <= latestPrice) {
    return null;
  }
  const discount = ((oldPrice - latestPrice) / oldPrice) * 100;
  return Math.round(discount);
};

  // Fetch data
  useEffect(() => {
    const fetchDiscoverplace = async () => {
      try {
        const res = await axios.get(`/addpackages/by-placename/${decodeURIComponent(placename)}`);
        if (res.data?.packages?.place) setData(res.data.packages);
        else toast.error(res.data.message || "Discover place not found");
      } catch {
        toast.error("Failed to load package details");
      }
    };
    if (placename) fetchDiscoverplace();
  }, [placename, axios]);

  const renderDynamicBlock = (block, index) => {
    let typeClass = "";
    if (block.type === "image-text") {
      typeClass = "all-common-block-type-1";
    } else if (block.type === "image-text-theme") {
      typeClass = "all-common-block-type-2";
    } else if (block.type === "text-theme") {
      typeClass = "all-common-block-type-3";
    }

    const dataTitle = 
      block.subtitle || 
      (block.content ? extractTitleFromHtml(block.content) : block.idName) || 
      block.idName;

    const isClickable = block.type !== 'image-text-theme' && block.image;

    return (

      <>
      <div 
        key={index} 
        className={`all-common-dynamic-block-outer ${typeClass}`}
        id={block.idName || undefined}
        data-title={dataTitle}
      >

      <div className='all-common-dynamic-block-subtitle-top-div'>
        {block.subtitle && (
          <h3 className="all-common-dynamic-block-subtitle-top">{block.subtitle}</h3>
        )}
      </div>
      <div 
        className={`all-common-dynamic-block ${typeClass}`}
        id={block.idName || undefined}
        data-title={dataTitle}
        // style={{ '--block-theme-color': getThemeColor(block.theme) }}
        style={{ background: getThemeColor(block.theme) }}

      >
        
        {block.image && (
          <>
            <img 
              src={block.image}
              alt={block.alt || `block-img-${index}`}
              className="all-common-dynamic-block-image"
              onClick={() => isClickable && openLightbox(allLightboxImages.findIndex(img => img.src === block.image))}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            />
            {/* <div style={{display:'flex',justifyContent:'center',zIndex:'90999',position:'relative' }}>{block.alt && <p className="blog-image-alt-tex">{block.alt}</p>}</div> */}
             {block.type === "image-text" && block.alt && (
             <p style={{textAlign:"center",fontSize:'13px',fontFamily:"inter", marginBottom:'1rem',padding:'0 2rem'}} >{block.alt}</p>
              )}
          </>         
        )}
        <div className='package-small-screen-dynamic-block-div'>
        <div className='all-common-dynamic-block-subtitle-bottom-div'>
          {block.subtitle && (
          <h3 className="all-common-dynamic-block-subtitle-bottom">{block.subtitle}</h3>
        )}
        </div>
        {block.content && (
          <div 
            className="all-common-dynamic-block-content"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        )}
        </div>

      </div>
      </div>
      </>
    );
  };

  if (!data) return <Loader />; 

const oldPrice = data?.summaryTable?.oldPrice;
const latestPrice = data?.summaryTable?.latestPrice;

const discountPercentage = calculateDiscount(oldPrice, latestPrice);

  return (
    <div className="discoverplace-container">
      <Helmet>
        <title>{data?.seotitle || data?.place}</title>
        <meta name="description" content={data?.seodescription} />
        <meta name="keywords" content={data?.seokeywords} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      {lightboxIsOpen && (
        <FullScreenGallery
          images={allLightboxImages}
          startIndex={lightboxStartIndex}
          onClose={closeLightbox}
        />
      )}
      <div id="top" className="place-ditails-nave">
        <Mobailenav />
        <div className="common-caption-discoverplace-div">
          <h1 className="common-caption-discoverplace">
            Smart guidance, memorable tours — your travel, our care
          </h1>
        </div>
      </div>

      {/* <h3 className="discoverplace-subtitle">{data.subTitle}</h3> */}

      <div className="discoverplace-content-page">

        {/* ONLY LEFT COLUMN CONTENT */}
        <div className="discoverplace-content-locked-div" id="leftColumn">
          <div className="discoverplace-thumbnail-div">
            <div className="thumbnail-image-container">
              <img
                className="package-thumbnail-image"
                src={data.image}
                alt={data.place || data.imageAlt || 'Package main image'}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const index = allLightboxImages.findIndex(img => img.src === data.image);
                  if (index !== -1) openLightbox(index);
                }}
              />
              <div className="thumbnail-overlay-content">
                {/* <div className="top-info">
                  <div className="top-left-info">
                    {data.duration && data.duration.value && (
                      <div className="duration-badge">
                        <i className="fa-regular fa-clock"></i> {data.duration.value} {data.duration.unit}
                      </div>
                    )}
                    {data.rating > 0 && (
                      <div className="rating-badge">
                        <i className="fa-solid fa-star"></i> {data.rating}.0
                      </div>
                    )}
                  </div>
                  <div className="bottom-right-info">
                    <div className="price-badge">
                      <span className="price-from">From</span>
                      <span className="latest-price">${data.latestPrice}</span>
                      {data.oldPrice && <span className="old-price">${data.oldPrice}</span>}
                    </div>
                  </div>
                </div> */}
                <div className="bottom-left-info">
                  <h1 className="package-title">{data.place}</h1>
                  <h2 className="package-subtitle">{data.subTitle}</h2>
                  <div className='bordar__info__packages'></div>

                  <div className="top-left-info">
                    {data.duration && data.duration.value && (
                      <div className="duration-badge">
                        <i style={{ color: '#3498db'}} className="fa-regular fa-clock"></i> 
                           {data.duration.value}  {data.duration.unit.toUpperCase()}{data.duration.value > 1 ? 'S' : ''}
                      </div>
                    )}
                    <div className="price-badge">
                      <span className="latest-price"><i style={{ color: '#2ecc71', transform: 'rotate(135deg)',marginRight:'3px' }}  class="fa-solid fa-money-check-dollar"></i> ${data.latestPrice}* US</span>
                      {data.oldPrice && <span className="old-price">${data.oldPrice}</span>}
                    </div>
                    {data.rating > 0 && (
                      <div className="rating-badge">
                        <i style={{ color: '#ffc107'}} className="fa-solid fa-star"></i> {data.rating}.0
                      </div>
                    )}
                    
                  </div>
        
                </div>
                  
              </div>
            </div>
            {/* {discountPercentage && (
              <div>
                <div className="package-card-discount-badge"> 
                  <span> <span className='Flat-discount'>FLAT</span> <br /> <span style={{fontSize:'2.2rem',fontWeight:'800',lineHeight:'1'}}>{discountPercentage}<span  style={{fontSize:'2.2rem',fontWeight:'700',fontFamily:'Poppins'}}>%</span></span> <br /> <span className='offer-text-off'>OFF</span></span> 
                </div>
                <div className='package-card-discount-badge-shadow'></div>
                <div className='offer-badge-one-div'>
                  <div className='offer-badge-one-span'> SPECIAL OFFER</div>
                  <div className='offer-badge-one'>BIG SAVE</div>
                </div>
              </div>
            )} */}



<section className='package-content-section-row-col'>
<article className='package-content-article-section'>

  <div style={{position:"relative"}}>
{/* 1st Image */}
  {data.summaryTable.image1 && (
    <>
      <img
        src={data.summaryTable.image1}
        alt={data.summaryTable.alt1 || data.summaryTable.headerTitle || 'Summary Image 1'}
         style={{ width:'100%',height:"100px",objectFit:'cover'}}
        onClick={() => {
          const index = allLightboxImages.findIndex(img => img.src === data.summaryTable.image1);
          if (index !== -1) openLightbox(index);
        }}
      />
      {/* {data.summaryTable.alt1 && <p className="image-alt-text">{data.summaryTable.alt1}</p>} */}
    </>
  )}
  <div className='Overlare-p-sum-sec'>
     <h2 className='Overlare-p-sum-sec-h1'> {data.place}</h2>
      <h5 style={{ margin:"0",color:"#fff",fontSize:"14px",fontFamily:'inter',textAlign:"center",fontWeight:'400',fontStyle:'italic'}}>A Comprehensive Overview. </h5>
  </div>
  </div>
<div style={{display:'flex',justifyContent:'center',marginTop:'20px'}}> 
  
          <div className="table-package-introduction">
  
{/* 1st Image */}
  {/* {data.summaryTable.image1 && (
    <>
      <img
        src={data.summaryTable.image1}
        alt={data.summaryTable.alt1 || data.summaryTable.headerTitle || 'Summary Image 1'}
        className="summary-image left-image"
        onClick={() => {
          const index = allLightboxImages.findIndex(img => img.src === data.summaryTable.image1);
          if (index !== -1) openLightbox(index);
        }}
      />
      
    </>
  )} */}
  {/* Center Section */}
  <section className="packages-summary-section">
    {data.summaryTable.cqeditorTable && (
      <div
        className="ck-summary-package-content  discoverplace-summary-cqeditor"
        dangerouslySetInnerHTML={{ __html: data.summaryTable.cqeditorTable }}
      />
    )}

<div className='p-sec-sum-bo-pr-ca'>
     <div style={{alignItems:'center'}} className="package-card-price">
  <span style={{alignItems:'center',marginBottom:'2px',fontWeight:'600',marginRight:'5px'}}>
    <span style={{color:'#2c5282',fontSize:'14px',fontWeight:'700'}}>
      Price:  </span> 
    <span style={{color:'#222',fontSize:'14px',fontWeight:'500'}}>From</span> 
  </span>

  <span className="package-card-latest-price-inner" style={{ color: oldPrice && oldPrice > latestPrice ? 'green' : '#2b8dca' }}>
    ${data.latestPrice}* US</span>
                      {data.oldPrice && <span className="old-price-table"> <span style={{textDecoration:'line-through'}}>${data.oldPrice}</span><span style={{textDecoration:'none'}}>* US</span></span>}
  
   
  <span style={{color:'#333',fontSize:'0.8rem',marginLeft:'7px',fontWeight:'500'}}>per person</span>
</div>

                        <Link to={`/booking/${encodeURIComponent(placename)}`} className="booking-button-link">
              <button>Booking</button>
            </Link>
  </div>
  
  </section>

  

  {/* Right Image */}
  {/* {data.summaryTable.image2 && (
    <>
      <img
        src={data.summaryTable.image2}
        alt={data.summaryTable.alt2 || data.summaryTable.locationTitle || 'Summary Image 2'}
        className="summary-image right-image"
        onClick={() => {
          const index = allLightboxImages.findIndex(img => img.src === data.summaryTable.image2);
          if (index !== -1) openLightbox(index);
        }}
      />
      {data.summaryTable.alt2 && <p className="image-alt-text">{data.summaryTable.alt2}</p>}
    </>
  )} */}
</div>

</div>


            <div
              className="ql_editor_common packages___description"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
  

          {data.locations && data.locations.length > 0 && (
  <MapLocationPreview locations={data.locations} />
)}


          <div className="ql_editor_common discoverplace-dynamic-blocks">
            {data.dynamicBlocks?.length > 0 &&
              data.dynamicBlocks.map((block, idx) => renderDynamicBlock(block, idx))}
          </div>
            
            
          {galleryPhotos.length > 0 && (
            <ImageGalleryGrid
                images={galleryPhotos}
                onImageClickWithIndex={(index) => {
                    const clickedImageSrc = galleryPhotos[index].src;
                    const mainIndex = allLightboxImages.findIndex(img => img.src === clickedImageSrc);
                    if (mainIndex !== -1) {
                        openLightbox(mainIndex);
                    }
                }}
            />
          )}

        {/* ✅ FAQ Section */}
{data.faqTitle && data.faqs && data.faqs.length > 0 && (
  <div className="package-faq-section">
    <h3 className="faq-title">{data.faqTitle}</h3>
    <div className="faq-accordion">
      {data.faqs.map((item, index) => (
        <div
          key={index}
          className={`faq-item ${openFAQIndex === index ? 'active' : ''}`}
        >
          <button
            className="faq-question"
            onClick={() => toggleFAQ(index)}
          >
            <span>
              {/* <span style={{fontWeight:'600'}}>Q:</span>  */}
              {item.question}</span>
            <i style={{fontSize:'12px'}}
              className={`fa-solid ${
                openFAQIndex === index ? 'fa-chevron-up' : 'fa-chevron-down'
              }`}
            ></i>
          </button>
          <div
            className="faq-answer"
            style={{
              maxHeight: openFAQIndex === index ? '200px' : '0',
            }}
          >
            <p>
              {/* <span style={{fontWeight:'600'}}>A: </span> */}
             {item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
</article>


<div className='right-side-package-col'>
  <div><GroupTourList/></div>
   <div><DiscoverArticle/></div>
</div>

</section>
</div>



          <div style={{marginTop:'2rem'}} className="privious-content">
            
            {/* <div>
             <Discoverinner/>
            </div> */}
              <div>
                <Packageslistcolumnlist/>
              </div>
              <div>
                <BlogListcolumnlist/>
              </div>

             </div>
          
        </div>
      </div>
              <LandingFooter/>
    </div>
  );
};

export default Packagedetails;
