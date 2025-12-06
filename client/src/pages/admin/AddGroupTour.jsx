// import React, { useEffect, useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import ListGroupTour from './ListGroupTour';

// const MONTHS = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December'
// ];

// const AddGroupTour = () => {
//   const { axios } = useAppContext();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const editId = searchParams.get('id');

//   const [tour, setTour] = useState({
//     title: '',
//     isPublished: false,
//     startDate: null,
//     endDate: null,
//   });
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [years, setYears] = useState([]);
//   const [yearInput, setYearInput] = useState('');
//   const [selectedYear, setSelectedYear] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);

//   // Fetch tour data for editing
//   useEffect(() => {
//     const fetchTourData = async () => {
//       try {
//         toast.loading('Loading existing data...', { id: 'loading_tour' });
//         const { data } = await axios.get(`/addgrouptour/${editId}`);
//         if (data.success && data.tour) {
//           const tourData = data.tour;
//           setTour({
//             title: tourData.title || '',
//             isPublished: tourData.isPublished || false,
//             startDate: tourData.startDate ? new Date(tourData.startDate) : null,
//             endDate: tourData.endDate ? new Date(tourData.endDate) : null,
//           });
//           setDescription(tourData.description || '');
//           setImagePreview(tourData.image);
//           setSelectedYear(tourData.year);
//           setSelectedMonth(tourData.month || MONTHS[new Date().getMonth()]);
//           setIsEditMode(true);
//           toast.success('Data loaded successfully!', { id: 'loading_tour' });
//         } else {
//           toast.error('Failed to fetch tour details.', { id: 'loading_tour' });
//           navigate('/admin/addgrouptour');
//         }
//       } catch (error) {
//         toast.error('An error occurred while fetching data.', { id: 'loading_tour' });
//         navigate('/admin/addgrouptour');
//       }
//     };

//     const clearForm = () => {
//       setTour({
//         title: '',
//         isPublished: false,
//         startDate: null,
//         endDate: null,
//       });
//       setDescription('');
//       setImage(null);
//       setImagePreview('');
//       setIsEditMode(false);
//       setSelectedYear('');
//       setSelectedMonth(MONTHS[new Date().getMonth()]);
//     };

//     if (editId) {
//       fetchTourData();
//     } else {
//       clearForm();
//     }
//   }, [editId, axios, navigate]);

//   // Fetch years for category selection
//   const fetchYears = async () => {
//     try {
//       const { data } = await axios.get('/api/years');
//       if (data.success) {
//         setYears(data.years);
//         if (data.years.length && !selectedYear) {
//           setSelectedYear(data.years[0].year);
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error('Error fetching years.');
//     }
//   };

//   useEffect(() => {
//     fetchYears();
//   }, []);

//   const handleAddYear = async (e) => {
//     e.preventDefault();
//     if (!yearInput) return;
//     try {
//       setIsUploading(true);
//       const { data } = await axios.post('/api/years', { year: Number(yearInput) });
//       if (data.success) {
//         setYearInput('');
//         fetchYears();
//         toast.success('Year added successfully');
//       } else {
//         toast.error(data.message || 'Error adding year');
//       }
//     } catch (err) {
//       toast.error(err?.response?.data?.message || 'Error adding year');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDeleteYear = async (id) => {
//     if (!window.confirm('Delete this year and its tours?')) return;
//     try {
//       const { data } = await axios.delete(`/api/years/${id}`);
//       if (data.success) {
//         fetchYears();
//         toast.success('Year deleted successfully');
//       } else {
//         toast.error('Error deleting year');
//       }
//     } catch (err) {
//       toast.error('Error deleting year');
//       console.error(err);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setTour((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsUploading(true);

//     const formData = new FormData();
//     const finalTourData = { ...tour, description, year: selectedYear, month: selectedMonth };
//     formData.append('tour', JSON.stringify(finalTourData));

//     if (image) formData.append('image', image);

//     try {
//       let response;
//       if (isEditMode) {
//         response = await axios.post(`/addgrouptour/update/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
//       } else {
//         response = await axios.post('/addgrouptour/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
//       }

//       if (response.data.success) {
//         toast.success(`Group Tour ${isEditMode ? 'updated' : 'added'} successfully`);
//         navigate('/admin/listgrouptour');
//         setSelectedMonth(MONTHS[new Date().getMonth()]); // Reset selected month
//       } else {
//         toast.error(response.data.message || 'An error occurred');
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || 'An error occurred');
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const modules = {
//     toolbar: [
//       [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
//       [{size: []}],
//       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
//       [{ 'color': [] }, { 'background': [] }],
//       [{'list': 'ordered'}, {'list': 'bullet'}, 
//        {'indent': '-1'}, {'indent': '+1'}],
//       ['link'],
//       ['clean']
//     ],
//   };

//   return (
//     <div className="admin-add-tour-main">
//       <div className="admin-add-tour-main-div">
//         {isEditMode && (
//           <button
//             type="button"
//             onClick={() => {
//               navigate('/admin/addgrouptour');
//             }}
//             className="cancel-edit-btn"
//           >
//             Cancel Edit
//           </button>
//         )}

//         <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
//           <label>Add / Delete Year Category</label>
//           <div className="row">
//             <input type="number" placeholder="e.g. 2025" value={yearInput} onChange={(e) => setYearInput(e.target.value)} />
//             <button onClick={handleAddYear} disabled={isUploading}>
//               {isUploading ? 'Adding...' : 'Add Year'}
//             </button>
//           </div>

//           <div className="year-list">
//             {years.map((y) => (
//               <div key={y._id} className="year-pill">
//                 <span onClick={() => setSelectedYear(y.year)} style={{ cursor: 'pointer', fontWeight: selectedYear == y.year ? 700 : 500 }}>
//                   {y.year}
//                 </span>
//                 <button className="secondary" onClick={() => handleDeleteYear(y._id)}>
//                   X
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <p className="add-tour-upload-thumbnail-p">Upload Thumbnail</p>
//           <label className="thumbnail-label" htmlFor="image">
//             {!imagePreview ? (
//               <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
//             ) : (
//               <img src={imagePreview} alt="tour_thumbnail" className="admin-add-tour-thumbnail" />
//             )}
//             <input onChange={handleImageChange} type="file" id="image" hidden />
//           </label>

//           <p className="add-tour-upload-tsd">Title</p>
//           <input type="text" name="title" placeholder="Type here" value={tour.title || ''} onChange={handleInputChange} required className="add-tour-uploade-title-input" />

//           <p className="add-tour-upload-tsd">Select Year</p>
//           <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="add-tour-uploade-title-input">
//             <option value="">--Select Year--</option>
//             {years.map((y) => (
//               <option key={y._id} value={y.year}>
//                 {y.year}
//               </option>
//             ))}
//           </select>

//           <p className="add-tour-upload-tsd">Select Month</p>
//           <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="add-tour-uploade-title-input">
//             {MONTHS.map((m) => (
//               <option key={m} value={m}>
//                 {m}
//               </option>
//             ))}
//           </select>

//           <p className="add-tour-upload-tsd">Start Date</p>
//           <DatePicker selected={tour.startDate} onChange={(date) => setTour((prev) => ({ ...prev, startDate: date }))} className="add-tour-uploade-title-input" />

//           <p className="add-tour-upload-tsd">End Date</p>
//           <DatePicker selected={tour.endDate} onChange={(date) => setTour((prev) => ({ ...prev, endDate: date }))} className="add-tour-uploade-title-input" />

//           <div className="adddiscover-discription-div">
//             <p className="add-tour-upload-des-q">Description</p>
//             <div className="add-tour-upload-des">
//               <ReactQuill theme="snow" value={description} onChange={setDescription} modules={modules} />
//             </div>
//           </div>

//           <label className="add-discover-checkbox-div">
//             <input className="addtour-publish-checkbox" type="checkbox" name="isPublished" checked={tour.isPublished || false} onChange={handleInputChange} />
//             Upload Now
//           </label>

//           <button disabled={isUploading} type="submit" className="admin-add-tour-submit-btn">
//             {isUploading ? 'Uploading...' : isEditMode ? 'Update' : 'Submit'}
//           </button>
//         </form>
//       </div>
     
//     </div>
//   );
// };

// export default AddGroupTour;

// pages/admin/AddGroupTour.jsx

import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./QuillEditor.css";

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const AddGroupTour = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');

  const [tour, setTour] = useState({
    title: '',
    isPublished: false,
    startDate: null,
    endDate: null,
  });
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [years, setYears] = useState([]);
  const [yearInput, setYearInput] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);

  // Quill toolbar modules
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ color: [] }, { background: [] }],
      ['link', 'video', 'code-block'],
      ['clean'],
    ],
  };

  // Fetch tour data for editing
  useEffect(() => {
    const fetchTourData = async () => {
      try {
        toast.loading('Loading existing data...', { id: 'loading_tour' });
        const { data } = await axios.get(`/addgrouptour/${editId}`);
        if (data.success && data.tour) {
          const tourData = data.tour;
          setTour({
            title: tourData.title || '',
            isPublished: tourData.isPublished || false,
            startDate: tourData.startDate ? new Date(tourData.startDate) : null,
            endDate: tourData.endDate ? new Date(tourData.endDate) : null,
          });
          setDescription(tourData.description || '');
          setImagePreview(tourData.image);
          setSelectedYear(tourData.year);
          setSelectedMonth(tourData.month || MONTHS[new Date().getMonth()]);
          setIsEditMode(true);
          toast.success('Data loaded successfully!', { id: 'loading_tour' });
        } else {
          toast.error('Failed to fetch tour details.', { id: 'loading_tour' });
          navigate('/admin/addgrouptour');
        }
      } catch (error) {
        toast.error('An error occurred while fetching data.', { id: 'loading_tour' });
        navigate('/admin/addgrouptour');
      }
    };

    const clearForm = () => {
      setTour({
        title: '',
        isPublished: false,
        startDate: null,
        endDate: null,
      });
      setDescription('');
      setImage(null);
      setImagePreview('');
      setIsEditMode(false);
      setSelectedYear('');
      setSelectedMonth(MONTHS[new Date().getMonth()]);
    };

    if (editId) {
      fetchTourData();
    } else {
      clearForm();
    }
  }, [editId, axios, navigate]);

  // Fetch years for category selection
  const fetchYears = async () => {
    try {
      const { data } = await axios.get('/api/years');
      if (data.success) {
        setYears(data.years);
        if (data.years.length && !selectedYear) {
          setSelectedYear(data.years[0].year);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching years.');
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  const handleAddYear = async (e) => {
    e.preventDefault();
    if (!yearInput) return;
    try {
      setIsUploading(true);
      const { data } = await axios.post('/api/years', { year: Number(yearInput) });
      if (data.success) {
        setYearInput('');
        fetchYears();
        toast.success('Year added successfully');
      } else {
        toast.error(data.message || 'Error adding year');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Error adding year');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteYear = async (id) => {
    if (!window.confirm('Delete this year and its tours?')) return;
    try {
      const { data } = await axios.delete(`/api/years/${id}`);
      if (data.success) {
        fetchYears();
        toast.success('Year deleted successfully');
      } else {
        toast.error('Error deleting year');
      }
    } catch (err) {
      toast.error('Error deleting year');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTour((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    const finalTourData = { ...tour, description, year: selectedYear, month: selectedMonth };
    formData.append('tour', JSON.stringify(finalTourData));

    if (image) formData.append('image', image);

    try {
      let response;
      if (isEditMode) {
        response = await axios.post(`/addgrouptour/update/${editId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        response = await axios.post('/addgrouptour/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      if (response.data.success) {
        toast.success(`Group Tour ${isEditMode ? 'updated' : 'added'} successfully`);
        navigate('/admin/listgrouptour');
        setSelectedMonth(MONTHS[new Date().getMonth()]);
      } else {
        toast.error(response.data.message || 'An error occurred');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="admin-add-tour-main">
      <div className="admin-add-tour-main-div">
        {isEditMode && (
          <button
            type="button"
            onClick={() => navigate('/admin/addgrouptour')}
            className="cancel-edit-btn"
          >
            Cancel Edit
          </button>
        )}

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
          <label>Add / Delete Year Category</label>
          <div className="row">
            <input style={{padding:'3px 6px', border:'1px solid #fff'}} type="number" placeholder="e.g. 2025" value={yearInput} onChange={(e) => setYearInput(e.target.value)} />
            {/* <button onClick={handleAddYear} disabled={isUploading}>
              {isUploading ? 'Adding...' : 'Add Year'}
            </button> */}
            <button
  onClick={handleAddYear}
  disabled={isUploading}
  style={{
    padding: "8px 2px",
    backgroundColor: isUploading ? "#a3a3a3" : "#6d28d9", 
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: isUploading ? "not-allowed" : "pointer",
    opacity: isUploading ? 0.7 : 1,
    transition: "all 0.25s ease",
    boxShadow: isUploading
      ? "0 0 0 rgba(0,0,0,0)"
      : "0 2px 6px rgba(0,0,0,0.15)"
  }}
  onMouseEnter={e => {
    if (!isUploading) e.currentTarget.style.backgroundColor = "#5b21b6";
  }}
  onMouseLeave={e => {
    if (!isUploading) e.currentTarget.style.backgroundColor = "#6d28d9";
  }}
>
  {isUploading ? "Adding..." : "Add Year"}
</button>

          </div>

          <div className="year-list">
            {years.map((y) => (
              <div key={y._id} className="year-pill">
                <span onClick={() => setSelectedYear(y.year)} style={{ cursor: 'pointer',color:"#33ff22aa" ,fontWeight: selectedYear == y.year ? 700 : 500 }}>
                  {y.year}
                </span>
                <button style={{color:"#ff0000ee",marginLeft:'7px',cursor:'pointer'}} className="secondary" onClick={() => handleDeleteYear(y._id)}>X</button>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <p className="add-tour-upload-thumbnail-p">Upload Thumbnail</p>
          <label className="thumbnail-label" htmlFor="image">
            {!imagePreview ? (
              <i className="thumbnail-icon fa-solid fa-cloud-arrow-up"></i>
            ) : (
              <img src={imagePreview} alt="tour_thumbnail" className="admin-add-tour-thumbnail" />
            )}
            <input  onChange={handleImageChange} type="file" id="image" hidden />
          </label>

          <p className="add-tour-upload-tsd">Title</p>
          <input type="text" name="title" placeholder="Type here" value={tour.title || ''} onChange={handleInputChange} required className="add-tour-uploade-title-input" />

          <p className="add-tour-upload-tsd">Select Year</p>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="add-tour-uploade-title-input">
            <option value="">--Select Year--</option>
            {years.map((y) => (
              <option key={y._id} value={y.year}>{y.year}</option>
            ))}
          </select>

          <p className="add-tour-upload-tsd">Select Month</p>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="add-tour-uploade-title-input">
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>

          <p className="add-tour-upload-tsd">Start Date</p>
          <DatePicker selected={tour.startDate} onChange={(date) => setTour((prev) => ({ ...prev, startDate: date }))} className="add-tour-uploade-title-input" />

          <p className="add-tour-upload-tsd">End Date</p>
          <DatePicker selected={tour.endDate} onChange={(date) => setTour((prev) => ({ ...prev, endDate: date }))} className="add-tour-uploade-title-input" />

          <div className="adddiscover-discription-div">
            <p className="add-tour-upload-des-q">Description</p>
            <div className="add-tour-upload-des">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={modules}
                placeholder="Write Introduction here..."
              />
            </div>
          </div>

          <label className="add-discover-checkbox-div">
            <input className="addtour-publish-checkbox" type="checkbox" name="isPublished" checked={tour.isPublished || false} onChange={handleInputChange} />
            Upload Now
          </label>

          <button disabled={isUploading} type="submit" className="admin-add-tour-submit-btn">
            {isUploading ? 'Uploading...' : isEditMode ? 'Update' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroupTour;
