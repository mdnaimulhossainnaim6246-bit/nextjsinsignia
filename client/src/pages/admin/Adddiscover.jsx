// pages/admin/Adddiscover.jsx 

import React, { useEffect, useState, useRef, useCallback } from 'react';
import DynamicContentBuilder from '../../components/addmin/DynamicContentBuilder';
import TableContentEditor from '../../components/addmin/TableContentEditor';
import CKEditorTableEditor from "../../components/addmin/CKEditorTableEditor";
import FaqsSection from '../../components/addmin/FaqsSection';
// import DateTimeDisplay from "../../components/addmin/DateTimeDisplay";
import ImageGallery from '../../components/addmin/ImageGallery';
import SEOPage from '../../components/addmin/SEOPage';

import "../../pages/admin/ckeditorcastom.css";
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import CreatableSelect from 'react-select/creatable';
import { components } from 'react-select';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Adddiscover = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { axios } = useAppContext();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get("id");

  const [place, setPlace] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subTitle, setSubTitle] = useState('');
  const [destinationTagline, setDestinationTagline] = useState('');
  const [destinationTheme, setDestinationTheme] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [whatToExperience, setWhatToExperience] = useState(
    Array(6).fill({ title: '', checked: false })
  );
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const seoPageRef = useRef(null);

  

  const [dynamicBlocks, setDynamicBlocks] = useState([]);
   const [content, setContent] = useState("");
   const [summaryContent, setSummaryContent] = useState({
  headerTitle: "",
  locationTitle: "",
  cqeditorTable:"",
  image1: null,
  image2: null,
  alt1: "",
  alt2: "",
});



   


  const [rating, setRating] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [image, setImage] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [faqTitle, setFaqTitle] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [initialSeoData, setInitialSeoData] = useState({
        seotitle: '',
        seodescription: '',
        seokeywords: '',
      });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ align: [] }],
              [{ color: ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466"] }, { background: [] }],
              ['link','video', 'blockquote', 'code-block'],
              ['clean'],
            ],
          },
        },
        placeholder: 'Write Introduction here...',
      });

      quillRef.current = quill;
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await axios.get('/addtour/all');
      if (data.success && Array.isArray(data.tour)) {
        const formatted = data.tour.map(t => ({
          value: t._id,
          label: t.title,
          isDeletable: t.isDeletable, 
        }));
        setCategories(formatted);
      }
    } catch {
      toast.error('Failed to load categories');
    }
  }, [axios]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!editId) {
      clearForm();
      return;
    }

    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/adddiscover/${editId}`);
        if (data.success) {
          const d = data.discover;
          setPlace(d.place || "");
          setSubTitle(d.subTitle || "");
          setDestinationTagline(d.destinationTagline || '');
          setDestinationTheme(d.destinationTheme || '');
          setMapEmbedUrl(d.mapEmbedUrl || '');
          setWhatToExperience(d.whatToExperience && d.whatToExperience.length > 0 ? d.whatToExperience : Array(6).fill({ title: '', checked: false }));
          setRating(d.rating || 1);
          setIsPublished(d.isPublished || false);
          setImage(d.image || null);
          setIsEditMode(true);

          if (d.category && d.category._id) {
            setCategory(d.category._id);
          } else if (d.customCity) {
            setCategory(d.customCity);
          }

          if (quillRef.current) {
            quillRef.current.root.innerHTML = d.description || "";
          }
          setContent(d.content || "");
          
          if (d.summaryTable) {
            setSummaryContent({
              headerTitle: d.summaryTable.headerTitle || "",
              locationTitle: d.summaryTable.locationTitle || "",
              cqeditorTable: d.summaryTable. cqeditorTable || "",
              image1: d.summaryTable.image1 || null,
              image2: d.summaryTable.image2 || null,
              alt1: d.summaryTable.alt1 || "",
              alt2: d.summaryTable.alt2 || "",
            });
          }

          if (d.galleryImages) {
            setGalleryImages(d.galleryImages ? d.galleryImages.map(img => ({ ...img, preview: img.url, isUrl: true })) : []);
          }

          const frontendBlocks = (d.dynamicBlocks || []).map((block, index) => {
            let type = "";
            if (block.type === "image-text") type = "block1";
            else if (block.type === "image-text-theme") type = "block2";
            else if (block.type === "text-theme") type = "block3";

            return {
              id: block.id || Date.now() + index,
              ...block,
              type,
              description: block.content || "",
            };
          });
          setDynamicBlocks(frontendBlocks);

          setFaqTitle(d.faqTitle || "");
          setFaqs(d.faqs && d.faqs.length > 0 ? d.faqs : [{ question: "", answer: "" }]);
          setInitialSeoData({
            seotitle: d.seotitle || '',
            seodescription: d.seodescription || '',
            seokeywords: d.seokeywords || '',
          });

        } else {
          toast.error("Failed to fetch data");
        }
      } catch (err) {
        toast.error("Error fetching data");
      }
    };

    fetchData();
  }, [editId, axios]);

  const clearForm = () => {
    setPlace('');
    setSubTitle('');
    setDestinationTagline('');
    setDestinationTheme('');
    setMapEmbedUrl('');
    setWhatToExperience(Array(6).fill({ title: '', checked: false }));
    setIsPublished(false);
    setImage(null);
    setCategory('');
    setDynamicBlocks([]);
    if (quillRef.current) quillRef.current.root.innerHTML = '';
    setIsEditMode(false);
    setFaqTitle("");
    setFaqs([{ question: "", answer: "" }]);
    setSummaryContent({
      headerTitle: "",
      locationTitle: "",
      cqeditorTable:"",
      image1: null,
      image2: null,
      alt1: "",
      alt2: "",
      content: "",
    });
    setInitialSeoData({
            seotitle: '',
            seodescription: '',
            seokeywords: '',
          });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!place.trim()) return toast.error("Place is required");
    if (!subTitle.trim()) return toast.error("Sub title is required");
    if (!category || category === "") return toast.error("Category is required");
    if (rating < 1 || rating > 5) {
      return toast.error("Please select a valid rating between 1 and 5");
    }

    setIsUploading(true);

    const formData = new FormData();
    const summaryContentPayload = { ...summaryContent };

    if (summaryContentPayload.image1 instanceof File) {
      formData.append('summary_image1', summaryContentPayload.image1);
      summaryContentPayload.image1 = 'summary_image1';
    }
    if (summaryContentPayload.image2 instanceof File) {
      formData.append('summary_image2', summaryContentPayload.image2);
      summaryContentPayload.image2 = 'summary_image2';
    }

    if (image instanceof File) {
      formData.append("image", image);
    }

    // Handle gallery images
    const existingGallery = galleryImages.filter(img => img.isUrl).map(img => ({ url: img.url, alt: img.alt }));
    const newGalleryFiles = galleryImages.filter(img => !img.isUrl);

    newGalleryFiles.forEach(img => {
      formData.append("galleryImages", img.file);
    });

    const processedBlocks = dynamicBlocks.map((block, index) => {
      let type = "";
      if (block.type === "block1") type = "image-text";
      else if (block.type === "block2") type = "image-text-theme";
      else if (block.type === "block3") type = "text-theme";

      const newBlock = { ...block, type, content: block.description || "" };

      delete newBlock.description;
      delete newBlock.image;

      if (block.image instanceof File) {
        newBlock.image = `dynamic_image_${index}`;
        formData.append(`dynamic_image_${index}`, block.image);
      } else if (typeof block.image === "string" && block.image.trim() !== "") {
        newBlock.image = block.image;
      } else {
        newBlock.image = null;
      }

      return newBlock;
    });

    const seoData = seoPageRef.current.getSEOData();

    const discoverPayload = {
      place,
      category,
      subTitle,
      description: quillRef.current.root.innerHTML,
      content,
      summaryTable: summaryContentPayload,
      isPublished,
      dynamicBlocks: processedBlocks,
      rating,
      uploadTime: currentDateTime.toISOString(),
      galleryImages: existingGallery,
      newImageAlts: newGalleryFiles.map(img => img.alt),
      faqTitle,
      faqs,
      seoData,
      destinationTagline,
      destinationTheme,
      mapEmbedUrl,
      whatToExperience,
    };

    formData.append("discover", JSON.stringify(discoverPayload));

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      let response;

      if (isEditMode) {
        response = await axios.put(`/adddiscover/update/${editId}`, formData, config);
      } else {
        response = await axios.post("/adddiscover", formData, config);
      }

      if (response.data.success) {
        toast.success(isEditMode ? "Post updated successfully!" : "Post uploaded successfully!");
        if (isNewCategory) {
          fetchCategories(); 
        }
        clearForm();
        setIsNewCategory(false);
        navigate("/admin/listdiscover");
      } else {
        toast.error(response.data.message || "Failed to submit");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCategory = async (option) => {
    try {
      const { data } = await axios.post('/tour/delete', { id: option.value });
      if (data.success) {
        toast.success('Category deleted successfully');
        setCategories(categories.filter(cat => cat.value !== option.value));
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  const CustomOption = (props) => (
    <components.Option {...props}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>{props.label}</span>
        {props.data.isDeletable && (
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ff6b6b',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            onClick={(e) => {
              e.stopPropagation(); 
              handleDeleteCategory(props.data);
            }}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
      </div>
    </components.Option>
  );

  return (
    <form onSubmit={onSubmitHandler} className="admin-add-tour-main">
      <div className="admin-add-tour-main-div">
        {isEditMode && (
          <button
            type="button"
            onClick={() => {
              clearForm();
              navigate('/admin/adddiscover');
            }}
            className="cancel-edit-btn" style={{
              backgroundColor: '#e74c3c',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '15px',
              fontWeight: '600',
              fontSize: '14px',
              alignSelf: 'flex-start',
            }} 
          >
            Cancel Edit
          </button>
        )}

        <p className="add-tour-upload-thumbnail-p">Upload Thumbnail</p>
        <label className="thumbnail-label" htmlFor="image">
          {!image ? (
            <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
          ) : (
            <img
              src={image instanceof File ? URL.createObjectURL(image) : image}
              alt="discover_thumbnail"
              className="admin-add-tour-thumbnail"
            />
          )}
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required={!image}
          />
        </label>

        <p className="add-tour-upload-tsd">Place</p>
        <input
          type="text"
          placeholder="Type here"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          required
          className="add-tour-uploade-title-input"
        />

        
          



        <p className="add-tour-upload-tsd">Sub Title</p>
        <input
          type="text"
          name="subTitle"
          placeholder="Type here"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          required
          className="add-tour-uploade-title-input"
        />

        <p className="add-tour-upload-tsd">Destination Tagline</p>
        <input
          type="text"
          placeholder="Type here"
          value={destinationTagline}
          onChange={(e) => setDestinationTagline(e.target.value)}
          className="add-tour-uploade-title-input"
        />

        <p className="add-tour-upload-tsd">Destination Theme</p>
        <input
          type="text"
          placeholder="Type here"
          value={destinationTheme}
          onChange={(e) => setDestinationTheme(e.target.value)}
          className="add-tour-uploade-title-input"
        />

        <p style={{marginTop:'0.5rem',fontSize:"1.3rem"}} >What to Experience</p>
        <div style={{marginBottom:"1rem"}} className="what-to-experience-container">
          {whatToExperience.map((item, index) => (
            <div key={index} className="what-to-experience-item">
              <input
                type="checkbox"
                style={{
                  width: '15px',
                  height: '15px',
                  cursor: 'pointer',
                  marginRight:'10px',
                  marginTop:"13px"
                }}
                checked={item.checked}
                onChange={() => {
                  const newWhatToExperience = [...whatToExperience];
                  newWhatToExperience[index] = { ...item, checked: !item.checked };
                  setWhatToExperience(newWhatToExperience);
                }}
              />
              {item.checked && (
                <input
                  type="text"
                  placeholder={`Experience ${index + 1}`}
                  value={item.title}
                  onChange={(e) => {
                    const newWhatToExperience = [...whatToExperience];
                    newWhatToExperience[index] = { ...item, title: e.target.value };
                    setWhatToExperience(newWhatToExperience);
                  }}
                  style={{
                     padding: '4px 8px',
                     fontSize: '14px',
                     borderRadius: '4px',
                     border: '1px solid #ccc',
                     outline: 'none',
                   }}
                />
              )}
            </div>
          ))}
        </div>

        <p className="add-tour-upload-tsd">Google Map Embed URL</p>
        <input
          type="text"
          placeholder="Paste Google Map Embed URL here"
          value={mapEmbedUrl}
          onChange={(e) => setMapEmbedUrl(e.target.value)}
          className="add-tour-uploade-title-input"
        />


        <p className="add-tour-upload-tsd">Category (Select or Add City)</p>

  <CreatableSelect
  components={{ Option: CustomOption }}
  isClearable
  value={
    categories.find(cat => cat.value === category)
      || (!categories.some(cat => cat.label === category) && category
        ? { label: category, value: category }
        : null)
  }
  onChange={(newValue, actionMeta) => {
    if (newValue) {
      if (actionMeta.action === 'create-option') {
        setCategory(newValue.label);
        setIsNewCategory(true);
      } else {
        setCategory(newValue.value);
        setIsNewCategory(false);
      }
    } else {
      setCategory('');
      setIsNewCategory(false);
    }
  }}
  options={categories}
  placeholder="Select or type a city..."
  classNamePrefix="add-tour-uploade-title-input"
  styles={{
    control: (base, state) => ({
      ...base,
      minHeight: '48px',
       marginBottom:'30px',
      padding: '4px 14px',
      borderRadius: 'none',
      background: 'rgba(0,0,0,0.3)', 
       border: state.isFocused? '1px solid transparent' : '1.5px solid transparent' ,
      borderImage: state.isFocused
        ? 'linear-gradient(to right,#00bfff, #007bff) 1'
        : 'linear-gradient(to right, #007bff, #00bfff) 1', 
      fontSize: '15px',
      transition: 'all 0.1s ease',
      color: '#fff',
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '0 6px',
      gap: '6px',
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      fontSize: '15px',
      color: '#fff',
    }),
    placeholder: (base) => ({
      ...base,
      color: 'rgba(255,255,255,0.5)',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#fff',
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      padding: '4px',
      transition: 'transform 0.2s',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none',
      color: 'rgba(255,255,255,0.8)',
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: '4px',
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.8)',
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '6px',
      marginTop: '4px',
      border: '1px solid rgba(255,255,255,0.1)',
      background: '#1f2733', 
      boxShadow: '0 16px 40px -5px rgba(0,0,0,0.6)',
      overflow: 'hidden',
      zIndex: 10,
    }),
    option: (base, state) => ({
      ...base,
      padding: '10px 14px',
      cursor: 'pointer',
      background: state.isSelected
        ? 'rgba(64, 152, 255, 0.15)'
        : state.isFocused
        ? 'rgba(255,255,255,0.05)'
        : 'transparent',
      color: '#fff',
      transition: 'background 0.15s ease',
    }),
    noOptionsMessage: (base) => ({
      ...base,
      padding: '10px 14px',
      color: 'rgba(255,255,255,0.6)',
      fontStyle: 'italic',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    multiValue: (base) => ({
      ...base,
      background: 'rgba(64, 152, 255, 0.1)',
      color: '#fff',
      borderRadius: '4px',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#fff',
      padding: '2px 6px',
    }),
    multiValueRemove: (base) => ({
      ...base,
      cursor: 'pointer',
      color: 'rgba(255,255,255,0.7)',
      ':hover': {
        background: 'rgba(255,255,255,0.1)',
        color: '#fff',
      },
    }),
  }}
/>



        
         <div className='adddiscover-discription-div' style={{background:'#d9e8f9',padding:'12px',borderRadius:'8px'}}>
        <p className="add-tour-upload-des-q" >Description</p>
        <div className="add-tour-upload-des">
          <div ref={editorRef} />
        </div>
         </div>

          <div className='adddiscover-discription-div' style={{background:'#d9e8f9', marginTop:'20px',padding:'12px',borderRadius:'8px'}}>
        <div className="add-tour-upload-des">
         <TableContentEditor value={content} onChange={setContent} />

        </div>

        </div>



      <div className='adddiscover-discription-div' style={{background:'#d0e8f9',padding:'12px',marginTop:'20px',borderRadius:'8px'}}>
        <p style={{ fontSize:'18px',fontFamily:'Poppins',fontWeight:'700',textAlign:'center',color:'#333',borderBottom:'1px solid #007bff',paddingBottom:'10px' }} >Summary Table</p>
       <div style={{borderBottom:'1px solid #007bff',borderLeft:'1px solid #007bff',borderRight:'1px solid #007bff'}} className="add-tour-upload-des">
      <CKEditorTableEditor value={summaryContent} onChange={setSummaryContent} />
      </div>
      </div>

        
       
        
        <div className='dynamic-block-content'>
        <DynamicContentBuilder
          value={dynamicBlocks}
          onChange={setDynamicBlocks}
        />
        </div>

        <FaqsSection
                  faqTitle={faqTitle}
                  setFaqTitle={setFaqTitle}
                  faqs={faqs}
                  setFaqs={setFaqs}
                />


        <div style={{maxWidth:'100%'}}>
  <ImageGallery
    initialImages={galleryImages}
    onChange={(files) => setGalleryImages(files)}
  />
</div>



<p className="add-tour-upload-tsd" style={{fontSize:'20px'}}>Set Place Rating</p>
<small className="text-xs text-gray-500 mt-1">Tap or click on stars to set rating</small>

<div className="flex gap-1 cursor-pointer text-2xl">
  {[1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      onClick={() => setRating(star)}
      className={`transition-colors ${
        star <= rating ? 'text-yellow-400' : 'text-gray-400'
      }`}
    >
      ★
    </span>
  ))}
  <span className="text-sm text-gray-600 ml-2">
    {rating ? `${rating}/5` : ''}
  </span>
</div>

        {/* SEO Meta Inputs */}
         <div>
           <SEOPage
             ref={seoPageRef}
             defaultTitle={initialSeoData.seotitle}
             defaultDescription={initialSeoData.seodescription}
             defaultKeywords={initialSeoData.seokeywords}
           />
         </div>

        <label className="add-discover-checkbox-div" >
          <input
            className="addtour-publish-checkbox"
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          Upload Now
        </label>

        <button disabled={isUploading} type="submit" className="admin-add-tour-submit-btn">
          {isUploading ? 'Uploading...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default Adddiscover;