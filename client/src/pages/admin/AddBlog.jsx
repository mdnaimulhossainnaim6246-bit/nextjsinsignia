import React, { useEffect, useState, useRef } from 'react';
import CKEditor from "../../components/addmin/CKEditorTableEditor";
import ImageGallery from '../../components/addmin/ImageGallery';
import DynamicContentBuilder from '../../components/addmin/DynamicContentBuilder';
import "../../pages/admin/ckeditorcastom.css";
import "./QuillEditor.css";
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SEOPage from '../../components/addmin/SEOPage';

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddBlog = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const seoPageRef = useRef(null);

  // State for the main form data
  const [blog, setBlog] = useState({});
  const [date, setDate] = useState(new Date());
  // State for separate UI components
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [travelersPhoto, setTravelersPhoto] = useState(null);
  const [travelersPhotoPreview, setTravelersPhotoPreview] = useState("");
  const [imageGallery, setImageGallery] = useState([]);
  const [dynamicContent, setDynamicContent] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
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

      quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
          const format = quill.getFormat();
          if (!format.color) {
            quill.format('color', '#000000');
          }
        }
      });

      quillRef.current = quill;
    }
  }, []);

  // Effect to fetch blog data when editing, or clear the form when creating
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        toast.loading("Loading existing data...", { id: 'loading_blog' });
        const { data } = await axios.get(`/addblog/${editId}`);
        if (data.success && data.blog) {
          const blogData = data.blog;
          
          // Set all states based on fetched data
          setBlog(blogData);

          if (quillRef.current) {
            quillRef.current.root.innerHTML = blogData.description || "";
          }
          setImagePreview(blogData.image);
          setImageGallery(blogData.imageGallery ? blogData.imageGallery.map(img => ({ ...img, preview: img.url, isUrl: true })) : []);
          
          // Translate dynamic content types for the builder
          const translatedDynamicContent = (blogData.dynamicContent || []).map(block => {
              const newBlock = { ...block };
              if (block.type === "image-text") newBlock.type = "block1";
              else if (block.type === "image-text-theme") newBlock.type = "block2";
              else if (block.type === "text-theme") newBlock.type = "block3";
              newBlock.alt = block.alt || ""; // Ensure alt is included
              return newBlock;
          });
          setDynamicContent(translatedDynamicContent);
          if (blogData.date) {
            setDate(new Date(blogData.date));
          }
          setTravelersPhotoPreview(blogData.travelersPhoto);
          setBlog((prev) => ({ ...prev, travelersName: blogData.travelersName }));
          setInitialSeoData({
            seotitle: blogData.seotitle || '',
            seodescription: blogData.seodescription || '',
            seokeywords: blogData.seokeywords || '',
          });

          setIsEditMode(true);
          toast.success("Data loaded successfully!", { id: 'loading_blog' });
        } else {
          toast.error("Failed to fetch blog details.", { id: 'loading_blog' });
          navigate("/admin/addblog");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.", { id: 'loading_blog' });
        navigate("/admin/addblog");
      }
    };

    const clearForm = () => {
        setBlog({
            title: "",
            description: "",
            isPublished: false,
            subTitle: "",
        });
        if (quillRef.current) {
            quillRef.current.root.innerHTML = "";
          }
        setImage(null);
        setImagePreview("");
        setImageGallery([]);
        setDynamicContent([]);
        setTravelersPhoto(null);
        setTravelersPhotoPreview("");
        setBlog((prev) => ({ ...prev, travelersName: "" }));
        setIsEditMode(false);
        setInitialSeoData({
            seotitle: '',
            seodescription: '',
            seokeywords: '',
          });
    };

    if (editId) {
      fetchBlogData();
    } else {
      clearForm();
    }
  }, [editId, axios, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlog((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTravelersPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTravelersPhoto(file);
      setTravelersPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    const processedDynamicContent = dynamicContent.map((block, index) => {
      const newBlock = { ...block };

      // Translate block type for the backend schema
      if (block.type === "block1") newBlock.type = "image-text";
      else if (block.type === "block2") newBlock.type = "image-text-theme";
      else if (block.type === "block3") newBlock.type = "text-theme";

      // Handle image file
      if (block.image instanceof File) {
        formData.append(`dynamic_image_${index}`, block.image);
        newBlock.image = `dynamic_image_${index}`; // Replace file with placeholder
      }
      newBlock.alt = block.alt || ""; // Ensure alt is included
      
      return newBlock;
    });

    const existingGallery = imageGallery.filter(img => img.isUrl).map(img => ({ url: img.url, fileName: img.fileName, alt: img.alt }));
    const newGalleryFiles = imageGallery.filter(img => !img.isUrl);

    const seoData = seoPageRef.current.getSEOData();

    const finalBlogData = { 
      ...blog, 
      date, 
      imageGallery: existingGallery, 
      newImageAlts: newGalleryFiles.map(img => img.alt), 
      dynamicContent: processedDynamicContent, 
      description: quillRef.current.root.innerHTML, 
      travelersName: blog.travelersName,
      seoData,
    };
    formData.append("blog", JSON.stringify(finalBlogData));

    if (image) formData.append("image", image);
    if (travelersPhoto) formData.append("travelersPhoto", travelersPhoto);

    newGalleryFiles.forEach(img => {
      formData.append("imageGallery", img.file);
    });

    try {
      let response;
      if (isEditMode) {
        response = await axios.post(`/addblog/update/${editId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        response = await axios.post("/addblog/blog", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }

      if (response.data.success) {
        toast.success(`Blog ${isEditMode ? "updated" : "added"} successfully`);
        navigate("/admin/Listblog");
      } else {
        toast.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="admin-add-tour-main">
      <div className="admin-add-tour-main-div">
        {isEditMode && (
          <button
            type="button"
            onClick={() => {
              navigate('/admin/addblog');
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
          {!imagePreview ? (
            <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
          ) : (
            <img src={imagePreview} alt="blog_thumbnail" className="admin-add-tour-thumbnail" />
          )}
          <input onChange={handleImageChange} type="file" id="image" hidden />
        </label>

        <p className="add-tour-upload-tsd">Title</p>
        <input type="text" name="title" placeholder="Type here" value={blog.title || ''} onChange={handleInputChange} required className="add-tour-uploade-title-input" />

        <p className="add-tour-upload-tsd">Sub Title</p>
        <input type="text" name="subTitle" placeholder="Type here" value={blog.subTitle || ''} onChange={handleInputChange} required className="add-tour-uploade-title-input" />

        <p className="add-tour-upload-tsd">Date</p>
        <DatePicker selected={date} onChange={(date) => setDate(date)} className="add-tour-uploade-title-input" />
         
        <p className="add-tour-upload-thumbnail-p">Travelers Photo</p>
        <label className="thumbnail-label" htmlFor="travelersPhoto">
          {!travelersPhotoPreview ? (
            <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
          ) : (
            <img src={travelersPhotoPreview} alt="travelers_photo" className="admin-add-tour-thumbnail" />
          )}
          <input onChange={handleTravelersPhotoChange} type="file" id="travelersPhoto" hidden />
        </label>

        <p className="add-tour-upload-tsd">Travelers Name</p>
        <input type="text" name="travelersName" placeholder="Travelers Name" value={blog.travelersName || ''} onChange={handleInputChange} className="add-tour-uploade-title-input" />
         
        <div className='adddiscover-discription-div' style={{background:'#d9e8f9',padding:'12px',borderRadius:'8px', marginBottom: '20px'}}>
            <p className="add-tour-upload-des-q" >Description</p>
            <div className="add-tour-upload-des">
                <div ref={editorRef} style={{ height: '300px' }}/>
            </div>
        </div>

        <div className='dynamic-block-content' style={{marginTop: '20px'}}>
          {/* <h3 style={{textAlign: 'center', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>Dynamic Content Section</h3> */}
          <DynamicContentBuilder value={dynamicContent} onChange={setDynamicContent} />
        </div>

        <div>
          <ImageGallery initialImages={imageGallery} onChange={(files) => setImageGallery(files)} />
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

        <label className="add-discover-checkbox-div">
          <input className="addtour-publish-checkbox" type="checkbox" name="isPublished" checked={blog.isPublished || false} onChange={handleInputChange} />
          Upload Now
        </label>

        <button disabled={isUploading} type="submit" className="admin-add-tour-submit-btn">
          {isUploading ? 'Uploading...' : (isEditMode ? 'Update' : 'Submit')}
        </button>
      </div>
    </form>
    </>
  );
};

export default AddBlog;
