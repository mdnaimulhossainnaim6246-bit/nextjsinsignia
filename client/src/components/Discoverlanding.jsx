import React, { useMemo } from 'react';
import { useAppContext } from "../context/AppContext";
import "../individualCSS/Discover/discoverlanding.css";
import Discoverlistlanding from './Discoverlistlanding';
import { useNavigate } from 'react-router-dom';
// import SwiperCarousel from './SwiperCarousel';

const Discoverlanding = () => {
  const navigate = useNavigate();
  const { discovers } = useAppContext();

  const enrichedDiscovers = useMemo(() => {
    if (!Array.isArray(discovers)) return [];
    return discovers.map(d => ({
      ...d,
      _normalizedCategory: typeof d.category === 'string' ? d.category : '',
    }));
  }, [discovers]);

  return (
    <div id='discover' className='discoverlanding-outer-div' >
     <div className="discoverlanding-section">
      <section className="sectionlanding___container">
        <h2 className="section__header">Iconic Destinations</h2>
        <p className="section__subheader">Experience the diverse landscapes and rich culture of Bangladesh.</p>
         
        

        <div className="discoverlanding-grid">
          {enrichedDiscovers.slice(0, 2).map((discover) => (
            <Discoverlistlanding key={discover._id} discover={discover} />
          ))}
        </div>

        <div style={{ justifyContent:'center', display:'flex', marginTop:'1.2rem',fontSize:'16px' }}>
         <button  style={{color:'#fff',background:' linear-gradient(135deg, #2b8dca, #55bde9)',padding:'0.75rem 1.5rem',borderRadius:'50px',fontFamily:'inter',fontWeight:'600',cursor:'pointer'}}
            onClick={() => navigate("/all-place-list")} 
          >
            See More
          </button>
        </div>

      </section>
     </div>
    </div>
  );
};

export default Discoverlanding;