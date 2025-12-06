
// import React, { useState, useEffect } from "react";
// import { Helmet } from "react-helmet-async";
// import "./FAQS.css"; 

// const FAQS = () => {
//   const [faqTitle, setFaqTitle] = useState("");
//   const [faqs, setFaqs] = useState([]);

//   useEffect(() => {
//     const saved = localStorage.getItem("footerFaqsData");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setFaqTitle(parsed.faqTitle || "FAQs — Bangladesh Travel");
//       setFaqs(parsed.faqs || []);
//     }
//   }, []);

//   return (
//     <>
//       {/* 🧠 SEO Meta */}
//       <Helmet>
//         <title>{faqTitle || "FAQs — Bangladesh Travel"}</title>
//         <meta
//           name="description"
//           content="Find answers to common questions about travel in Bangladesh, including best times to visit, tour options, eco-friendly safaris, and more."
//         />
//         <meta
//           name="keywords"
//           content="Bangladesh travel FAQ, Sundarban Safari, Bangladesh tourism, eco tours, travel tips, solo travel, Bangladesh destinations"
//         />
//         <meta property="og:title" content={faqTitle || "Bangladesh Travel FAQ"} />
//         <meta
//           property="og:description"
//           content="Your essential guide to traveling in Bangladesh — from Sundarban safaris to cultural destinations, all your travel questions answered."
//         />
//         <meta property="og:type" content="article" />
//       </Helmet>

//       {/* 💡 Page Content */}
//       <div style={{minHeight:'100vh',maxHeight:'100%',background:'#fff',margin:"0"}}>
//       <div className="faq-container">
//         <h1 className="faq-title">{faqTitle}</h1>

//         {faqs.length > 0 ? (
//           <div className="faq-grid">
//             {faqs.map((faq, index) => (
//               <div key={index} className="faq-item">
//                 <h2 className="faq-question">{faq.question}</h2>
//                 <p className="faq-answer">{faq.answer}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="faq-empty">No FAQs available.</p>
//         )}
//       </div>
//       </div>
//     </>
//   );
// };

// export default FAQS;


import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import "./FAQS.css";
import Mobailenav from "../components/Mobailenav";
import LandingFooter from "../components/LandingFooter";


const FAQS = () => {
  const [faqTitle, setFaqTitle] = useState("");
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("footerFaqsData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFaqTitle(parsed.faqTitle || "FAQs — Bangladesh Travel");
      setFaqs(parsed.faqs || []);
    }
  }, []);

  return (
    <>
      {/* 🧠 SEO Meta */}
      <Helmet>
        {/* Page Title */}
        <title>{faqTitle ? `${faqTitle} — Insignia` : "FAQs — Bangladesh Travel — Insignia"}</title>
      
        {/* Meta Description */}
        <meta
          name="description"
          content="Find answers to all your Bangladesh travel questions in one place. Covering visa requirements, hotels, food, sightseeing, transport, travel costs, safety tips, and essential guidance for international travelers. Travel Bangladesh easily with Insignia."
        />

       {/* Meta Keywords */}
       <meta
         name="keywords"
         content="Bangladesh travel, Bangladesh travel FAQ, hotels in Bangladesh, Bangladesh visa, sightseeing Bangladesh, travel costs Bangladesh, Bangladesh food guide, international travelers, Bangladesh tourism guide"
       />

       {/* Canonical URL */}
       <link rel="canonical" href="https://www.insigniatours.com/faqs" />
     
       {/* Open Graph Tags (Social Sharing) */}
       <meta property="og:title" content={faqTitle ? `${faqTitle} — Insignia` : "FAQs — Bangladesh Travel — Insignia"} />
       <meta
        property="og:description"
        content="Comprehensive guide to traveling in Bangladesh. Get all the answers about hotels, food, visa, sightseeing, transport, costs, and safety tips for international travelers."
      />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Insignia" />
    
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={faqTitle ? `${faqTitle} — Insignia` : "FAQs — Bangladesh Travel — Insignia"} />
      <meta
        name="twitter:description"
        content="Your complete FAQ guide to traveling in Bangladesh. Covers hotels, food, visa, sightseeing, transport, costs, and safety for international visitors."
      />

        {faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })}
          </script>
        )}

    </Helmet>


      {/* 💡 Page Content */}
      <div style={{ minHeight: "100vh", maxHeight: "100%", background: "#fff", margin: "0" }}>
        <div className="footer-faq-container">

          <Mobailenav/>

          <div className="footer-faqs-title-sub-div">
              <h1 className="footer-faq-title">{faqTitle}</h1>
              <h3 className="footer-faq-subtitle">   Comprehensive travel information for Bangladesh — covering visas, accommodations, dining, sightseeing, transportation, expenses, and essential safety tips for international travelers.</h3>
          </div>

          {faqs.length > 0 ? (
            <div className="footer-faq-grid">
              {faqs.map((faq, index) => (
                <div key={index} className="footer-faq-item"><span className="footer-faq-number">{index + 1}.</span>

                <div style={{flexDirection:'row'}}>
                  <h2 className="footer-faq-question">
                     {faq.question}
                  </h2>
                  <p className="footer-faq-answer">{faq.answer}</p>
                </div>
                </div>
              ))}
              
            </div>
          ) : (
            <p className="footer-faq-empty">No FAQs available.</p>
          )}

          <LandingFooter/>
        </div>
      </div>
    </>
  );
};

export default FAQS;
