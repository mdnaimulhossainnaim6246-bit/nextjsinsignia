import React, { useEffect, useState } from "react";
import "./About.css";
// import "./Aboutus.css";
import { useAppContext } from "../context/AppContext";
import AchievementCard from "./AchievementCard";
// import OurTravelers from "./OurTravelers";

const About = () => {
  const { axios } = useAppContext();
  const [numbers, setNumbers] = useState(null);

 // ✅ Fetch Achievements Numbers
  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const { data } = await axios.get("/api/about-number");
        if (data.success) {
          setNumbers(data.numbers);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchNumbers();
  }, [axios]);

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "auto" });
}, []);


  useEffect(() => {
    // Navbar scroll background change
    const handleScroll = () => {
      const navbar = document.querySelector(".about-navbar");
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
        navbar.style.boxShadow = "0 2px 25px rgba(0,0,0,0.1)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
        navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.08)";
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // Counter animation
    const stats = document.querySelectorAll(".about-stat-number");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const text = target.textContent;
          const number = parseInt(text.replace(/\D/g, ""));
          const suffix = text.replace(/[0-9]/g, "");
          let current = 0;
          const increment = number / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
              target.textContent = number + suffix;
              clearInterval(timer);
            } else {
              target.textContent = Math.floor(current) + suffix;
            }
          }, 30);
          observer.unobserve(target);
        }
      });
    });

    stats.forEach((stat) => observer.observe(stat));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="about__page">
      {/* Navigation */}
      <nav className="about-navbar">
        <div className="about-nav-container">
          <a href="index.html" className="about-logo">Insignia</a>
          <ul className="about-nav-menu">
            <li><a href="index.html">Home</a></li>
            <li><a href="#destinations">Destinations</a></li>
            <li><a href="tours.html">Tours</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#" className="about-cart-icon">🛒 Cart</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="about-page-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">About Insignia</h1>
          <p className="about-hero-subtitle">
            Creating unforgettable journeys through the heart of Bangladesh since 2015
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story-section">
        <div className="about-story-grid">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
            alt="Our Story"
            className="about-story-image"
          />
          <div className="about-story-content">
            <h2>Our Story</h2>
            <p>
              Insignia Tours and Travel was born from a passion to share the hidden treasures of Bangladesh with the world...
            </p>
            <p>
              We believe that travel is more than just visiting places—it's about connecting with cultures, experiencing authentic moments...
            </p>
            <p>
              Every tour we design reflects our commitment to sustainable tourism, community engagement, and exceptional service...
            </p>
          </div>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="about-mission-vision">
        <div className="about-mv-container">
          <h2 className="about-section-title">Mission & Vision</h2>
          <div className="about-mv-grid">
            <div className="about-mv-card">
              <div className="about-mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To provide exceptional travel experiences that showcase the authentic beauty and rich cultural heritage of Bangladesh...
              </p>
            </div>
            <div className="about-mv-card">
              <div className="about-mv-icon">🌟</div>
              <h3>Our Vision</h3>
              <p>
                To become the leading travel agency in Bangladesh, recognized globally for delivering transformative travel experiences...
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values-section">
        <h2 className="about-section-title">Our Core Values</h2>
        <p className="about-section-subtitle">The principles that guide everything we do</p>
        <div className="about-values-grid">
          {[
            ["🤝", "Authenticity", "We provide genuine, unfiltered experiences..."],
            ["🌱", "Sustainability", "We're committed to responsible tourism..."],
            ["✨", "Excellence", "We strive for perfection in every detail..."],
            ["🛡️", "Safety", "Your safety is our priority..."],
            ["💙", "Passion", "Our love for Bangladesh and travel drives us..."],
            ["🌍", "Community", "We build lasting relationships with local communities..."]
          ].map(([icon, title, desc], i) => (
            <div key={i} className="about-value-card">
              <div className="about-value-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>


     
      {/* Stats */}

      
      <section className="about-stats-section">
        {/* ✅ Dynamic Achievements Section */}
      {numbers && (
        <section className="our-achievements">
          
          <div className="achievements-cards">
            {Object.entries(numbers).map(([key, value]) => {
              if (["_id", "createdAt", "updatedAt", "__v"].includes(key)) return null;
              return <AchievementCard key={key} item={{ key, value }} />;
            })}
          </div>
        </section>
      )}


        {/* <div className="about-stats-container">
          <div className="about-stats-grid">
            <div className="about-stat-item">
              <div className="about-stat-number">5000+</div>
              <div className="about-stat-label">Happy Travelers</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-number">50+</div>
              <div className="about-stat-label">Tour Packages</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-number">95%</div>
              <div className="about-stat-label">Satisfaction Rate</div>
            </div>
            <div className="about-stat-item">
              <div className="about-stat-number">10+</div>
              <div className="about-stat-label">Years Experience</div>
            </div>
          </div>
        </div> */}
      </section>

        {/* Why Choose Us Section */}
      <section className="about__why-choose">
        <h2 className="about__why-choose-title">Why Choose Insignia?</h2>
        <div className="about__why-cards">
          <div className="about__card">
            <h3>Expert Guides</h3>
            <p>Our experienced guides ensure unforgettable journeys with insider knowledge.</p>
          </div>
          <div className="about__card">
            <h3>Custom Packages</h3>
            <p>Tailor-made travel experiences designed to match your dream vacation.</p>
          </div>
          <div className="about__card">
            <h3>Best Price Guarantee</h3>
            <p>We provide premium experiences without breaking your budget.</p>
          </div>
        </div>
      </section>
      

      {/* Team 
      <section className="about-team-section">
        <div className="about-team-container">
          <h2 className="about-section-title">Meet Our Team</h2>
          <p className="about-section-subtitle">Passionate professionals dedicated to your perfect journey</p>


           <OurTravelers/>
           <div className="about-team-grid">
           
            {[
              ["Rafiq Ahmed", "Founder & CEO", "With 15 years in the travel industry...", "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"],
              ["Nadia Rahman", "Operations Director", "Nadia ensures every tour runs smoothly...", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"],
              ["Kamal Hassan", "Lead Tour Guide", "Kamal's extensive knowledge and charisma...", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"],
              ["Faria Sultana", "Customer Relations", "Faria is dedicated to ensuring every traveler feels welcomed...", "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"]
            ].map(([name, role, bio, img], i) => (
              <div key={i} className="about-team-card">
                <img src={img} alt={name} className="about-team-image" />
                <div className="about-team-info">
                  <h3 className="about-team-name">{name}</h3>
                  <p className="about-team-role">{role}</p>
                  <p className="about-team-bio">{bio}</p>
                </div>
              </div>
            ))}
          </div> 
        </div>
      </section> 
      */}


      {/* CTA */}
      <section className="about-cta-section-about">
        <div className="about-cta-container">
          <h2 className="about-cta-title">Ready to Explore Bangladesh?</h2>
          <p className="about-cta-text">
            Join us on an unforgettable journey through the beauty, culture, and warmth of Bangladesh.
          </p>
          <a href="tours.html" className="about-btn">Browse Our Tours</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p>&copy; 2025 Insignia Tours and Travel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
