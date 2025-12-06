import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';


// Function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return ''; // Guard against null/undefined
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

const DiscoverArticle = () => {
  const { axios } = useAppContext();
  const [discover, setDiscover] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(null);
  const [isHovered, setIsHovered] = useState(null); // New state for hover

  useEffect(() => {
    const fetchDiscover = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/adddiscover/articles');
        if (data.success) {
          const filteredData = data.articles.filter(item => item.rating === 4 || item.rating === 5);
          const sortedData = filteredData.sort((a, b) => b.rating - a.rating);
          setDiscover(sortedData);
        } else {
          toast.error('Failed to fetch discover data.');
        }
      } catch (error) {
        console.error("Error fetching discover data:", error);
        toast.error('An error occurred while fetching discover data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscover();
  }, [axios]);

  const linkStyle = (id, isLast) => ({
  textDecoration: (isActive === id || isHovered === id) ? 'underline' : 'none',
  color: isHovered === id ? '#457b9d' : '#2c5282',
  display: 'block',
  padding: '10px 0',
  borderBottom: isLast ? 'none' : '1px solid #eee',
  cursor: 'pointer',
});


  return (
    <div style={styles.container}>  
      <h2 style={styles.header}>Most Popular Place</h2>
      {loading ? (
        <p style={styles.loader}>Loading...</p>
      ) : (
        <ul style={styles.list}>
          {discover.map((item, index) => (
            <li key={item._id}>
              <Link
                to={`/discoverplace/${item.place}`}
                target="_blank"          
                rel="noopener noreferrer" 
                style={linkStyle(item._id, index === discover.length - 1)} 
                onMouseDown={() => setIsActive(item._id)}
                onMouseUp={() => setIsActive(null)}
                onMouseLeave={() => {
                  setIsActive(null);
                  setIsHovered(null);
                }}
                onMouseEnter={() => setIsHovered(item._id)}
              >
                <h3 style={styles.title}>{item.place}</h3>
                <div style={{ display: 'flex',  }}>
                  <i style={{ fontSize:'5px', marginTop:'10px', marginRight:'3px'}} className="fa-solid fa-square"></i>
                  <p style={styles.subtitle}>{truncateText(item.subTitle, 70)}</p>
                </div>
              </Link>
            </li>
          ))}

        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    boxSizing: 'border-box',
    border:'none'
  },
  loader: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#555',
    padding: '40px 0',
  },
  header: {
  fontSize: "1.8rem",
  fontWeight: 900,
  fontFamily: "lisu bosa, sans-serif",
  fontStyle: "italic",
  background: "linear-gradient(135deg, #2c5282, #4a90bd)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "0.75rem",
  marginTop: "0rem",
  paddingBottom: "0rem",
  borderBottom: "3px solid",
  borderImage: "linear-gradient(135deg, #2c5282, #4a90bd) 1",
  textAlign: "left",
  lineHeight: 1.3,
  display: "inline-block"

  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '4px',
    margin: 0,
    color: '#666', 
    display:'none'
  },
  subtitle: {
    fontSize: '0.9rem',
    // color: '#2c5282',
    margin: 0,
  },
};

export default DiscoverArticle;
