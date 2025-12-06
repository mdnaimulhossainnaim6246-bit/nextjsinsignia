import React from "react";
import "./LandingFooter.css";
import { Link } from "react-router-dom";


const LandingFooter = () => {
  return (
    <footer id="bottom" style={{background:'#001c40',paddingBottom:'15px'}}>
      <div className="footer-bg" >
      <div style={{maxWidth:'1250px',margin:"o auto"}} className="row ">
        {/* Company Info */}
        {/* <div className="col">
          <p className="footer-logo">Insignia</p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
            distinctio aperiam saepe earum at, totam reiciendis dignissimos
            facilis aut nobis dolorem vitae sapiente recusandae tempore officia
            laboriosam quidem deleniti! Dicta.
          </p>

          <i className="fa-brands fa-facebook-f"></i>
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-brands fa-x-twitter"></i>
          <i className="fa-brands fa-linkedin"></i>
          <i className="fa-brands fa-telegram"></i>
        </div> */}
       
        {/* Navigation Links */}
        <div className="col">
          <h3>
            Quick Links
            <div className="underline">
              <span></span>
            </div>
          </h3>
          <ul className="footer-nav">
            
            <li className="footer-link">
              <Link to="/all-place-list">Destination</Link>
            </li>
            <li className="footer-link">
              <Link to="/tour-packages-list">Tour Packages</Link>
            </li>
            <li className="footer-link">
              <Link to="/Blog">Travel Blogs</Link>
            </li>
            <li className="footer-link">
             <Link to="/travel-guides">Bangladesh Highlights</Link>
            </li>
            <li className="footer-link">
             <Link to="/OurTravelers">Our Travelers</Link>
            </li>
            <li className="footer-link">
             <Link to="/Contact">Contact Us</Link>
            </li>
            <li className="footer-link">
              {/* <Link to="/admin">Admin</Link> */}
              <a href="/admin" target="_blank" rel="noopener noreferrer"> Admin</a>

            </li>
          </ul>
        </div>

        {/* Office Info */}
        <div className="col">
          <h3>
            Office
            <div className="underline">
              <span></span>
            </div>
          </h3>
          <p>H 6/8, Road: 18, Block B</p>
          <p> Section 10, Mirpur</p>
          <p> Dhaka 1216</p>
          <p>testimonial, PIN 560066, Bangladesh</p>
          {/* Gmail compose link */}
    <p style={{ display: 'flex', alignItems: 'center' }}>
      <a
        href="https://mail.google.com/mail/?view=cm&to=insigniatoursandtravel@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <i className="fa-regular fa-envelope"></i>
        <span style={{ paddingLeft: '4px' }}>insigniatoursandtravel@gmail.com</span>
      </a>
    </p>

    {/* WhatsApp link */}
    <p style={{ display: 'flex', alignItems: 'center' }}>
      <a
        href="https://wa.me/8801977784132"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <i className="fa-brands fa-whatsapp"></i>
        <span style={{ paddingLeft: '4px' }}>+880 1977-784132</span>
      </a>
    </p>
        </div>



        {/* Support Section */}
        <div className="col">
          <h3>
            Support
            <div className="underline">
              <span></span>
            </div>
          </h3>
          <p><Link to="/faqs">FAQ</Link></p>
          <p><Link to="/PrivacyPolicy">Privacy Policy</Link></p>
          {/* <p>Help</p> */}
          {/* <p>Guidelines</p> */}
          <li className="footer-link">
             <Link to="/Contact">Contact Us</Link>
            </li>
        </div>

        {/* Social Media */}
       <div className="col">
  <h3>
    Connect with us
    {/* <div className="underline">
      <span></span>
    </div> */}
  </h3>
  {/* <p style={{marginBottom:'10px'}} >XYZ Road Mirpur-10 <br /> Dhaka Bangladesh</p> */}
  <div className="social-icons">

    <div class="footer-social-links">
  <a href="https://www.facebook.com/#" target="_blank" rel="noopener noreferrer">
    <i className="fa-brands fa-facebook-f"></i>
  </a>
  <a href="https://www.instagram.com/#" target="_blank" rel="noopener noreferrer">
    <i className="fa-brands fa-instagram"></i>
  </a>
  <a href="https://twitter.com/#" target="_blank" rel="noopener noreferrer">
    <i className="fa-brands fa-x-twitter"></i>
  </a>
  <a href="https://www.linkedin.com/in/#" target="_blank" rel="noopener noreferrer">
    <i className="fa-brands fa-linkedin"></i>
  </a>
  {/* <a href="https://t.me/#" target="_blank" rel="noopener noreferrer">
    <i className="fa-brands fa-telegram"></i>
  </a> */}
  <a href="https://www.youtube.com/#" target="_blank" rel="noopener noreferrer">
    <i className="fa-brands fa-youtube"></i>
  </a>
  <a href="https://www.pinterest.com/#" target="_blank" rel="noopener noreferrer">
    <i className="fa-brands fa-pinterest"></i>
  </a>
</div>

  </div>
</div>
 </div>
      </div>

      <hr />

      {/* Copyright */}
      <p className="copyright">
        Insignia Tours & Travel © 2025 - All rights reserved. | Designed &
        Developed by{" "}

        <a
        href="https://wa.me/8801608449759"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* <i className="fa-brands fa-whatsapp"></i> */}
        <span style={{ paddingLeft: '4px' }}> Naimul Hossain</span>
      </a>
      </p>
    </footer>
  );
};

export default LandingFooter;
