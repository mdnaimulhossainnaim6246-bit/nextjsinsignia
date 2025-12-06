import React, { useState } from 'react';
import './Home.css';
import { FaGift, FaMapMarkedAlt, FaPlane, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Themepreview from '../components/Themepreview';

const featuredTours = [
  {
    image: '/assets/bgg6.jpeg',
    title: 'Sundarbans Mangrove Forest',
    description: "A 3-day tour to the world's largest mangrove forest. Explore the wildlife and nature.",
    price: '$300',
    alt: 'A boat in the Sundarbans'
  },
  {
    image: '/assets/bgg7.jpeg',
    title: 'Sajek Valley Adventure',
    description: 'A 2-day trip to the kingdom of clouds. Enjoy the breathtaking views and tribal culture.',
    price: '$200',
    alt: 'A resort in Sajek Valley'
  },
  {
    image: '/assets/bgg8.jpeg',
    title: "Cox's Bazar Beach Holiday",
    description: "A 4-day relaxing holiday at the world's longest natural sandy beach.",
    price: '$400',
    alt: "People enjoying on the Cox's Bazar beach"
  },
];

const Home = () => {
  const navigate = useNavigate();

  const [showOfferDetails, setShowOfferDetails] = useState(false);

  const quickLinks = [
    { text: 'Offer', icon: <FaGift />, href: '#' },
    { text: 'Destination', icon: <FaMapMarkedAlt />, onClick: () => navigate("/all-discover") },
    { text: 'Tour', icon: <FaPlane />, href: '#' },
    { text: 'About Us', icon: <FaInfoCircle />, href: '#' },
  ];

  const handleOfferClick = () => {
    setShowOfferDetails(!showOfferDetails);
  };

  return (
    <main id='home' className="home-container">
      {/* === THEME PREVIEW SLIDER === */}
      <Themepreview />

      {/* === QUICK LINKS === */}
      <div className="quick-links">
        {quickLinks.map((link, index) => (
          <a
            key={index}
            href={link.href || '#'}
            className="link-item"
            onClick={(e) => {
              if (link.onClick) {
                e.preventDefault();
                link.onClick();
              }
            }}
          >
            <div className="link-icon">{link.icon}</div>
            <div className="link-text">{link.text}</div>
          </a>
        ))}
      </div>

      {/* === OFFER SECTION === */}
      <div className="offer-section">
        <div className="offer-badge" onClick={handleOfferClick}>
          <span>20% Off</span>
        </div>
        {showOfferDetails && (
          <div className={`offer-details ${showOfferDetails ? 'show' : ''}`}>
            <h2>Special Offers</h2>
            <ul>
              <li>
                <h3>Sundarbans Tour</h3>
                <p>Get 20% off on our special Sundarbans tour package. Explore the world's largest mangrove forest and its amazing wildlife.</p>
              </li>
              <li>
                <h3>Sajek Valley Trip</h3>
                <p>Enjoy a 15% discount on a memorable trip to Sajek Valley. Witness the breathtaking views of the clouds and hills.</p>
              </li>
              <li>
                <h3>Cox's Bazar Beach Holiday</h3>
                <p>Get a 25% discount on a relaxing holiday at Cox's Bazar. Enjoy the sun, sand, and sea at the world's longest natural sandy beach.</p>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* === FEATURED TOURS ===
      <section className="featured-tours-section">
        <h2>Extra Featured</h2>
        <div className="featured-tours-container">
          {featuredTours.map((tour, index) => (
            <div key={index} className="tour-card">
              <img src={tour.image} alt={tour.alt} className="tour-image" />
              <div className="tour-details">
                <h3>{tour.title}</h3>
                <p>{tour.description}</p>
                <div className="tour-price-button">
                  <span>{tour.price}</span>
                  <button>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}
    </main>
  );
};

export default Home;
