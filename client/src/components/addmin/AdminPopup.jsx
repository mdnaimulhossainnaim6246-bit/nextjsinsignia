import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './AdminPopup.css';
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;


const popupTypes = [
    { value: 'offer', label: 'Offer/Discount' },
    { value: 'notice', label: 'Notice' },
    { value: 'featured', label: 'Featured Destination' },
    { value: 'tip', label: 'Travel Tip' },
];

const AdminPopup = () => {
    const [popups, setPopups] = useState([]);
    const [selectedPopupType, setSelectedPopupType] = useState(popupTypes[0].value);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        viewLink: '',
        days: 0,
        hours: 0,
    });

    useEffect(() => {
        fetchPopups();
    }, []);

    useEffect(() => {
        const currentPopup = popups.find(p => p.popupType === selectedPopupType);
        if (currentPopup) {
            setFormData({
                title: currentPopup.title,
                content: currentPopup.content,
                image: currentPopup.image || '',
                viewLink: currentPopup.viewLink || '',
                days: currentPopup.timer.days || 0,
                hours: currentPopup.timer.hours || 0,
            });
        } else {
            resetForm();
        }
    }, [selectedPopupType, popups]);

    const fetchPopups = async () => {
        try {
            // const response = await axios.get('http://localhost:5000/addpopup/popups');
            const response = await axios.get(`${BASE_URL}addpopup/popups`);
            // const response = await axios.get(`${BACKEND_URL}/addpopup/popups`);
            setPopups(response.data);
        } catch (error) {
            console.error('Error fetching popups:', error);
            toast.error('Failed to fetch popups.');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            image: '',
            viewLink: '',
            days: 0,
            hours: 0,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Saving popup...');
        try {
            // await axios.post('http://localhost:5000/addpopup/popups', {
             await axios.post(`${BASE_URL}addpopup/popups`, {
                popupType: selectedPopupType,
                title: formData.title,
                content: formData.content,
                image: formData.image,
                viewLink: formData.viewLink,
                timer: { days: formData.days, hours: formData.hours },
            });

//             await axios.post(`${BACKEND_URL}/addpopup/popups`, {
//   popupType: selectedPopupType,
//   title: formData.title,
//   content: formData.content,
//   image: formData.image,
//   viewLink: formData.viewLink,
//   timer: { days: formData.days, hours: formData.hours },
// });
            fetchPopups();
            toast.success('Popup saved successfully!', { id: toastId });
        } catch (error) {
            console.error('Error creating/updating popup:', error);
            toast.error('Failed to save popup.', { id: toastId });
        }
    };

    const handleDelete = async (id) => {
        const toastId = toast.loading('Deleting popup...');
        try {
            // await axios.delete(`http://localhost:5000/addpopup/popups/${id}`);
            await axios.delete(`${BASE_URL}addpopup/popups/${id}`);
            // await axios.delete(`${BACKEND_URL}/addpopup/popups/${id}`);
            fetchPopups();
            toast.success('Popup deleted successfully!', { id: toastId });
        } catch (error) {
            console.error('Error deleting popup:', error);
            toast.error('Failed to delete popup.', { id: toastId });
        }
    };

    return (
        <div className="admin-popup-container">
            <h2>Manage Popups</h2>
            <div className="popup-type-selector">
                <label>Select Popup Type:</label>
                <select value={selectedPopupType} onChange={(e) => setSelectedPopupType(e.target.value)}>
                    {popupTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
            </div>

            <form onSubmit={handleSubmit} className="popup-form">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="content"
                    placeholder="Content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="viewLink"
                    placeholder="View Link (e.g., /packages)"
                    value={formData.viewLink}
                    onChange={handleInputChange}
                />
                <div className="timer-inputs">
                    <label className='label-title-show-for'>Show for:</label>
                    <input
                        type="number"
                        name="days"
                        placeholder="Days"
                        value={formData.days}
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="hours"
                        placeholder="Hours"
                        value={formData.hours}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit">Save Popup</button>
                </div>
            </form>

            <div className="popup-list">
                <h3>Active Popups</h3>
                {popups.map((popup) => (
                    <div key={popup._id} className="popup-item">
                        <h4>{popup.title}</h4>
                        <p>{popup.content}</p>
                        {popup.image && <img src={popup.image} alt={popup.title} />}
                        <p>
                            Expires in: {popup.timer.days} days, {popup.timer.hours} hours
                        </p>
                        <button onClick={() => handleDelete(popup._id)} className="delete-button">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPopup;