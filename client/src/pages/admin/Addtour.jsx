


// src/pages/admin/Addtour.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.core.css';
//  import './quill-castom.css';

import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Addtour = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const { axios } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const tourId = searchParams.get('id');

  const [isEditMode, setIsEditMode] = useState(false);

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState('');
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ['link','video'],
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
    const observer = new MutationObserver(() => {
      const input = document.querySelector('.ql-tooltip input');
      if (input) {
        input.style.backgroundColor = '#2a2a2a';
        input.style.color = '#f0f0f0';
        input.style.border = '1px solid #666';
        input.style.padding = '8px 10px';
        input.style.borderRadius = '6px';
        input.style.fontSize = '14px';
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!tourId) {
      setIsEditMode(false);
      return;
    }

    const fetchTour = async () => {
      try {
        const { data } = await axios.get(`/addtour/${tourId}`);
        if (data.success) {
          const tour = data.tour;
          setTitle(tour.title || '');
          setSubTitle(tour.subTitle || '');
          setIsPublished(tour.isPublished || false);
          setExistingImage(tour.image || '');
          setIsEditMode(true);
          if (quillRef.current) {
            quillRef.current.root.innerHTML = tour.description || '';
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchTour();
  }, [tourId, axios]);

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
      const tour = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        isPublished,
      };

      const formData = new FormData();
      formData.append('tour', JSON.stringify(tour));

      if (image) {
        formData.append('image', image);
      }

      let response;
      if (isEditMode && tourId) {
        response = await axios.put(`/addtour/${tourId}`, formData);
      } else {
        response = await axios.post('/addtour', formData);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        clearForm();
        navigate('/admin/listtour');
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
  };

  return (
    <form onSubmit={onSubmitHandler} className="admin-add-tour-main">
      <div className="admin-add-tour-main-div">

        {isEditMode && (
          <button
            onClick={() => {
              clearForm();
              navigate('/admin/Addtour');
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
        <p className="add-tour-uploade-thumbnail-p">Upload City Thumbnail</p>
        <label className="thumbnail-label" htmlFor="image">
          {!image && !existingImage ? (
            <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
          ) : image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="tour_thumbnail"
              className="admin-add-tour-thumbnail"
            />
          ) : (
            <img
              src={existingImage}
              alt="tour_thumbnail"
              className="admin-add-tour-thumbnail"
            />
          )}
          <input
            onChange={(e) => {
              setImage(e.target.files[0]);
              setExistingImage('');
            }}
            type="file"
            id="image"
            hidden
          />
        </label>

        {/* Title */}
        <p className="add-tour-uploade-tsd">Title</p>
        <input
          type="text"
          placeholder="Type here"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
          className="add-tour-uploade-title-input"
        />

        {/* Sub Title */}
        <p className="add-tour-uploade-tsd">Sub title</p>
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

export default Addtour;

