// PrivacyPolicy.jsx

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./PrivacyPolicy.css"; 
import Mobailenav from "../components/Mobailenav";
import LandingFooter from "../components/LandingFooter";


const PrivacyPolicy = () => {
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}, []);

  return (
    <div style={{minHeight:'100vh',maxHeight:"100%",background:'#fdfdfd'}}>
      {/* SEO Helmet */}
      <Helmet>
        <title>Privacy Policy | INSIGNIA Tours and Travel</title>
        <meta
          name="description"
          content="Read the Privacy Policy of Insignia Travel. Learn how we collect, use, protect, and share personal information for travelers visiting Bangladesh. Cookies, analytics, and international visitor practices explained."
        />
        <meta
          name="keywords"
          content="Privacy Policy, Insignia Travel, Bangladesh travel, personal data protection, cookies, data security, international travelers"
        />
        <meta property="og:title" content="Privacy Policy — Insignia Travel" />
        <meta
          property="og:description"
          content="Learn how Insignia Travel handles your personal information, cookies, and data protection for travelers in Bangladesh."
        />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Insignia Travel" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy — Insignia Travel" />
        <meta
          name="twitter:description"
          content="Insignia Travel Privacy Policy explaining data collection, usage, cookies, and security for travelers visiting Bangladesh."
        />
      </Helmet>

      <div className="privacy-container">
        <Mobailenav/>
        <div className="praivacy-title-sub-div">
         <h1 className="privacy-title">Privacy Policy — Insignia Tours & Travel</h1>
         <h2 className="privacy--sub">Personal Data Processing Policy</h2>
        </div>

        <main className="praivacy-main-data-container">
        <section className="privacy-section">
          <h3 className="privacy-subtitle">1. Introduction</h3>
          <p>
            Insignia Tours & Travel (“we”, “our”, or “us”) is committed to protecting your personal information and respecting your privacy. This Privacy Policy describes how we collect, use, and protect your information when you access or use our website,
             <a style={{color:'#4a90bd',textDecoration:'underline'}}
               href="https://www.insigniatours.com"
               target="_blank"
               rel="noopener noreferrer"
             >
                 https://www.insigniatours.com
             </a>
              , and our services.
          </p>
        </section>

        <section className="privacy-section">
          <h3 className="privacy-subtitle">2. Information We Collect</h3>
          <ul>
            <li>Name, email address, phone number</li>
            <li>Booking or travel-related details</li>
            <li>Payment information (if applicable)</li>
            {/* <li>Website usage data (IP address, browser type, cookies, etc.)</li> */}
          </ul>
        </section>

        <section className="privacy-section">
          <h3 className="privacy-subtitle">3. How We Use Your Information</h3>
          <ul>
            <li>Provide and manage travel bookings and services</li>
            <li>Respond to inquiries and provide customer support</li>
            <li>Send newsletters or promotional content (with your consent)</li>
            <li>Improve our website and services through analytics</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h3 className="privacy-subtitle">4. How We Protect Your Information</h3>
          <ul>
            <li>Limited access to authorized personnel only</li>
            <li>Encryption of sensitive data</li>
            <li>Regular security monitoring and software updates</li>
            <li>All data transmitted through our website is protected using HTTPS encryption.</li>
            <li>Our website is hosted on secure servers provided by a trusted hosting provider.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h3 className="privacy-subtitle">5. Sharing Your Information</h3>
          <p>
            We will never sell your personal information. We may share data only in the following cases:
          </p>
          <ul>
            <li>With service providers who assist in delivering travel services or processing payments</li>
            <li>If required by law, court order, or governmental authority</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h3 className="privacy-subtitle">6. Cookies and Tracking</h3>
          <p>
            Our website uses cookies to improve user experience and functionality:
          </p>
          <ul>
            <li>Essential cookies for website functionality, user preferences, and booking processes</li>
            <li>Analytics cookies to understand website traffic and performance</li>
          </ul>
          <p>You can control or disable cookies via your browser settings.</p>
        </section>

        <section className="privacy-section">
          <h3 className="privacy-subtitle">7. Your Rights</h3>
          <ul>
            <li>Access, correct, or delete your personal information</li>
            <li>Withdraw consent for marketing communications at any time</li>
            <li>Contact us for any questions regarding your personal data</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h3 className="privacy-subtitle">8. International Travelers</h3>
          <p>
            For international visitors, we ensure your data is processed according to best practices and applicable international standards.
          </p>
        </section>

        <section className="privacy-section">
          <h3 className="privacy-subtitle">9. Contact Us</h3>
          <p>
            If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please contact us:
          </p>
          <ul>
            <li>Email: support@insignia.com</li>
            <li>Phone: +880 XXX XXXXX</li>
          </ul>
        </section>
        <p className="praivacy-contact">
         <Link to="/contact">
           Contact Us
         </Link>
        </p>
        </main>
        <LandingFooter/>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
