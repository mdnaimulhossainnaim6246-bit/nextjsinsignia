// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../individualCSS/Discover/discoverlist.css";

// const BlogList = ({ blog }) => {
//   const { title, description, image, _id, author } = blog;
//   const navigate = useNavigate();

//   const cleanDescription = description
//   .replace(/(<([^>]+)>)/gi, '') // remove HTML tags
//   .replace(/\s+/g, ' ') // collapse multiple spaces into one
//   .trim();

//   const limit = 35;
//   let trimmed = cleanDescription;
//   if (cleanDescription.length > limit * 2) {
//     const words = cleanDescription.slice(0, limit).split(' ');
//     words.pop();
//     trimmed = words.join(' ').trim() + '..';
//   }

//   return (
//     <div
//       onClick={() => navigate(`/blog/${_id}`)}
//       className={`discover___card-discover`}
//     >
//       <div className="discover___image">
//         <div className='discover___image___container'>
//           <img className="discover___img___fit" src={image} alt={title} />
//           <div className="img__shadow__overlay"><h3>Read More</h3></div>
//         </div>
//       </div>

//       <div className="discover___card-content">
//          <div style={{display:'flex',justifyContent:'space-between'}}>
//         <h3 style={{marginLeft:'3px',padding:'0',fontFamily:'lisu bosa',fontWeight:'700',color:'#111',fontSize:'20px',lineHeight:'1.1'}} >{title}</h3>
//         </div>
//         <p style={{fontFamily:'Poppins', color:'#333',fontSize:'13px',lineHeight:'1.2',fontWeight:'400'}}>{trimmed} </p>
//         <div style={{display:'flex',justifyContent:'space-between'}}>
//           <p className="discover-category">
//             <i style={{ marginRight: '2px' }} className="fa-solid fa-user"></i>
//             {author}
//           </p>
//           <button className="discover__arrow__button material-symbols-outlined">
//             arrow_forward
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogList;


import React from "react";
import { useNavigate } from "react-router-dom";

const BlogList = ({ blog }) => {
  const navigate = useNavigate();
  const { title, description, image, _id, author, date } = blog;

  const cleanDescription = (description || "")
    .replace(/(<([^>]+)>)/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  const trimmedDescription =
    cleanDescription.length > 60
      ? cleanDescription.substring(0, 60) + "..."
      : cleanDescription;

  // const formatDate = (dateString) => {
  //   if (!dateString) return null;
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("en-US", options);
  // };

  const formatDate = (dateString) => {
  if (!dateString) return null;
  const options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};


  return (
    <div className="blog-card" onClick={() => navigate(`/blog/${_id}`)}>
      <div className="blog-card-image-container">
        <img className="blog-card-image" src={image} alt={title} />
        <div className="blog-card-overlay">
          <h3>Read More</h3>
        </div>
      </div>
      <div className="blog-card-content">
        <h3 className="blog-card-title">{title}</h3>
        <p className="blog-card-description">{trimmedDescription}</p>
        <div className="blog-card-footer">
          <p className="blog-card-author" style={{ display: 'flex',justifyContent:'left', alignItems: 'center' }}>
            {blog.travelersPhoto && (
              <img 
                src={blog.travelersPhoto} 
                alt={blog.travelersName || 'Traveler'} 
                style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  display:'flex',
                  marginRight:'10px'
                }} 
              />
            )}
            <span style={{paddingTop:'2px',fontStyle:'italic',fontSize:'14px',color:'#2c5282',fontFamily:'Lisu Bosa'}}>
            {blog.travelersName || author}
            
            </span>
          </p>
          
          <p className="blog-card-date">
            <i className="fa-solid fa-calendar-days"></i>
            {formatDate(date)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
