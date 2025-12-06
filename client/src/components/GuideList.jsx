import React from "react";
import { useNavigate } from "react-router-dom";

const GuideList = ({ guide }) => {
  const navigate = useNavigate();
  const { title, description, image } = guide;

  const cleanDescription = (description || "")
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const trimmedDescription =
    cleanDescription.length > 160
      ? cleanDescription.substring(0, 160) + ".."
      : cleanDescription;
      
  const titleSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');

  return (
    <div className="guide-card">

        <h3 onClick={() => navigate(`/travel-guide/${titleSlug}`)} className="guide-card-title">{title}</h3>
      <div className="guide-card-image-container">
        <img onClick={() => navigate(`/travel-guide/${titleSlug}`)} className="guide-card-image" src={image} alt={title} />
        {/* <div className="guide-card-overlay">
          <h3>Read More</h3>
        </div> */}
      </div>
      <div className="guide-card-content">
        {/* <h3 className="guide-card-title">{title}</h3> */}
        <p className="guide-card-description">{trimmedDescription}</p>
      </div>
       <p onClick={() => navigate(`/travel-guide/${titleSlug}`)} className="guide-card-see-details">See details <span style={{fontSize:'10px',}}><i className="fa-solid fa-arrow-right-long"></i></span></p>
    </div>
  );
};

export default GuideList;
