import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import '../individualCSS/OurTravelersLanding.css';
import Mobailenav from "../components/Mobailenav";
import LandingFooter from '../components/LandingFooter';


const OurTravelers = () => {
  const { ourTravelers } = useAppContext();

  return (
    <div className="our-travelers-inner">
      <Helmet>
        <title>Our Travelers - Share Your Adventures</title>
        <meta
          name="description"
          content="See the amazing adventures of our travelers. Get inspired for your next journey."
        />
        <meta
          name="keywords"
          content="travelers, adventures, travel stories, customer experiences"
        />
      </Helmet>

      <Mobailenav/>
       <div className='ourtravelers-inner-main-ti-sub'>
      <h1 className="ourtravelers-inner-main-title">Our Travelers</h1>
      <p className='ourtravelers-inner-main-sub'>Memories Shared By Our Happy Explorers</p>
    </div>
      <div className="ourtravelers-travelers-inner-container">
        {Array.isArray(ourTravelers) && ourTravelers.length > 0 ? (
          ourTravelers.map((traveler) => (
            <Link to={`/ourtravelers-details/${traveler._id}`} key={traveler._id} className="ourtravelers-traveler-card-link">
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
                    <div className='ourtravelers-link-div'>
                      {traveler.socialMedia?.facebook && (
                        <p className='ourtravelers-link-co-name'>See reco on
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(traveler.socialMedia.facebook, '_blank', 'noopener,noreferrer')}
                          >
                            Facebook
                          </span>
                        </p>
                      )}
                    </div>
                    
                    <div className='ourtravelers-link-div'>
                      {traveler.socialMedia?.instagram && (
                        <p className='ourtravelers-link-co-name'>See reco on
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => window.open(traveler.socialMedia.instagram, '_blank', 'noopener,noreferrer')}
                          >
                            Instagram
                          </span>
                        </p> 
                      )}
                    </div>
                    
                    <div className='ourtravelers-link-div'>
                      {traveler.socialMedia?.youtube && (
                        <p className='ourtravelers-link-co-name'> Watch on
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
      <LandingFooter/>
    </div>
  );
};

export default OurTravelers;


