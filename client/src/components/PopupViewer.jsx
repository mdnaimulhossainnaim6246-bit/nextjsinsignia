import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PopupViewer.css';
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const PopupViewer = () => {
    const [popups, setPopups] = useState([]);
    const [showPopups, setShowPopups] = useState(false);
    const [currentPopupIndex, setCurrentPopupIndex] = useState(0);

    useEffect(() => {
        const lastVisit = localStorage.getItem('lastVisit');
        const now = new Date().getTime();

        if (!lastVisit) {
            setShowPopups(true);
            localStorage.setItem('lastVisit', now);
        } else {
            const fiveMinutes = 1 * 60 * 1000;
            if (now - lastVisit > fiveMinutes) {
                setShowPopups(true);
                localStorage.setItem('lastVisit', now);
            }
        }

        if (showPopups) {
            fetchPopups();
        }
    }, [showPopups]);

    const fetchPopups = async () => {
        try {
            // const response = await axios.get('http://localhost:5000/addpopup/popups');
            const response = await axios.get(`${BASE_URL}addpopup/popups`);
            // const response = await axios.get(`${BACKEND_URL}/addpopup/popups`);
            setPopups(response.data.reverse()); // Show latest popups first
        } catch (error) {
            console.error('Error fetching popups:', error);
        }
    };

    const handleClose = () => {
        if (currentPopupIndex < popups.length - 1) {
            setCurrentPopupIndex(currentPopupIndex + 1);
        } else {
            setShowPopups(false);
        }
    };

    if (!showPopups || popups.length === 0 || currentPopupIndex >= popups.length) {
        return null;
    }

    const currentPopup = popups[currentPopupIndex];

    return (
        <div className="popup-viewer-overlay">
            <div className="popup-viewer-modal">
                <button className="close-button" onClick={handleClose}>X</button>
                <div className="popup-card">
                    <h3>{currentPopup.title}</h3>
                    <p>{currentPopup.content}</p>
                    {currentPopup.image && <img src={currentPopup.image} alt={currentPopup.title} />}
                    {currentPopup.viewLink && (
                        <Link to={currentPopup.viewLink} className="view-button" onClick={() => setShowPopups(false)}>
                            View
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopupViewer;
