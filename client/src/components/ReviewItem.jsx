// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../individualCSS/Reviews.css';

// const ReviewItem = ({ review }) => {
//     // Sanitize and truncate the description
//     const cleanDescription = (review.description || "")
//         .replace(/(<([^>]+)>)/gi, "") // Remove HTML tags
//         .replace(/\s+/g, " ")       // Collapse whitespace
//         .trim();

//     const truncatedDescription =
//         cleanDescription.length > 80
//             ? cleanDescription.substring(0, 80) + "..."
//             : cleanDescription;

//     return (
//         <div className="review-item-card">
//             <div className="review-item-image-wrapper">
//                 <img 
//                     src={review.travelersPicture} 
//                     alt={`Photo of ${review.travelersName}`} 
//                     className="review-item-traveler-photo"
//                 />
//             </div>
//             <div className="review-item-content">
//                 <h3 className="review-item-title">{review.reviewTitle}</h3>
//                 <p className="review-details-traveler-name">{review.travelersName}</p>
//                 <p className="review-item-traveler-title">{review.travelersTitle}</p>
//                 <p className="review-item-description">{truncatedDescription}</p>
//                 <Link to={`/review/${review._id}`} className="review-item-read-more-btn">
//                     Read Full Review
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default ReviewItem;


import React from 'react';
import { Link } from 'react-router-dom';

// The new CSS file will be imported in the parent ReviewsPage.jsx
// to ensure it's loaded once for the entire feature.

const StarRating = ({ rating }) => {
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    return <div className="modern-review-rating">{stars}</div>;
};

const ReviewItem = ({ review }) => {
    // const ReviewItem = ({ review }) => {
    // if (!review) return null;


    
    // Sanitize and truncate the description
    const cleanDescription = (review.description || "")
        .replace(/(<([^>]+)>)/gi, "") // Remove HTML tags
        .replace(/\s+/g, " ")       // Collapse whitespace
        .trim();

    const truncatedDescription =
        cleanDescription.length > 180
            ? cleanDescription.substring(0, 180) + "..."
            : cleanDescription;

    // Create a URL-friendly slug from the traveler's name
    const travelerSlug = review.travelersName
        ? review.travelersName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
        : 'unknown';
    
    // Format the date for display
    const formattedDate = review.reviewDate 
        ? new Date(review.reviewDate).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : null;

    return (
        <div className="modern-review-card">
            <div className="modern-review-image-wrapper">
                {/* <img 
                    src={review.travelersPicture} 
                    alt={`Portrait of ${review.travelersName}`} 
                    className="modern-review-traveler-photo"
                /> */}
            </div>
            <div className="modern-review-content">
                <div className="modern-review-header-info">
                    <div className="modern-review-traveler-info">
                        {/* <img 
                    src={review.travelersPicture} 
                    alt={`Portrait of ${review.travelersName}`} 
                    className="modern-review-traveler-photo"
                /> */}
                <Link to={`/review/${travelerSlug}`}>
                    <img 
                        src={review.travelersPicture} 
                        alt={`Portrait of ${review.travelersName}`} 
                        className="modern-review-traveler-photo"
                    />
                </Link>

                  
                    </div>
                    <div className="modern-review-meta">
                        <p className="modern-review-traveler-name">{review.travelersName}</p>
                        <p className="modern-review-traveler-title">{review.travelersTitle}</p>
                        <StarRating rating={review.rating} />
                        {formattedDate && <p className="modern-review-date">{formattedDate}</p>}
                    </div>
                </div>
                <div className="modern-review-body">
                    <h3 className="modern-review-title">{review.reviewTitle}</h3>
                    <p className="modern-review-description">{truncatedDescription}</p>
                    <Link to={`/review/${travelerSlug}`} className="modern-review-read-more-btn">
                        Read Full Review
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ReviewItem;
