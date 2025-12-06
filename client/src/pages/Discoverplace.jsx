import React, { useEffect, useState, useRef } from "react";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import "quill/dist/quill.snow.css";
import "highlight.js/styles/github.css";
import "../individualCSS/Discover/discoverplace.css";
import "../individualCSS/Discover/dynamic-blocks.css";
import "../pages/admin/ckeditorcastom.css";
import "../pages/admin/quill-castom.css";
import "../individualCSS/Discover/discoverplace-gallery.css";
import Mobailenav from "../components/Mobailenav";
import ImageGalleryGrid from '../components/ImageGalleryGrid';
import GroupTourList from "../components/GroupTourList";
// import Discoverinner from '../components/Discoverinner';
// import Tourinner from '../components/Tourinner';
// import Tourcolumn from '../components/Tourcolumn';
// import Packagescolumn from '../components/Packagescolumn';
import DiscoverArticle from "./discoverarticle";
import { Helmet } from "react-helmet-async";
import LandingFooter from "../components/LandingFooter";
import Packageslistcolumnlist from "../components/Packageslistcolumnlist";
import BlogListcolumnlist from "../components/BlogListcolumnlist";

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



// import FullScreenGallery from "../components/FullScreenGallery";

const Discoverplace = () => {
  const navigate = useNavigate();
  const { placename } = useParams();
  const { axios } = useAppContext();
  const [data, setData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInSliderMode, setIsInSliderMode] = useState(false);
  const [isOverlayMode, setIsOverlayMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isRightColumnExpanded, setIsRightColumnExpanded] = useState(false);
  const [showToggleButton, setShowToggleButton] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const sidebarRef = useRef();
  const overlayRef = useRef();

  // Lightbox states
  const [allImages, setAllImages] = useState([]);
  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    currentIndex: 0,
  });
  const [isLightboxFullScreen, setIsLightboxFullScreen] = useState(false);

  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);

  
const [openFAQIndex, setOpenFAQIndex] = useState(null);

const toggleFAQ = (index) => {
  setOpenFAQIndex(openFAQIndex === index ? null : index);
};

 useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);
  
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

  // Consolidate all images for the lightbox
  useEffect(() => {
    if (data) {
      const images = [];
      // Main thumbnail
      if (data.image) images.push({ src: data.image, alt: data.place });

      // Summary table images
      if (data.summaryTable?.image1) images.push({ src: data.summaryTable.image1, alt: data.summaryTable.alt1 || data.summaryTable.headerTitle || 'Summary Image 1' });
      if (data.summaryTable?.image2) images.push({ src: data.summaryTable.image2, alt: data.summaryTable.alt2 || data.summaryTable.locationTitle || 'Summary Image 2' });

      // Dynamic block images (excluding type 2)
      const dynamicBlockImages = (data.dynamicBlocks || [])
        .filter(block => block.type !== 'image-text-theme' && block.image)
        .map(block => ({ src: block.image, alt: block.alt || block.subtitle || 'Dynamic Content Image' }));
      images.push(...dynamicBlockImages);

      // Gallery images
      if (Array.isArray(data.galleryImages) && data.galleryImages.length > 0) {
        images.push(...data.galleryImages.map(img => ({ src: img.url, alt: img.alt })));
      }

      // Ensure unique images by src
      const uniqueImages = images.filter((img, index, self) =>
        index === self.findIndex((t) => t.src === img.src)
      );

      setAllImages(uniqueImages);
    }
  }, [data]);


  // Lightbox helper functions
  const openLightbox = (index) => {
    if (index >= 0 && index < allImages.length) {
      setLightboxState({ isOpen: true, currentIndex: index });
    }
  };

  const closeLightbox = () => {
    if (isLightboxFullScreen) {
      document.exitFullscreen();
    }
    setLightboxState({ isOpen: false, currentIndex: 0 });
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setLightboxState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % allImages.length,
    }));
  };

  const goToPrevious = (e) => {
    e.stopPropagation();
    setLightboxState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + allImages.length) % allImages.length,
    }));
  };

  const toggleFullScreen = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const downloadImage = async (e, url) => {
    e.stopPropagation();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const filename = url.substring(url.lastIndexOf('/') + 1);
      link.setAttribute('download', filename || 'image.jpg');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Image download started!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Could not download image.');
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsLightboxFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsHeaderSticky(true);
      } else {
        setIsHeaderSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);





  // Scroll-spy state
  const [activeId, setActiveId] = useState('top');
  const [sectionsList, setSectionsList] = useState([]); // { id, title }[]
  const contentObserver = useRef(null);


  const fontSizes = [80,82,84,86,88,90,92,94,96,98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118,120,122,124,126,128,130,132,134,136,138,140];
const [fontSize, setFontSize] = useState(() => {
  const saved = localStorage.getItem('fontSize');
  return saved ? parseInt(saved) : 100;
});

const increaseFontSize = () => {
  const currentIndex = fontSizes.indexOf(fontSize);
  if (currentIndex < fontSizes.length - 1) {
    setFontSize(fontSizes[currentIndex + 1]);
  }
};

const decreaseFontSize = () => {
  const currentIndex = fontSizes.indexOf(fontSize);
  if (currentIndex > 0) {
    setFontSize(fontSizes[currentIndex - 1]);
  }
};






useEffect(() => {
  localStorage.setItem('fontSize', fontSize);
}, [fontSize]);

useEffect(() => {
    const leftColumn = document.getElementById('leftColumn');
    const rightColumn = document.getElementById('rightColumn');

    if (!leftColumn || !rightColumn) return;

    const handleResize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth >= 900) {
        rightColumn.style.display = 'block';
        const leftHeight = leftColumn.offsetHeight;
        const rightHeight = rightColumn.scrollHeight;

        if (rightHeight > leftHeight) {
          setShowToggleButton(true);
          if (isRightColumnExpanded) {
            rightColumn.style.maxHeight = '';
            rightColumn.style.overflow = 'visible';
          } else {
            rightColumn.style.maxHeight = `${leftHeight}px`;
            rightColumn.style.overflow = 'hidden';
          }
        } else {
          setShowToggleButton(false);
          rightColumn.style.maxHeight = '';
          rightColumn.style.overflow = 'visible';
        }
      } else {
        rightColumn.style.display = 'none';
        setShowToggleButton(false);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(leftColumn);
    resizeObserver.observe(rightColumn);
    
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [data, isRightColumnExpanded]);

useEffect(() => {
  const editors = document.querySelectorAll('.ql-editor, .discoverplace-description, .ck-content, .table-content, dynamic-block-content');
  editors.forEach(editor => {
    editor.style.setProperty('font-size', `${fontSize}%`);
  });
}, [fontSize, data]);


  // Outside click for mobile or overlay
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        ((window.innerWidth < 1080) || isOverlayMode) &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsSidebarOpen(false);
        setIsOverlayMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen, isOverlayMode]);

  // Body class
  useEffect(() => {
    document.body.classList.add("discover-page-active");
    return () => {
      document.body.classList.remove("discover-page-active");
    };
  }, []);

  // Resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    if (windowWidth < 1080 && isInSliderMode) {
      setIsInSliderMode(false);
      setIsSidebarOpen(true);
    }
    if (windowWidth < 1080 && isOverlayMode) {
      setIsOverlayMode(false);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth, isInSliderMode, isOverlayMode]);

  // Fetch data
  useEffect(() => {
    const fetchDiscoverplace = async () => {
      try {
        const res = await axios.get(
          `/adddiscover/by-placename/${decodeURIComponent(placename)}`
        );
        if (res.data?.discover?.place) {
          setData(res.data.discover);
        } else {
          toast.error(res.data.message || "Discover place not found");
        }
      } catch {
        toast.error("Failed to load discover details");
      }
    };
    if (placename) fetchDiscoverplace();
  }, [placename, axios]);

  const handleLinkClick = () => {
    if (window.innerWidth < 1080 || isOverlayMode) {
      setIsSidebarOpen(false);
      setIsOverlayMode(false);
    }
  };

  
useEffect(() => {
  if (window.scrollY === 0) {
    setActiveId('top');
  }
}, []);


  // Smooth anchor scroll
  useEffect(() => {
  const handleAnchorClick = (e) => {
    const target = e.target;
    if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
      e.preventDefault();
      const id = target.getAttribute("href").substring(1);
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80; 
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
        window.history.replaceState(null, "", `#${id}`);
        setActiveId(id); 
      }
    }
  };
  document.addEventListener("click", handleAnchorClick);
  return () => document.removeEventListener("click", handleAnchorClick);
}, []);


  // Scroll-spy setup including dynamic blocks and quill content
  useEffect(() => {
    const setupSectionsAndObserver = () => {
      const editorContainer = document.querySelector('.move-on-slider-content-div .ql-editor');
      const dynamicBlocks = Array.from(document.querySelectorAll('.dynamic-block[id]'));
      const galleryElement = document.getElementById('Gallery-all-photo');

      const elems = [
        ...(editorContainer ? Array.from(editorContainer.querySelectorAll('[id]')) : []),
        ...dynamicBlocks,
      ];
      if (galleryElement) {
        elems.push(galleryElement);
      }

       const seen = new Set();
       const list = [{ id: 'top', title: 'Top' }, { id: 'Introduction', title: 'Introduction' }];

   






      

      elems.forEach((el) => {
        const id = el.id;
        if (!id || seen.has(id)) return;
        seen.add(id);

        let title = 
          el.getAttribute('data-title') ||
          el.textContent?.trim().split('\n')[0] ||
          id;
        if (title.length > 40) title = title.slice(0, 37) + '...';
        list.push({ id, title: title || id });
      });

      setSectionsList(list);

      if (contentObserver.current) {
        contentObserver.current.disconnect();
      }

      contentObserver.current = new IntersectionObserver(
  (entries) => {
    
    if (window.scrollY < 50) {
      setActiveId('top');
      return;
    }

    let best = null;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const ratio = entry.intersectionRatio;
        if (!best || ratio > best.ratio) {
          best = { id: entry.target.id, ratio };
        }
      }
    });
    if (best) {
      setActiveId(best.id);
    }
  },
  {
    root: null,
    rootMargin: '0px',
    threshold: [0.25, 0.5, 0.75],
  }
);


      list.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) contentObserver.current?.observe(el);
      });
    };

    const timer = setTimeout(setupSectionsAndObserver, 300);
    return () => {
      clearTimeout(timer);
      if (contentObserver.current) contentObserver.current.disconnect();
    };
  }, [data]);

//   const renderDynamicBlock = (block, index) => {
//   let typeClass = "";
//   if (block.type === "image-text") {
//     typeClass = "block-type-1";
//   } else if (block.type === "image-text-theme") {
//     typeClass = "block-type-2";
//   } else if (block.type === "text-theme") {
//     typeClass = "block-type-3";
//   }

//   const dataTitle = 
//     block.subtitle ||
//     (block.content ? extractTitleFromHtml(block.content) : block.idName) ||
//     block.idName;

//   const isClickable = block.type !== 'image-text-theme' && block.image;

//   return (
//     <>
//     <div  
//       // key={index}   
//       // className={`dynamic-block ${typeClass}`}
//       key={`outer-${index}`} className={`dynamic-block ${typeClass}`}
//       id={block.idName || undefined}
//       data-title={dataTitle}
//     >
//        {block.subtitle && (
//         <h3 className="dynamic-block-subtitle-outer">{block.subtitle}</h3>
//       )}
//       <div
//       //  key={index}
//       // className={`dynamic-block ${typeClass}`}
//       key={`inner-${index}`} className={`dynamic-block-inner ${typeClass}`}
//       id={block.idName || undefined}
//       data-title={dataTitle}
//       style={{ '--block-theme-color': getThemeColor(block.theme) }}
//       >
//       <div>
//       {block.subtitle && (
//         <h3 className="dynamic-block-subtitle-top">{block.subtitle}</h3>
//       )}
//       </div>

//       <div className="dynamic-block-div">
//       {block.image && (
//         <img
//           src={block.image}
//           alt={block.alt || block.subtitle || `block-img-${index}`}
//           className="dynamic-block-image" 
//           onClick={() => isClickable && openLightbox(allImages.findIndex(img => img.src === block.image))}
//           style={{ cursor: isClickable ? 'pointer' : 'default' }}
//         />
//       )}
//       {block.alt && <p className="discover__image-alt-text">{block.alt}</p>}
//       </div>
//       {block.subtitle && (
//         <h3 className="dynamic-block-subtitle-bottom">{block.subtitle}</h3>
//       )}
//       {block.content && (
//         <div
//           className="dynamic-block-content"
//           dangerouslySetInnerHTML={{ __html: block.content }}
//         />
//       )}
//       </div>
//     </div>
//     </>
//   );
// };

const renderDynamicBlock = (block, index) => {
  let typeClass = "";
  if (block.type === "image-text") typeClass = "block-type-1";
  else if (block.type === "image-text-theme") typeClass = "block-type-2";
  else if (block.type === "text-theme") typeClass = "block-type-3";

  const dataTitle = block.subtitle || (block.content ? extractTitleFromHtml(block.content) : block.idName) || block.idName;
  const isClickable = block.type !== 'image-text-theme' && block.image;

  return (
    <div  
      key={block.idName || index} 
      className={`dynamic-block ${typeClass}`}
      id={block.idName || undefined}
      data-title={dataTitle}
    >
      {block.subtitle && <h3 className="dynamic-block-subtitle-outer">{block.subtitle}</h3>}
      <div
        className={`dynamic-block-inner ${typeClass}`}
        style={{ '--block-theme-color': getThemeColor(block.theme) }}
      >
        <div className="dynamic-block-subtitle-top-div">{block.subtitle && <h3 className="dynamic-block-subtitle-top">{block.subtitle}</h3>}</div>
        <div className="dynamic-block-div">
          {block.image && (
            <img
              src={block.image}
              alt={block.alt || block.subtitle || `block-img-${index}`}
              className="dynamic-block-image" 
              onClick={() => isClickable && openLightbox(allImages.findIndex(img => img.src === block.image))}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            />
          )}
          {block.alt && <p className="discover__image-alt-text">{block.alt}</p>}
        </div>
        <div className="dynamic-block-title-des-div">
        {block.subtitle && <h3 className="dynamic-block-subtitle-bottom">{block.subtitle}</h3>}
        {block.content && <div className="dynamic-block-content" dangerouslySetInnerHTML={{ __html: block.content }} />}
        </div>
      </div>
    </div>
  );
};


  if (!data) return <Loader />; 

  const containerClassNames = [
    "baisic-page-container",
    isInSliderMode ? "slider-mode" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const showOverlaySidebar = isOverlayMode && windowWidth >= 1080;

  return (
    <div  className="discoverplace-container">
      <Helmet>
        <title>{data.seotitle || data.place}</title>
        <meta name="description" content={data.seodescription || data.subTitle} />
        <meta name="keywords" content={data.seokeywords || data.place} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div id="top" className='place-ditails-nave'>
        <Mobailenav />
        {/* <div className="common-caption-discoverplace-div">
          <h1 className="common-caption-discoverplace">
            Smart guidance, memorable tours — your travel, our care
          </h1>
        </div> */}
      </div>

     
      <h3 className="discoverplace-subtitle">{data.subTitle}</h3>

      <div
        className={containerClassNames}
        style={{
          gridTemplateColumns:
            !isInSliderMode && isSidebarOpen && !showOverlaySidebar
              ? "12.25rem 1fr"
              : "1fr",
          columnGap:
            !isInSliderMode && isSidebarOpen && !showOverlaySidebar ? "24px" : "0",
        }}
      >
        {(isSidebarOpen || showOverlaySidebar) && (
          <div
            ref={sidebarRef}
            className={`contens-sticky-PT ${ 
              isInSliderMode ? "slider-mode" : "" 
            } ${showOverlaySidebar ? "overlay-mode" : ""}`}
          >
            <div className="contable-head-button">
              <p className="contens-sticky-p">Contents</p>


                 {isSidebarOpen && !showOverlaySidebar && windowWidth < 1080 && (
          <button
            className="toggle-sidebar-button hide-button"
            onClick={() => {
              setIsSidebarOpen(false);
              setIsOverlayMode(false);
              setIsInSliderMode(false);
            }}
            aria-label="Hide sidebar"
          >
            Hide
          </button>
        )}


              {showOverlaySidebar ? (
                <button
                  className="move-to-slider-button"
                  onClick={() => {
                    setIsOverlayMode(false);
                    setIsInSliderMode(false);
                    setIsSidebarOpen(true);
                  }}
                >
                  Move to Slider
                </button>
              ) : (
                windowWidth >= 1080 &&
                isSidebarOpen &&
                !isInSliderMode && (
                  <button
                    className="hide-button-in-header"
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setIsOverlayMode(false);
                      setIsInSliderMode(false);
                    }}
                  >
                    Hide
                  </button>
                )
              )}
            </div>

            <div className="move-on-slider-content-div">




              <div className="scroll-container" style={{overflowY:'auto',paddingBottom:'50px',height:'93vh', }}>
              <div className="scroll-container-main-id"  style={{ marginTop: '15px', marginBottom:'10px',paddingBottom:'100px' ,paddingLeft: '10px', '--custom-font-size': '1em', }}>
                 {sectionsList.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={handleLinkClick}
                    aria-current={activeId === sec.id ? 'true' : undefined}
                    className={` table-content block mb-1  transition rounded ${ 
                      activeId === sec.id
                        ? 'font-bold text-blue-800'
                        : 'text-violet-950 hover:text-blue-800 hover:underline'
                    }`}
                    style={{ padding: '4px 6px',fontSize: 'var(--custom-font-size)', }}
                  >
                    {sec.title}
                  </a>
                ))}

               

              </div>


           

              





              
             
             {/* extra table link */} 
              {data.content && data.content.trim() !== "<p><br></p>" && (
                <div  style={{height:'auto',position:'relative',padding:'0'}} 
                  className="ql-editor extra-link"
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              )}
             

            </div>
            </div>
            </div>
  
        )}
       




        {((isSidebarOpen && windowWidth < 1080) || showOverlaySidebar) && (
          <div
            ref={overlayRef}
            className="sidebar-overlay"
            onClick={() => {
              setIsSidebarOpen(false);
              setIsOverlayMode(false);
            }}
          />
        )}

        <div className="discoverplace-content-page"> 

 {/* <div style={{padding:'10px'}}> */}
          <div className={`starting-header ${isHeaderSticky ? 'is-sticky' : ''}`}> 


<div style={{display:'flex', alignItems:'center',marginTop:'20px',gap:'8px'}}>

{(!isSidebarOpen || isOverlayMode || isInSliderMode) && (
  <button
    className=" sho-button"
    onClick={() => {
      if (isSidebarOpen) {
        // Sidebar open to close
        setIsSidebarOpen(false);
        setIsOverlayMode(false);
        setIsInSliderMode(false);
      } else {
        // Sidebar close to open
        if (windowWidth >= 1080) {
          setIsOverlayMode(true);
          setIsSidebarOpen(true);
          setIsInSliderMode(false);
        } else {
          setIsSidebarOpen(true);
        }
      }
    }}
    aria-label={isSidebarOpen ? "Close sidebar" : "Show sidebar"}
  >
    {isSidebarOpen ? (
      <span key={isSidebarOpen} 
  className="cross-button-content-table rotate-in"
>
       <i className="fa-solid fa-xmark"></i>
      </span>
    ) : (

      <>

      <div style={{alignItems:'center',textAlign:'center',display:'flex',gap:'1px',cursor:'pointer'}}>
        
      <i style={{color:'#111',fontSize:'24px',width:'3px'}} className=" fa-solid fa-ellipsis-vertical"></i>
       <i style={{color:'#080000',fontSize:'24px', }} className=" fa-solid fa-bars"></i>
      </div>
      </>
    )}
  </button>
)}


 <h1 className="discoverplace___title"> {data.place}</h1>
</div>


  <div style={{display:'flex',gap:'10px', alignItems: 'center'}}>
           
<div  >
  <p style={{color:'#2b8dca', fontSize:'17px',fontFamily:'Lisu Bosa',fontWeight:'800',textAlign:'center',lineHeight:'1.2'}}>Font Size  </p>

<div className="font-size-controller">
  <button onClick={decreaseFontSize} disabled={fontSize === fontSizes[0]}><i className="fa-solid fa-minus"></i></button>
       <span style={{fontFamily:'Poppins',fontWeight:'600',fontSize:'14px',lineHeight:'1',color:'#444',marginBottom:'3px' }}>{fontSize}%</span>
  <button onClick={increaseFontSize} disabled={fontSize === fontSizes[fontSizes.length - 1]}><i className="fa-solid fa-plus"></i></button>
</div>

</div>



<img className="logo-spin" style={{width:'40px',height:'40px',marginTop:'13px'}} src="/assets/favicon.png" alt="logo-icon" />
</div> 

</div>



            <div className="starting-point">
                  <h3 className="article-caption">
            From <span className="span-in">insignia</span> — your <span className="span-free">free</span> journey <span className="span-gu-kn">guide</span> and <span className="span-gu-kn">knowledge</span> hub
          </h3>

           
         

  
   {data && data.updatedAt && (
  <p
  style={{
    fontSize: '13px',
    fontFamily: "'Poppins', sans-serif",
    marginTop: '0px',
    color: '#555',
  }}
>
  <span style={{ color: '#555', fontStyle: 'normal' }}>
    Last updated on{' '}
  </span>
  <span style={{ color: '#222', fontWeight: '500' }}>
    {/* {moment(data.updatedAt).format('D MMMM YYYY, h:mm A')} */}
    {moment(data.updatedAt).format('D MMM YYYY, h:mm A')}
  </span>
</p>

)}

 </div>


{/* </div> */}

          <div className="discoverplace-content-package-griddiv">
            <div className="discoverplace-content-locked-div" id="leftColumn">
              <div className="discoverplace-thumbnail-div">
                <div className="discoverplace-thum-image-alt-div" >
                <img
                  className="discoverplace-thumbnail-image"
                  src={data.image}
                  alt={data.place}
                  onClick={() => openLightbox(allImages.findIndex(img => img.src === data.image))}
                  style={{cursor: 'pointer'}}
                />
                </div>

                <div className="discoverplace-description-div">
                <div
                 id="Introduction" className="ql-editor discoverplace-description"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                  style={{ fontSize: 'var(--custom-font-size)' }}
                />
              </div>
              </div>
              

              {/* summary table when screen size <900 */}

              <h2 className="summary-title">Summary Table</h2>
               {data.summaryTable && (
  <section
    className="discoverplace-summary-section-smaller-screen"
    style={{  height:'auto',borderRadius: '2px',
          border:'1px solid #a2a9b1',padding:'8px',justifyContent:'center'}}
  >
    {data.summaryTable.headerTitle && <h2 style={{color:'black',fontSize:'1rem',fontWeight:'bold',marginBottom:'2px',textAlign:'center',fontFamily:'sans-serif'}}>{data.summaryTable.headerTitle}</h2>}

    
   
    <div style={{ width: '100%', height: '100%' }}>
  {data.summaryTable.image1 && (
    <img
      src={data.summaryTable.image1}
      alt={data.summaryTable.alt1 || data.summaryTable.headerTitle || "Summary Image 1"}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        cursor: 'pointer'
      }}
      onClick={() => openLightbox(allImages.findIndex(img => img.src === data.summaryTable.image1))}
    />
  )}
</div>

    {data.summaryTable.alt1 && <p className="image-alt-text">{data.summaryTable.alt1}</p>}

    {data.summaryTable.cqeditorTable && (
      <div
        className="ck-content discoverplace-summary-cqeditor"
        dangerouslySetInnerHTML={{ __html: data.summaryTable.cqeditorTable }}
        style={{          
          padding:'8px',
          height:'auto',
        }}
      />
    )}

    

   <div style={{width:'100%', height:'auto',display:'flex', justifyContent:'center'}}>
    {data.mapEmbedUrl && (
      <div style={{ position: 'relative', width: '100%', height: '250px', marginBottom: '10px' }}>
        <iframe
          src={data.mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    )}
    {/* {data.summaryTable.image2 && (
      <img
        src={data.summaryTable.image2}
        alt={data.summaryTable.alt2 || data.summaryTable.locationTitle || "Summary Image 2"}
        style={{ maxWidth: '100%', height: 'auto',position:'relative', cursor: 'pointer' }}
        onClick={() => openLightbox(allImages.findIndex(img => img.src === data.summaryTable.image2))}
      />
    )} */}
    
    </div>
    {/* {data.summaryTable.alt2 && <p className="image-alt-text">{data.summaryTable.alt2}</p>} */}
    {data.summaryTable.locationTitle && <h4 style={{color:'#444',fontWeight:'600',textAlign:'center',fontSize:'0.8rem',fontFamily:'sans-serif',padding:'0 25px 0 25px'}}>{data.summaryTable.locationTitle}</h4>}

     
  </section>
)}




                
               
               <div className="ql-editor discoverplace-dynamic-blocks">
            {data.dynamicBlocks?.length > 0 &&
               data.dynamicBlocks.map((block, idx) => renderDynamicBlock(block, idx))}
           </div>


            {/* Image Gallery Section */}
            {galleryPhotos.length > 0 && (
              <div style={{padding:"10px"}} id="Gallery-all-photo" data-title="Gallery">
                <ImageGalleryGrid
                    images={galleryPhotos}
                    onImageClickWithIndex={(index) => {
                        const clickedImageSrc = galleryPhotos[index].src;
                        const mainIndex = allImages.findIndex(img => img.src === clickedImageSrc);
                        if (mainIndex !== -1) {
                            openLightbox(mainIndex);
                        }
                    }}
                    onExpand={() => setIsGalleryExpanded(true)}
                />
              </div>
            )}

            {/* ✅ FAQ Section */}
{data.faqTitle && data.faqs && data.faqs.length > 0 && (
  <div className="discover-faq-section">
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
            <span>{item.question}</span>
            <i
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
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}


            
            </div>
            

            <div  className="right-table-package-content" id="rightColumn" style={{position: 'relative'}} >
              
            {data.summaryTable && (
  <section
    className="discoverplace-summary-section"
    style={{  height:'auto',borderRadius: '2px',
          border:'1px solid #a2a9b1',padding:'8px',justifyContent:'center'}}
  >
    {data.summaryTable.headerTitle && <h2 style={{color:'black',fontSize:'1rem',fontWeight:'bold',marginBottom:'2px',textAlign:'center',fontFamily:'sans-serif'}}>{data.summaryTable.headerTitle}</h2>}

    
   

    {data.summaryTable.image1 && (
      <img
        src={data.summaryTable.image1}
        alt={data.summaryTable.alt1 || data.summaryTable.headerTitle || "Summary Image 1"}
        style={{ maxWidth: '100%', height: 'auto', cursor: 'pointer'}}
        onClick={() => openLightbox(allImages.findIndex(img => img.src === data.summaryTable.image1))}
      />
    )}
    {data.summaryTable.alt1 && <p className="image-alt-text">{data.summaryTable.alt1}</p>}

    {data.summaryTable.cqeditorTable && (
      <div
        className="ck-content discoverplace-summary-cqeditor"
        dangerouslySetInnerHTML={{ __html: data.summaryTable.cqeditorTable }}
        style={{          
          padding:'8px',
          height:'auto'
        }}
      />
    )}

   <div style={{width:'100%', height:'auto',display:'flex', justifyContent:'center'}}>
    {data.mapEmbedUrl && (
      <div style={{ position: 'relative', width: '100%', height: '250px', marginBottom: '10px' }}>
        <iframe
          src={data.mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    )}
    {/* {data.summaryTable.image2 && (
      <img
        src={data.summaryTable.image2}
        alt={data.summaryTable.alt2 || data.summaryTable.locationTitle || "Summary Image 2"}
        style={{ maxWidth: '100%', height: 'auto',position:'relative', cursor: 'pointer' }}
        onClick={() => openLightbox(allImages.findIndex(img => img.src === data.summaryTable.image2))}
      />
    )} */}
    </div>
    {/* {data.summaryTable.alt2 && <p className="image-alt-text">{data.summaryTable.alt2}</p>} */}
    {data.summaryTable.locationTitle && <h4 style={{color:'#444',fontWeight:'600',textAlign:'center',fontSize:'0.8rem',fontFamily:'sans-serif',padding:'0 25px 0 25px'}}>{data.summaryTable.locationTitle}</h4>}

     
  </section>
)}
    {/* {data.summaryTable.alt2 && <p className="image-alt-text">{data.summaryTable.alt2}</p>}
    {data.summaryTable.locationTitle && <h4 style={{color:'#444',fontWeight:'600',textAlign:'center',fontSize:'0.8rem',fontFamily:'sans-serif',padding:'0 25px 0 25px'}}>{data.summaryTable.locationTitle}</h4>}

     
  </section>
)}
 */}

            <div style={{paddingTop:'2rem'}}>
            <GroupTourList/>
            </div>

            <div>
            <DiscoverArticle/>
            </div>

  

{/* <div style={{textAlign:'center'}} className="discoverplace-package-content">comming soon</div> */}

{showToggleButton && !isRightColumnExpanded && (
    <div style={{ textAlign: 'center', padding: '1rem', position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(255,255,255,1) 20%, rgba(255,255,255,0))', paddingTop: '3rem' }}>
        <button className="right-colum-show-hide-button" onClick={() => setIsRightColumnExpanded(true)} >
            Show All
        </button>
    </div>
)}
{showToggleButton && isRightColumnExpanded && (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
        <button className="right-colum-show-hide-button" onClick={() => setIsRightColumnExpanded(false)} >
            Show Less
        </button>
    </div>
)}

</div>

           
          </div>
        </div>
             
      </div>




      

      {/* Lightbox Modal */}
      {lightboxState.isOpen && allImages.length > 0 && (
        <div className={`gallery-modal-overlay ${isLightboxFullScreen ? 'fullscreen-mode' : ''}`} onClick={closeLightbox}>
          <div className="discover-lightbox-toolbar">
            <div className="lightbox-counter">
              {lightboxState.currentIndex + 1} / {allImages.length}
            </div>
            <div className="lightbox-actions">
              <button className="lightbox-action-btn" onClick={toggleFullScreen} title={isLightboxFullScreen ? "Exit Fullscreen" : "Fullscreen"}>
                <i className={`fa-solid ${isLightboxFullScreen ? 'fa-compress' : 'fa-expand'}`}></i>
              </button>
              <button className="lightbox-action-btn" onClick={(e) => downloadImage(e, allImages[lightboxState.currentIndex].src)} title="Download">
                <i className="fa-solid fa-download"></i>
              </button>
              <button className="lightbox-action-btn" onClick={closeLightbox} title="Close">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
          
          <button className="lightbox-prev" onClick={goToPrevious}>&#10094;</button>

          <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
            <div>
            <img 
              src={allImages[lightboxState.currentIndex].src} 
              alt={allImages[lightboxState.currentIndex].alt || `Lightbox view ${lightboxState.currentIndex + 1}`}
              className="gallery-modal-image" 
            />
            <div>
            {allImages[lightboxState.currentIndex].alt && (
              <p className="discover-lightbox-alt-text" style={{ color: '#fff', textAlign: 'center', marginTop: '5px', fontSize: '0.9rem',fontFamily:'Ubuntu',fontStyle:'italic',fontWeight:'400' }}>
                {allImages[lightboxState.currentIndex].alt}
              </p>
            )}
            </div>
            </div>
          </div>

          <button className="lightbox-next" onClick={goToNext}>&#10095;</button>
        </div>
      )}

          

           
             {/* <div>
             <Discoverinner/>
            </div> */}

          <div>
            <Packageslistcolumnlist/>
          </div>
          <div>
            <BlogListcolumnlist/>
          </div>
            
             <div className="group-populararticle-grid">
            <div>
            <GroupTourList/>
            </div>

            <div>
            <DiscoverArticle/>
            </div>
             </div>

            {/* <div>
            <Packagescolumn/>
            </div> */}

             {/* <div>
             <Tourinner/>
            </div> */}
             
          <footer><LandingFooter/></footer>
    </div>
  );
};

export default Discoverplace;