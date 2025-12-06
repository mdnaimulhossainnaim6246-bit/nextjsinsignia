import React, { useEffect, useState, useRef } from 'react';
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
import SEOPage from '../../components/addmin/SEOPage';

const AddTravelguide = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const seoPageRef = useRef(null);

  const [guide, setGuide] = useState({});
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageGallery, setImageGallery] = useState([]);
  const [imageUrls, setImageUrls] = useState([]); // New state for image URLs
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
              [{ color: [] }, { background: [] }],
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

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        toast.loading("Loading existing data...", { id: 'loading_guide' });
        const { data } = await axios.get(`/addguide/${editId}`);
        if (data.success && data.guide) {
          const guideData = data.guide;
          
          setGuide(guideData);

          if (quillRef.current) {
            quillRef.current.root.innerHTML = guideData.description || "";
          }
          setImagePreview(guideData.image);
          setImageGallery(guideData.imageGallery ? guideData.imageGallery.map(img => ({ ...img, preview: img.url, isUrl: true })) : []);
          setImageUrls(guideData.imageUrls || []); // Set imageUrls from fetched data
          
          const translatedDynamicContent = (guideData.dynamicContent || []).map(block => {
              const newBlock = { ...block };
              if (block.type === "image-text") newBlock.type = "block1";
              else if (block.type === "image-text-theme") newBlock.type = "block2";
              else if (block.type === "text-theme") newBlock.type = "block3";
              newBlock.alt = block.alt || "";
              return newBlock;
          });
          setDynamicContent(translatedDynamicContent);
          
          setInitialSeoData({
            seotitle: guideData.seotitle || '',
            seodescription: guideData.seodescription || '',
            seokeywords: guideData.seokeywords || '',
          });

          setIsEditMode(true);
          toast.success("Data loaded successfully!", { id: 'loading_guide' });
        } else {
          toast.error("Failed to fetch guide details.", { id: 'loading_guide' });
          navigate("/admin/addtravelguide");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.", { id: 'loading_guide' });
        navigate("/admin/addtravelguide");
      }
    };

    const clearForm = () => {
        setGuide({
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
        setImageUrls([]); // Clear image urls
        setDynamicContent([]);
        setIsEditMode(false);
        setInitialSeoData({
            seotitle: '',
            seodescription: '',
            seokeywords: '',
          });
    };

    if (editId) {
      fetchGuideData();
    } else {
      clearForm();
    }
  }, [editId, axios, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGuide((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // --- Handlers for Image URLs ---
  const handleImageUrlChange = (index, field, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index][field] = value;
    setImageUrls(newImageUrls);
  };

  const handleAddImageUrl = () => {
    setImageUrls([...imageUrls, { url: '', alt: '' }]);
  };

  const handleRemoveImageUrl = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
  };
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    const processedDynamicContent = dynamicContent.map((block, index) => {
      const newBlock = { ...block };
      if (block.type === "block1") newBlock.type = "image-text";
      else if (block.type === "block2") newBlock.type = "image-text-theme";
      else if (block.type === "block3") newBlock.type = "text-theme";

      if (block.image instanceof File) {
        formData.append(`dynamic_image_${index}`, block.image);
        newBlock.image = `dynamic_image_${index}`;
      }
      newBlock.alt = block.alt || "";
      
      return newBlock;
    });

    const existingGallery = imageGallery.filter(img => img.isUrl).map(img => ({ url: img.url, fileName: img.fileName, alt: img.alt }));
    const newGalleryFiles = imageGallery.filter(img => !img.isUrl);

    const seoData = seoPageRef.current.getSEOData();

    const finalGuideData = { 
      ...guide, 
      imageGallery: existingGallery, 
      newImageAlts: newGalleryFiles.map(img => img.alt), 
      dynamicContent: processedDynamicContent, 
      description: quillRef.current.root.innerHTML,
      imageUrls: imageUrls.filter(item => item.url.trim() !== ''), // Add image urls
      seoData,
    };
    formData.append("guide", JSON.stringify(finalGuideData));

    if (image) formData.append("image", image);

    newGalleryFiles.forEach(img => {
      formData.append("imageGallery", img.file);
    });

    try {
      let response;
      if (isEditMode) {
        response = await axios.post(`/addguide/update/${editId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        response = await axios.post("/addguide/guide", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }

      if (response.data.success) {
        toast.success(`Guide ${isEditMode ? "updated" : "added"} successfully`);
        navigate("/admin/ListTravelguide");
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
            onClick={() => navigate('/admin/addtravelguide')}
            className="cancel-edit-btn" style={{
              backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '8px 16px',
              borderRadius: '5px', cursor: 'pointer', marginBottom: '15px', fontWeight: '600',
              fontSize: '14px', alignSelf: 'flex-start',
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
            <img src={imagePreview} alt="guide_thumbnail" className="admin-add-tour-thumbnail" />
          )}
          <input onChange={handleImageChange} type="file" id="image" hidden />
        </label>

        <p className="add-tour-upload-tsd">Title</p>
        <input type="text" name="title" placeholder="Type here" value={guide.title || ''} onChange={handleInputChange} required className="add-tour-uploade-title-input" />

        <p className="add-tour-upload-tsd">Sub Title</p>
        <input type="text" name="subTitle" placeholder="Type here" value={guide.subTitle || ''} onChange={handleInputChange} required className="add-tour-uploade-title-input" />
         
        <div className='adddiscover-discription-div' style={{background:'#d9e8f9',padding:'12px',borderRadius:'8px', marginBottom: '20px'}}>
            <p className="add-tour-upload-des-q" >Description</p>
            <div className="add-tour-upload-des">
                <div ref={editorRef} style={{ height: '300px' }}/>
            </div>
        </div>

        {/* --- Image URL Section --- */}
        <div className="add-tour-upload-tsd" style={{marginTop:'20px'}}>
            <p className="add-tour-upload-des-q">Image URLs</p>
            {imageUrls.map((item, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <input
                            type="url"
                            placeholder="Image URL"
                            value={item.url}
                            onChange={(e) => handleImageUrlChange(index, 'url', e.target.value)}
                            className="add-tour-uploade-title-input"
                            style={{ flex: 1, marginRight: '10px' }}
                        />
                        <input
                            type="text"
                            placeholder="Alt Text"
                            value={item.alt}
                            onChange={(e) => handleImageUrlChange(index, 'alt', e.target.value)}
                            className="add-tour-uploade-title-input"
                            style={{ flex: 1 }}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveImageUrl(index)}
                            style={{ padding: '8px 12px', cursor: 'pointer', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', marginLeft: '10px' }}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddImageUrl}
                style={{ padding: '8px 16px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px' }}
            >
                + Add Image URL
            </button>
        </div>
        {/* ----------------------- */}

        <div className='dynamic-block-content' style={{marginTop: '20px'}}>
          <h3 style={{textAlign: 'center', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold'}}>Dynamic Content Section</h3>
          <DynamicContentBuilder value={dynamicContent} onChange={setDynamicContent} />
        </div>

        <div>
          <ImageGallery initialImages={imageGallery} onChange={(files) => setImageGallery(files)} />
        </div>

         <div>
           <SEOPage
             ref={seoPageRef}
             defaultTitle={initialSeoData.seotitle}
             defaultDescription={initialSeoData.seodescription}
             defaultKeywords={initialSeoData.seokeywords}
           />
         </div>

        <label className="add-discover-checkbox-div">
          <input className="addtour-publish-checkbox" type="checkbox" name="isPublished" checked={guide.isPublished || false} onChange={handleInputChange} />
          Publish Now
        </label>

        <button disabled={isUploading} type="submit" className="admin-add-tour-submit-btn">
          {isUploading ? 'Uploading...' : (isEditMode ? 'Update Guide' : 'Submit Guide')}
        </button>
      </div>
    </form>
    </>
  );
};

export default AddTravelguide;
