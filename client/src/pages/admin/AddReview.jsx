import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import ImageGallery from '../../components/addmin/ImageGallery';
import SEOPage from '../../components/addmin/SEOPage';
import "./QuillEditor.css";

const AddReview = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const seoPageRef = useRef(null);

  const [review, setReview] = useState({
    travelersName: "",
    travelersTitle: "",
    reviewTitle: "",
    reviewDate: "",
    path: "",
    websiteUrl: "",
    rating: 0,
    isPublished: false,
  });
  const [description, setDescription] = useState("");
  const [travelersPicture, setTravelersPicture] = useState(null);
  const [travelersPicturePreview, setTravelersPicturePreview] = useState("");
  const [imageGallery, setImageGallery] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
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
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ header: [1, 2, 3, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'blockquote'],
            ['clean'],
          ],
        },
        placeholder: 'Write the review description here...',
      });
      quillRef.current = quill;
      
      quill.on('text-change', () => {
        setDescription(quill.root.innerHTML);
      });
    }
  }, []);

  useEffect(() => {
    const formatDateForInput = (isoDate) => {
        if (!isoDate) return '';
        try {
            return new Date(isoDate).toISOString().split('T')[0];
        } catch (e) {
            console.error("Invalid date format:", isoDate);
            return '';
        }
    };

    const fetchReviewData = async () => {
      try {
        toast.loading("Loading existing data...", { id: 'loading_review' });
        const { data } = await axios.get(`/addreview/${editId}`);
        if (data.success && data.review) {
          const reviewData = data.review;
          setReview({
            travelersName: reviewData.travelersName,
            travelersTitle: reviewData.travelersTitle,
            reviewTitle: reviewData.reviewTitle,
            reviewDate: formatDateForInput(reviewData.reviewDate),
            path: reviewData.path,
            websiteUrl: reviewData.websiteUrl,
            rating: reviewData.rating,
            isPublished: reviewData.isPublished,
          });
          if (quillRef.current) {
            quillRef.current.root.innerHTML = reviewData.description || "";
            setDescription(reviewData.description || "");
          }
          setTravelersPicturePreview(reviewData.travelersPicture);
          setImageGallery(reviewData.imageGallery ? reviewData.imageGallery.map(img => ({ ...img, preview: img.url, isUrl: true })) : []);
          setImageUrls(reviewData.imageUrls || []);
          setInitialSeoData({
            seotitle: reviewData.seotitle || '',
            seodescription: reviewData.seodescription || '',
            seokeywords: reviewData.seokeywords || '',
          });

          setIsEditMode(true);
          toast.success("Data loaded successfully!", { id: 'loading_review' });
        } else {
          toast.error("Failed to fetch review details.", { id: 'loading_review' });
          navigate("/admin/addreview");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data.", { id: 'loading_review' });
        navigate("/admin/addreview");
      }
    };

    const clearForm = () => {
        setReview({
            travelersName: "",
            travelersTitle: "",
            reviewTitle: "",
            reviewDate: "",
            path: "",
            websiteUrl: "",
            rating: 0,
            isPublished: false,
        });
        if (quillRef.current) {
            quillRef.current.root.innerHTML = "";
            setDescription("");
        }
        setTravelersPicture(null);
        setTravelersPicturePreview("");
        setImageGallery([]);
        setImageUrls([]);
        setIsEditMode(false);
        setInitialSeoData({
            seotitle: '',
            seodescription: '',
            seokeywords: '',
        });
    };

    if (editId) {
      fetchReviewData();
    } else {
      clearForm();
    }
  }, [editId, axios, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReview((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTravelersPicture(file);
      setTravelersPicturePreview(URL.createObjectURL(file));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (review.rating < 1 || review.rating > 5) {
        return toast.error("Please select a valid rating between 1 and 5");
    }
    setIsUploading(true);

    const formData = new FormData();
    
    const existingGallery = imageGallery.filter(img => img.isUrl).map(img => ({ url: img.url, fileName: img.fileName, alt: img.alt }));
    const newGalleryFiles = imageGallery.filter(img => !img.isUrl);
    
    const seoData = seoPageRef.current.getSEOData();

    const finalReviewData = { 
      ...review, 
      description,
      imageGallery: existingGallery,
      newImageAlts: newGalleryFiles.map(img => img.alt),
      imageUrls: imageUrls.filter(item => item.url.trim() !== ''),
      seoData,
    };
    formData.append("review", JSON.stringify(finalReviewData));

    if (travelersPicture) {
        formData.append("travelersPicture", travelersPicture);
    }
    
    newGalleryFiles.forEach(img => {
      formData.append("imageGallery", img.file);
    });

    try {
      let response;
      if (isEditMode) {
        response = await axios.post(`/addreview/update/${editId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        response = await axios.post("/addreview/add", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }

      if (response.data.success) {
        toast.success(`Review ${isEditMode ? "updated" : "added"} successfully`);
        navigate("/admin/listreview");
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
    <form onSubmit={handleSubmit} className="admin-add-tour-main">
      <div className="admin-add-tour-main-div">
        {isEditMode && (
          <button
            type="button"
            onClick={() => navigate('/admin/addreview')}
            className="cancel-edit-btn" style={{
              backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '8px 16px',
              borderRadius: '5px', cursor: 'pointer', marginBottom: '15px', fontWeight: '600',
              fontSize: '14px', alignSelf: 'flex-start',
            }} 
          >
            Cancel Edit
          </button>
        )}

        <p className="add-tour-upload-thumbnail-p">Traveler's Picture</p>
        <label className="thumbnail-label" htmlFor="travelersPicture">
          {!travelersPicturePreview ? (
            <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
          ) : (
            <img src={travelersPicturePreview} alt="traveler_picture" className="admin-add-tour-thumbnail" />
          )}
          <input onChange={handlePictureChange} type="file" id="travelersPicture" hidden />
        </label>

        <p className="add-tour-upload-tsd">Traveler's Name</p>
        <input type="text" name="travelersName" placeholder="Enter traveler's name" value={review.travelersName} onChange={handleInputChange} required className="add-tour-uploade-title-input" />

        <p className="add-tour-upload-tsd">Traveler's Title</p>
        <input type="text" name="travelersTitle" placeholder="e.g., Country or Designation" value={review.travelersTitle} onChange={handleInputChange} className="add-tour-uploade-title-input" />

        <p className="add-tour-upload-tsd">Review Title</p>
        <input type="text" name="reviewTitle" placeholder="Enter review title" value={review.reviewTitle} onChange={handleInputChange} required className="add-tour-uploade-title-input" />
        
        <p className="add-tour-upload-tsd">Review Date</p>
        <input type="date" name="reviewDate" value={review.reviewDate} onChange={handleInputChange} className="add-tour-uploade-title-input" />

        <div className='adddiscover-discription-div' style={{background:'#d9e8f9',padding:'12px',borderRadius:'8px', marginBottom: '20px'}}>
            <p className="add-tour-upload-des-q" >Description</p>
            <div className="add-tour-upload-des">
                <div ref={editorRef} style={{ height: '250px' }}/>
            </div>
        </div>

        <p className="add-tour-upload-tsd">Internal Path</p>
        <input type="text" name="path" placeholder="e.g., /blog/Travelers-Name" value={review.path} onChange={handleInputChange} className="add-tour-uploade-title-input" />

        <p className="add-tour-upload-tsd">External Website URL</p>
        <input type="url" name="websiteUrl" placeholder="e.g., https://example.com" value={review.websiteUrl} onChange={handleInputChange} className="add-tour-uploade-title-input" />
        
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

        <p className="add-tour-upload-tsd" style={{fontSize:'20px', marginTop: '20px'}}>Rating</p>
        <small className="text-xs text-gray-500 mt-1">Click on a star to set the rating</small>
        <div className="flex gap-1 cursor-pointer text-2xl my-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setReview(prev => ({ ...prev, rating: star }))}
              style={{ color: star <= review.rating ? '#ffc107' : '#e4e5e9', transition: 'color 0.2s' }}
            >
              ★
            </span>
          ))}
          <span className="text-sm text-gray-600 ml-2">
            {review.rating ? `${review.rating}/5` : 'No rating'}
          </span>
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
          <input className="addtour-publish-checkbox" type="checkbox" name="isPublished" checked={review.isPublished} onChange={handleInputChange} />
          Publish Now
        </label>

        <button disabled={isUploading} type="submit" className="admin-add-tour-submit-btn">
          {isUploading ? 'Uploading...' : (isEditMode ? 'Update Review' : 'Submit Review')}
        </button>
      </div>
    </form>
  );
};

export default AddReview;
