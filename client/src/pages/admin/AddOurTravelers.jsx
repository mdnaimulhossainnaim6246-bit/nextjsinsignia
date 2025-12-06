import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.core.css';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import SEOPage from '../../components/addmin/SEOPage';

const AddOurTravelers = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const seoPageRef = useRef(null);

  const { axios } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const ourTravelersId = searchParams.get('id');

  const [isEditMode, setIsEditMode] = useState(false);

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [existingProfileImage, setExistingProfileImage] = useState('');
  const [socialMedia, setSocialMedia] = useState({
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    x: '',
  });
  const [socialMediaCheckboxes, setSocialMediaCheckboxes] = useState({
    instagram: false,
    facebook: false,
    linkedin: false,
    youtube: false,
    x: false,
  });
  const [images, setImages] = useState([null, null, null, null, null]);
  const [existingImages, setExistingImages] = useState([]);
  const [initialSeoData, setInitialSeoData] = useState({
    seotitle: '',
    seodescription: '',
    seokeywords: '',
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link'],
        ['blockquote', 'code-block'],
        ['clean'],
      ];

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: { toolbar: toolbarOptions },
      });
    }
  }, []);

  useEffect(() => {
    if (!ourTravelersId) {
      setIsEditMode(false);
      return;
    }

    const fetchOurTraveler = async () => {
      try {
        const { data } = await axios.get(`/addourtravelers/${ourTravelersId}`);
        if (data.success) {
          const ourTraveler = data.ourTraveler;
          setTitle(ourTraveler.title || '');
          setSubTitle(ourTraveler.subTitle || '');
          setIsPublished(ourTraveler.isPublished || false);
          setExistingImage(ourTraveler.image || '');
          setExistingProfileImage(ourTraveler.profileChoose || '');
          setSocialMedia(ourTraveler.socialMedia || { instagram: '', facebook: '', linkedin: '', youtube: '', x: '' });
          setExistingImages(ourTraveler.images || []);
          setInitialSeoData({
            seotitle: ourTraveler.seotitle || '',
            seodescription: ourTraveler.seodescription || '',
            seokeywords: ourTraveler.seokeywords || '',
          });
          
          const newSocialMediaCheckboxes = {};
          for (const key in ourTraveler.socialMedia) {
            if (ourTraveler.socialMedia[key]) {
              newSocialMediaCheckboxes[key] = true;
            }
          }
          setSocialMediaCheckboxes(newSocialMediaCheckboxes);

          setIsEditMode(true);
          if (quillRef.current) {
            quillRef.current.root.innerHTML = ourTraveler.description || '';
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchOurTraveler();
  }, [ourTravelersId, axios]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!isPublished) {
      toast.error("Please check 'Upload Now' to continue.");
      return;
    }

    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }

    setIsUploading(true);

    try {
      const seoData = seoPageRef.current.getSEOData();
      const ourTraveler = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        isPublished,
        socialMedia,
        seoData,
      };

      const formData = new FormData();
      formData.append('ourTraveler', JSON.stringify(ourTraveler));

      if (image) {
        formData.append('image', image);
      }
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      images.forEach((img, index) => {
        if (img) {
          formData.append(`image${index + 1}`, img);
        }
      });

      let response;
      if (isEditMode && ourTravelersId) {
        response = await axios.put(`/addourtravelers/${ourTravelersId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        response = await axios.post('/addourtravelers', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        clearForm();
        navigate('/admin/listourtravelers');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const clearForm = () => {
    setTitle('');
    setSubTitle('');
    setImage(null);
    setExistingImage('');
    if (quillRef.current) quillRef.current.root.innerHTML = '';
    setIsPublished(false);
    setIsEditMode(false);
    setProfileImage(null);
    setExistingProfileImage('');
    setSocialMedia({ instagram: '', facebook: '', linkedin: '', youtube: '', x: '' });
    setSocialMediaCheckboxes({ instagram: false, facebook: false, linkedin: false, youtube: false, x: false });
    setImages([null, null, null, null, null]);
    setExistingImages([]);
  };

  const handleSocialMediaCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSocialMediaCheckboxes(prev => ({ ...prev, [name]: checked }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialMedia(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      const newImages = [...images];
      newImages[index] = e.target.files[0];
      setImages(newImages);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="admin-add-tour-main">
      <div className="admin-add-tour-main-div">

        {isEditMode && (
          <button
            onClick={() => {
              clearForm();
              navigate('/admin/addourtravelers');
            }}
            type="button"
            style={{
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

        {/* Thumbnail Upload */}
        <p className="add-tour-uploade-thumbnail-p">Upload Member Image</p>
        <label className="thumbnail-label" htmlFor="image">
          {!image && !existingImage ? (
            <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
          ) : image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="ourtravelers_thumbnail"
              className="admin-add-tour-thumbnail"
            />
          ) : (
            <img
              src={existingImage}
              alt="ourtravelers_thumbnail"
              className="admin-add-tour-thumbnail"
            />
          )}
          <input
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            type="file"
            id="image"
            name="image"
            hidden
          />
        </label>
        
        {/* Travelers Profile Image */}
        <p className="add-tour-uploade-tsd">Traveler's Profile Image</p>
        <label className="thumbnail-label" htmlFor="profileImage">
          {!profileImage && !existingProfileImage ? (
            <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
          ) : profileImage ? (
            <img
              src={URL.createObjectURL(profileImage)}
              alt="profile_thumbnail"
              className="admin-add-tour-thumbnail"
            />
          ) : (
            <img
              src={existingProfileImage}
              alt="profile_thumbnail"
              className="admin-add-tour-thumbnail"
            />
          )}
          <input
            onChange={(e) => {
              setProfileImage(e.target.files[0]);
            }}
            type="file"
            id="profileImage"
            name="profileImage"
            hidden
          />
        </label>

        {/* Title */}
        <p className="add-tour-uploade-tsd">Name</p>
        <input
          type="text"
          placeholder="Type here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
          className="add-tour-uploade-title-input"
        />

        {/* Sub Title */}
        <p className="add-tour-uploade-tsd">Designation</p>
        <input
          type="text"
          placeholder="Type here"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
          className="add-tour-uploade-title-input"
        />

        {/* Description */}
        <p className="add-tour-uploade-tsd">Description</p>
        <div className="add-tour-uploade-des" ref={editorRef}></div>

        {/* Social Media */}
        <p className="add-tour-uploade-tsd">Social Media</p>
        <div>
          {Object.keys(socialMedia).map(platform => (
            <div key={platform}>
              <label>
                <input
                  type="checkbox"
                  name={platform}
                  checked={socialMediaCheckboxes[platform]}
                  onChange={handleSocialMediaCheckboxChange}
                />
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </label>
              {socialMediaCheckboxes[platform] && (
                <input
                  type="text"
                  name={platform}
                  placeholder={`${platform} URL`}
                  value={socialMedia[platform]}
                  onChange={handleSocialMediaChange}
                  className="add-tour-uploade-title-input"
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Image Fields */}
        <p className="add-tour-uploade-tsd">Images</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[...Array(5)].map((_, index) => (
            <div key={index}>
              <label className="thumbnail-label" htmlFor={`image${index + 1}`}>
                {!images[index] && !existingImages[index] ? (
                  <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
                ) : images[index] ? (
                  <img
                    src={URL.createObjectURL(images[index])}
                    alt={`preview ${index + 1}`}
                    className="admin-add-tour-thumbnail"
                  />
                ) : (
                  <img
                    src={existingImages[index]}
                    alt={`existing ${index + 1}`}
                    className="admin-add-tour-thumbnail"
                  />
                )}
                <input
                  onChange={(e) => handleImageChange(e, index)}
                  type="file"
                  id={`image${index + 1}`}
                  name={`image${index + 1}`}
                  hidden
                />
              </label>
            </div>
          ))}
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
         
        
        {/* Publish Checkbox */}
        <label
          className="add-tour-checkbox-div"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}
        >
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="addtour-publish-checkbox"
          />
          Upload Now
        </label>

        {/* Submit Button */}
        <button
          disabled={isUploading}
          type="submit"
          className="admin-add-tour-submit-btn"
        >
          {isUploading ? 'Uploading...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default AddOurTravelers;
