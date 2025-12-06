

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
// import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../individualCSS/OurTravelersLanding.css';

const OurTravelersLanding = () => {
  const { ourTravelers } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(3);

  // Update visibleCount based on screen width
  const updateVisibleCount = () => {
    const width = window.innerWidth;
    if (width > 1250) {
      setVisibleCount(3);
    } else if (width > 780) {
      setVisibleCount(4);
    } else {
      setVisibleCount(3);
    }
  };

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const visibleTravelers = Array.isArray(ourTravelers)
    ? ourTravelers.slice(0, visibleCount)
    : [];

  return (
    <div id='ourtravelers' className="our-travelers-landing">
      {/* <Helmet>
        <title>Our Travelers - Share Your Adventures</title>
        <meta
          name="description"
          content="See the amazing adventures of our travelers. Get inspired for your next journey."
        />
        <meta
          name="keywords"
          content="travelers, adventures, travel stories, customer experiences"
        />
      </Helmet> */}

      <h1 className="ourtravelers-main-title">Our Travelers</h1>
      <h3 className='ourtravelers-main-sub' >Memories Shared By Our Happy Explorers</h3>

      <div className="ourtravelers-travelers-container">
        {visibleTravelers.length > 0 ? (
          visibleTravelers.map((traveler) => (
            <Link
              to={`/ourtravelers-details/${traveler._id}`}
              key={traveler._id}
              className="ourtravelers-traveler-card-link"
            >
              <div className="ourtravelers-traveler-card">
                <div className="ourtravelers-thumbnail-container">
                  <img
                    src={traveler.image}
                    alt={traveler.title}
                    className="ourtravelers-thumbnail-image"
                  />
                  <div className="ourtravelers-overlay">
                    <div
                      className="ourtravelers-description"
                      dangerouslySetInnerHTML={{
                        __html: traveler.description
                          ? traveler.description
                              .replace(/color:[^;"]+;?/g, 'color:#ececec;')
                              .replace(/(<([^>]+)>)/gi, '')
                              .slice(0, 180) + '..'
                          : '',
                      }}
                    ></div>
                  </div>
                </div>

                <div className="ourtravelers-profile-info">
                  <img
                    src={traveler.profileChoose}
                    alt={traveler.title}
                    className="ourtravelers-profile-image"
                  />
                  <h2 className="ourtravelers-traveler-name">{traveler.title || ''}</h2>
                  <p className="ourtravelers-traveler-subtitle">{traveler.subTitle || ''}</p>

                  <div className="ourtravelers-social-links">
                    <div className="ourtravelers-link-div">
                      {traveler.socialMedia?.facebook && (
                        <p className="ourtravelers-link-co-name">
                          See reco on{' '}
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(traveler.socialMedia.facebook, '_blank', 'noopener,noreferrer')}
                          >
                            Facebook
                          </span>

                        </p>
                      )}
                    </div>

                    <div className="ourtravelers-link-div">
                      {traveler.socialMedia?.instagram && (
                        <p className="ourtravelers-link-co-name">
                          See reco on{' '}
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(traveler.socialMedia.instagram, '_blank', 'noopener,noreferrer')}
                          >
                            Instagram
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="ourtravelers-link-div">
                      {traveler.socialMedia?.youtube && (
                        <p className="ourtravelers-link-co-name">
                          Watch on{' '}
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(traveler.socialMedia.youtube, '_blank', 'noopener,noreferrer')}
                          >
                            Youtube
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="ourtravelers-link-div">
                      {traveler.socialMedia?.linkedin && (
                        <p className="ourtravelers-link-co-name">
                          Connect on{' '}
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(traveler.socialMedia.linkedin, '_blank', 'noopener,noreferrer')}
                          >
                            Linkedin
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="ourtravelers-link-div">
                      {traveler.socialMedia?.x && (
                        <p className="ourtravelers-link-co-name">
                          Follow on{' '}
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(traveler.socialMedia.x, '_blank', 'noopener,noreferrer')}
                          >
                            X-Twiteer
                          </span>
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No travelers found.</p>
        )}
      </div>

      {/* See More Button */}
      <div className='ourtravelers-show-more-btn'>
        <Link
          to="/OurTravelers"
          onMouseEnter={(e) => (e.currentTarget)}
          onMouseLeave={(e) => (e.currentTarget)}
        >
          See More
        </Link>
      </div>
    </div>
  );
};

export default OurTravelersLanding;
