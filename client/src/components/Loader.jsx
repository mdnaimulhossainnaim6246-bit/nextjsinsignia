// import React from 'react';
// import './Loader.css';

// const Loader = () => {
//   return (
//     <div className="loader-overlay">
//       <div className="loader-content">
//         <div className="spinner"></div>
//         <p className="loading-text">Loading...</p>
//       </div>
//     </div>
//   );
// };

// export default Loader;

// import React from 'react';
// import './Loader.css';

// const Loader = () => {
//   return (
//     <div className="loader-overlay">
//       <div className="loader-content">
//         <img src="/assets/favicon.png" alt="loader" className="loader-image" />
//         <p className="loading-text">
//           Loading<span className="dots"></span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Loader;

import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <img src="/assets/favicon.png" alt="loader" className="loader-image" />
        <p className="loading-text">
          Loading<span className="dots"></span>
        </p>
      </div>
    </div>
  );
};

export default Loader;
