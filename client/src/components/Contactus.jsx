

// import React from 'react';
// import './Contactus.css';
// import { useNavigate } from 'react-router-dom';
// // import { FaFacebookF, FaInstagram, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

// const ContactUs = () => {
//   const navigate = useNavigate();

//   const goToForm = () => {
//     navigate('/contact-form');
//   };

//   return (
//     <div className="cu2025-container">
//       {/* Hero Section */}
//       <section className="cu2025-hero">
//         <div className="cu2025-hero-overlay"></div>
//         <img src="/assets/B.H.7.jpeg" alt="Contact Background" className="cu2025-hero-img" />
//         <div className="cu2025-hero-text">
//           <h1>Get in Touch</h1>
//           <p>Let’s make your next journey extraordinary.</p>
//         </div>
//       </section>

//       {/* Contact Info Section */}
//       <section className="cu2025-contact-section">
//         <div className="cu2025-contact-wrapper">
//           <div className="cu2025-contact-info">
//             <h2>We’d Love to Hear From You</h2>
//             <p>Have a question or need travel assistance? Our team is just a message away.</p>

//             <div className="cu2025-info-item">
//               <strong>Email:</strong> <a href="mailto:info@insigniatravel.com">info@insigniatravel.com</a>
//             </div>
//             <div className="cu2025-info-item">
//               <strong>Phone:</strong> <a href="tel:+880123456789">+880 123 456 789</a>
//             </div>
//             <div className="cu2025-info-item">
//               <strong>Address:</strong> 123 Travel Street, Dhaka, Bangladesh
//             </div>

//             <div className="cu2025-info-item">
//               <strong>Support Hours:</strong> Sat–Thu | 9 AM – 8 PM
//             </div>

//             <button className="cu2025-contact-btn" onClick={goToForm}>
//               Send a Message
//             </button>

//             {/* Social Icons */}
//             <div className="cu2025-socials">
//               <a href="https://wa.me/880123456789" target="_blank" rel="noopener noreferrer" title="WhatsApp">
//                 <i className="fa-brands fa-whatsapp"></i>
//               </a>
//               <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
//                 <i className="fa-brands fa-facebook-f"></i>
//               </a>
//               <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
//                  <i className="fa-brands fa-instagram"></i>
//               </a>
//               <a href="mailto:info@insigniatravel.com" title="Email">
//                  <i className="fa-solid fa-envelope"></i>
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="cu2025-cta">
//         <h2>Ready to Begin Your Journey?</h2>
//         <p>Let us help you create stories worth telling. Explore our exclusive packages.</p>
//         <a href="/packages" className="cu2025-cta-btn">View Packages</a>
//       </section>
//     </div>
//   );
// };

// export default ContactUs;


import React, { useState } from 'react';
import './Contactus.css';
import { useNavigate } from 'react-router-dom';

const ContactUs = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const goTocontactForm = () => {
    navigate('/contact');
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'Why should you message us?',
      answer:
        'Because we offer personalized travel plans, quick responses, and insider deals that help you save money and time!',
    },
    {
      question: 'How quickly will we respond?',
      answer:
        'Usually within 6 hours — most of the time, we reply even sooner!',
    },
    {
      question: 'Do we provide customized tour plans?',
      answer:
        'Yes! We create travel packages based on your preferences, budget, and travel style to make every trip unforgettable.',
    },
    {
      question: 'Do we offer free travel guidance?',
      answer:
        'Yes! Even if you don’t book a tour with us, we provide free travel tips and suggestions to help you plan your trip.',
    },
  ];

  return (
    <div className="cu2025-container">
      {/* Hero Section */}
      {/* <section className="cu2025-hero">
        <div className="cu2025-hero-overlay"></div>
        <img
          src="/assets/B.H.7.jpeg"
          alt="Contact Background"
          className="cu2025-hero-img"
        />
        <div className="cu2025-hero-text">
          <h1>Get in Touch</h1>
          <p>Let’s make your next journey extraordinary.</p>
        </div>
      </section> */}

      {/* Contact Info Section */}
      <section className="cu2025-contact-section">
        <div className="cu2025-contact-wrapper">
          <div className="cu2025-contact-info">
            <h2>We’d Love to Hear From You</h2>
            <p>
              Have a question or need travel assistance? Our team is just a
              message away.
            </p>

            <div className="cu2025-info-item">
              <strong>Email:</strong>{' '}
              <a  href="https://mail.google.com/mail/?view=cm&to=tours.insignia@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              >
                tours.insignia@gmail.com
              </a>
            </div>
            <div className="cu2025-info-item">
  <strong>Phone:</strong>{' '}
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        // 📱 Mobile device: open dial pad
        window.location.href = 'tel:+8801977784132';
      } else {
        // 💻 Desktop: copy to clipboard
        navigator.clipboard.writeText('+8801977784132');
        alert('Phone number copied to clipboard!');
      }
    }}
  >
    +880 1977-784132
  </a>
</div>

            <div className="cu2025-info-item">
              <strong>Address:</strong> 123 Travel Street, Dhaka, Bangladesh
            </div>
            <div className="cu2025-info-item">
              <strong>Support Hours:</strong> Sat–Thu | 9 AM – 8 PM
            </div>
            
            <div className='cu2025-contact-btn-dev'>
            <button className="cu2025-contact-btn" onClick={goTocontactForm}>
              Send a Message
            </button>
            </div>
            
            {/* Social Icons */}
            <div className="cu2025-socials">
              <a
                 href="https://wa.me/8801977784132"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="mailto:info@insigniatravel.com" title="Email">
                <i className="fa-solid fa-envelope"></i>
              </a>
            </div>

            {/* Accordion Section */}
            <div className="cu2025-faq-section">
              {faqs.map((item, index) => (
                <div
                  key={index}
                  className={`cu2025-faq-item ${
                    openIndex === index ? 'active' : ''
                  }`}
                >
                  <button
                    className="cu2025-faq-question"
                    onClick={() => toggleAccordion(index)}
                  >
                    <span>{item.question}</span>
                    <i
                      className={`fa-solid ${
                        openIndex === index
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down'
                      }`}
                    ></i>
                  </button>
                  <div
                    className="cu2025-faq-answer"
                    style={{
                      maxHeight: openIndex === index ? '200px' : '0',
                    }}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cu2025-cta">
        <h2>Ready to Begin Your Journey?</h2>
        <p>Create unforgettable experiences with our exclusive packages.</p>
        <a href="/tour-packages-list" className="cu2025-cta-btn">View Packages</a>
      </section>
    </div>
  );
};

export default ContactUs;
