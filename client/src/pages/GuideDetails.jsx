import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import "./BlogDetails.css"; 
import "../pages/admin/QuillEditor.css";
import Mobailenav from "../components/Mobailenav";
import LandingFooter from "../components/LandingFooter";
import FullScreenGallery from '../components/FullScreenGallery';
import ImageGalleryGrid from '../components/ImageGalleryGrid';
import "../individualCSS/Packages/Common-dynamic-blocks.css";
import Loader from "../components/Loader";
import "./admin/quill_castom_common.css";
import { Helmet } from "react-helmet-async";
import GroupTourList from "../components/GroupTourList";
import DiscoverArticle from "./discoverarticle";
import "../individualCSS/Guide.css"; 
import BlogListcolumnlist from "../components/BlogListcolumnlist";
// import Packageslist from "components/Packageslist";
import Packageslistcolumnlist from "../components/Packageslistcolumnlist";

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

const getThemeColor = (themeValue) => THEME_OPTIONS.find((t) => t.value === themeValue)?.color || "transparent";
const extractTitleFromHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';
  const heading = tmp.querySelector('h1, h2, h3, h4, strong, b');
  if (heading && heading.textContent) return heading.textContent.trim();
  const text = tmp.textContent?.trim().split('\n')[0] || '';
  return text.length > 40 ? text.slice(0, 37) + '...' : text;
};

const GuideDetails = () => {
  const { title } = useParams();
  const { axios } = useAppContext();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState([]);
  const [showFullScreenGallery, setShowFullScreenGallery] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const fetchGuideDetails = async () => {
      if (!title) return;
      setLoading(true);
      try {
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
        const res = await axios.get(`/addguide/slug/${slug}`);
        
        if (res.data?.success) {
          const guideData = res.data.guide;
          setGuide(guideData);

          const mainImage = guideData.image ? [{ src: guideData.image, alt: guideData.title }] : [];
          const gallery1 = guideData.imageGallery ? guideData.imageGallery.map(img => ({ src: img.url, alt: img.alt })) : [];
          const gallery2 = guideData.imageUrls ? guideData.imageUrls.map(img => ({ src: img.url, alt: img.alt })) : [];
          const dynamicBlockImages = (guideData.dynamicContent || [])
            .filter(block => block.type !== 'image-text-theme' && block.image)
            .map(block => ({ src: block.image, alt: block.alt }));

          const combined = [...mainImage, ...gallery1, ...gallery2, ...dynamicBlockImages];
          const uniqueImages = combined.filter((img, index, self) =>
            img.src && index === self.findIndex((t) => t.src === img.src)
          );
          setGalleryImages(uniqueImages);

        } else {
          toast.error(res.data.message || "Guide not found");
        }
      } catch (err) {
        toast.error("Failed to load guide details");
      } finally {
        setLoading(false);
      }
    };

    fetchGuideDetails();
  }, [title, axios]);

  const openFullScreenGallery = (index) => {
    setStartIndex(index);
    setShowFullScreenGallery(true);
  };

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
        // style={{ '--block-theme-color': getThemeColor(block.theme) }}
        

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
        style={{ background: getThemeColor(block.theme) }}
      >
        
        {block.image && (
          <>
            <img 
              src={block.image}
              alt={block.alt || `block-img-${index}`}
              className="all-common-dynamic-block-image"
              onClick={() => isClickable && openFullScreenGallery(galleryImages.findIndex(img => img.src === block.image))}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            />
             
             {block.type === "image-text" && block.alt && (
             <p style={{textAlign:"center",fontSize:'13px',fontFamily:"inter", marginBottom:'1rem',padding:'0 2rem'}} >{block.alt}</p>
              )}
            {/* <div style={{display:'flex',justifyContent:'center',zIndex:'90999',position:'relative' }}>{block.alt && <p className="blog-image-alt-tex">{block.alt}</p>}</div> */}
           
          </>         
        )}
        <div className='package-small-screen-dynamic-block-div'>
        <div className='all-common-dynamic-block-subtitle-bottom-div'>
          {block.subtitle && (
          <h3 className="all-common-dynamic-block-subtitle-bottom">{block.subtitle}</h3>
        )}
        </div>
        {block.description && (
          <div 
            className="all-common-dynamic-block-content"
            dangerouslySetInnerHTML={{ __html: block.description }}
          />
        )}
         {block.content && (
          <div 
            className="all-common-dynamic-block-content-2"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        )}
        </div>

      </div>
      </div>
      </>
    );
  };

  if (loading) return <Loader />;
  if (!guide) return <div style={{textAlign: 'center', padding: '4rem'}}>Guide not found.</div>;

  const imagesForGrid = [...(guide.imageGallery || []), ...(guide.imageUrls || [])];

  return (
    <> 
      <header>
        <Helmet>
          <title>{guide.seotitle || guide.title}</title>
          <meta name="description" content={guide.seodescription || guide.subTitle} />
          <meta name="keywords" content={guide.seokeywords || guide.title} />
          <link rel="canonical" href={window.location.href} />
        </Helmet>
        <div style={{maxWidth:"1500px",minWidth:"100%"}}><Mobailenav/></div>
      </header>
      
      <main className="guide-details-container-main">
        <div className="guide-hero-section">
          <div className="guide-hero-image-overlare-div">
            <img className="guide-hero-image" src={guide.image} alt={guide.title} onClick={() => openFullScreenGallery(0)} style={{ cursor: 'pointer' }} />
            <div className="guide-hero-image-overlare"></div>
          </div>
          <div className="guide__hero-text">
            <h1 className="guide-hero-title">{guide.title}</h1>
            {guide.subTitle && <h3 className="guide-hero-subtitle">{guide.subTitle}</h3>}
          </div>
        </div>

        <div className="guide-grid-column">
          <section className="column-first-blog">
            <div className="guide-details-container"> 
              <div className="guide-content-area">
                <div
                  className="ql_editor_common guide-details-description"
                  dangerouslySetInnerHTML={{ __html: guide.description }}
                />
                <div className="ql_editor_common">
                  {guide.dynamicContent?.length > 0 &&
                    guide.dynamicContent.map((block, idx) => renderDynamicBlock(block, idx))}
                </div>
              </div>
           
              <div className="image-gallery-blog">
                {imagesForGrid.length > 0 && (
                    <ImageGalleryGrid
                        images={imagesForGrid.map(img => ({src: img.url, alt: img.alt, width: 4, height: 3}))}
                        onImageClickWithIndex={(index) => {
                            const clickedImageSrc = imagesForGrid[index].url;
                            const mainIndex = galleryImages.findIndex(img => img.src === clickedImageSrc);
                            if (mainIndex !== -1) openFullScreenGallery(mainIndex);
                        }}
                    />
                )}
              </div>
            </div>
            
            {showFullScreenGallery && (
              <FullScreenGallery
                images={galleryImages}
                onClose={() => setShowFullScreenGallery(false)}
                startIndex={startIndex}
              />
            )}   
          </section> 
          <section className="colom-tow-blog">
            <div><GroupTourList/></div>
            <div><DiscoverArticle/></div> 
          </section>
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

export default GuideDetails;

