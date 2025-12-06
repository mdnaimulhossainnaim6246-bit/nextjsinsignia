

import React from 'react';
import { useNavigate } from 'react-router-dom';

const OurTravelerslist = ({ blog }) => {
  const { title, subTitle, description, image, _id } = blog;
  const navigate = useNavigate();

  const cleanDescription = description.replace(/(<([^>]+)>)/gi, "");
  const trimmedDescription =
    cleanDescription.length > 50
      ? cleanDescription.slice(0, 50).trim() + "..."
      : cleanDescription;

  // Inline CSS style object
  const styles = {
    card: {
      background: "#fff",
      borderRadius: "1rem",
      overflow: "hidden",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
    },
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 25px rgba(0, 0, 0, 0.12)",
    },
    imageContainer: {
      width: "100%",
      height: "300px",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    content: {
      padding: "1rem 1.5rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#2c5282",
      marginBottom: "0.5rem",
    },
    subTitle: {
      fontSize: "1rem",
      fontWeigth:'500',
      color: "#4a90bd",
      marginBottom:'1rem'
    },
    description: {
      fontSize: "0.95rem",
      color: "#718096",
      lineHeight: 1.7,
    },
    button: {
      background: "#0077ff",
      color: "#fff",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      fontWeight: "500",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.3rem",
      transition: "background 0.3s ease",
    },
  };

  return (
    <div
      onClick={() => navigate(`/ourtravelers-details/${_id}`)}
      style={styles.card}
      onMouseEnter={e => Object.assign(e.currentTarget.style, styles.cardHover)}
      onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: "none", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)" })}
    >
      <div style={styles.imageContainer}>
        <img style={styles.image} src={image} alt={title} />
      </div>
      <div style={styles.content}>
        <h4 style={styles.title}>{title}</h4>
        <h5 style={styles.subTitle}>{subTitle}</h5>
        <p style={styles.description}>{trimmedDescription}</p>
        {/* <button style={styles.button}>
          Details <i style={{ fontSize: "14px", marginTop: "4px" }} className="fa-solid fa-arrow-right"></i>
        </button> */}
      </div>
    </div>
  );
};

export default OurTravelerslist;
