import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import "../pages/admin/QuillEditor.css";
import "./GroupTourList.css"

const MONTHS_ORDER = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const formatDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

  let rangeText = "";
  if (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  ) {
    rangeText = `${startDate.getDate()}–${endDate.getDate()} ${startDate.toLocaleString(
      'default',
      { month: 'short' }
    )}, ${startDate.getFullYear()}`;
  } else {
    rangeText = `${startDate.getDate()} ${startDate.toLocaleString('default', {
      month: 'short',
    })} – ${endDate.getDate()} ${endDate.toLocaleString('default', {
      month: 'short',
    })}, ${startDate.getFullYear()}`;
  }

  return (
    <>
      {rangeText}{' '}
      <span style={{ fontSize: '12px', color: '#2c5282' }}>({diffDays} days)</span>
    </>
  );
};

const GroupTourList = () => {
  const { axios } = useAppContext();
  const [toursByYearMonth, setToursByYearMonth] = useState({});
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isMobile = screenWidth < 768;

  useEffect(() => {
    const resize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const { data } = await axios.get('/addgrouptour/all');

        if (data.success) {
          const groups = data.tours.reduce((acc, tour) => {
            const year = tour.year || new Date(tour.startDate).getFullYear();
            const month =
              tour.month ||
              new Date(tour.startDate).toLocaleString('default', { month: 'long' });

            if (!acc[year]) acc[year] = {};
            if (!acc[year][month]) acc[year][month] = [];
            acc[year][month].push(tour);

            return acc;
          }, {});

          const sorted = Object.keys(groups)
            .sort((a, b) => b - a)
            .reduce((acc, year) => {
              acc[year] = groups[year];
              return acc;
            }, {});

          setToursByYearMonth(sorted);
        } else {
          toast.error('Failed to fetch group tours.');
        }
      } catch {
        toast.error('An error occurred while fetching group tours.');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [axios]);

  const styles = {
    container: {
      maxWidth: '100%',
      margin: '0 auto',
      background: '#fff',
      paddingBottom: '1.5rem',
      height: '100%',
    },
    
    yearHeader: {
    //   fontSize: '1.3rem',
    //   fontFamily:'Roboto',
    //   marginTop: '0px',
    //   marginBottom: '0px',
    //   color: '#1d3557',
    //   color: '#1d3557',
    //   paddingBottom: '0px',
    //   lineHeight:'1.2'

    fontSize: '1.3rem',
    fontFamily: 'Roboto',
    marginTop: '0px',
    marginBottom: '0px',
    paddingBottom: '0px',
    lineHeight: '1.2',
    background: 'linear-gradient(135deg, rgb(44, 82, 130) 0%, rgb(74, 144, 189) 100%)',
    // background: 'linear-gradient(135deg, rgb(20, 50, 100) 0%, rgb(50, 100, 160) 100%)',

    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent', 
    
    },
    // monthHeader: {
    //   fontSize: '1.5rem',
    //   marginBottom: '15px',
    //   color: '#457b9d',
    // },
    monthSection: {
      marginBottom: '40px',
    },
    card: {
      background: '#fff',
      border: '1px solid #eaeaea',
      borderRadius: '10px',
      padding: '12px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
    //   maxWidth: '590px',
      margin: '10px 0',
      position: 'relative',
    },
    cardImage: {
      width: '100px',
      height: '100px',
      borderRadius: '10px',
      objectFit: 'cover',
      float: 'left',
      marginRight: '12px',
      marginBottom: '5px',
    },
    tourTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1d3557',
      display: 'none',
    },
    description: {
      color: '#333',
      marginTop: '6px',
      paddingBottom: '14px',
    },
    cardText: {
      fontSize: '14px',
      color: '#2c5282',
      fontFamily: 'Inter',
      textAlign: 'right',
      paddingRight: '10px',
      position: 'absolute',
      right: '10px',
      bottom: '5px',
    },
  };

  return (
    <div style={styles.container}>
      

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading...</p>
      ) : (
        <>
          {Object.keys(toursByYearMonth).map((year) => (
            <div key={year}>
              <div style={{color:'#333',textAlign:'center',backgroundColor:'#e0f0ff',padding:'8px 5px',marginBottom:'1.5rem'}}> <p style={{fontFamily:'Poppins',fontSize:'15px'}}>Upcomming Group Tours</p><h2 style={styles.yearHeader}><strong style={{fontWeight:'500'}}>{year}</strong> Schedule</h2> <p style={{fontFamily:'Lisu Bosa',fontSize:'15px',fontStyle:'italic',color:'#1e3a5f',}}>(1-15 Travelers Per Group Maximum| Groups & Private Tours are available to book anytime outside this schedule)</p></div>

              {Object.keys(toursByYearMonth[year])
                .sort((a, b) => MONTHS_ORDER.indexOf(a) - MONTHS_ORDER.indexOf(b))
                .map((month) => (
                  <div key={month} style={styles.monthSection}>
                    <h3 className='monthHeader'>{month} {year}</h3>

                    {toursByYearMonth[year][month].map((tour) => (
                      <div key={tour._id} style={styles.card}>
                        <img src={tour.image} alt={tour.title} style={styles.cardImage} />

                        <h3 style={styles.tourTitle}>{tour.title}</h3>

                        <div
                          className="ql_editor"
                          style={styles.description}
                          dangerouslySetInnerHTML={{ __html: tour.description }}
                        />

                        <p style={styles.cardText}>
                          {formatDateRange(tour.startDate, tour.endDate)}
                        </p>

                        <div style={{ clear: 'both' }}></div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default GroupTourList;
