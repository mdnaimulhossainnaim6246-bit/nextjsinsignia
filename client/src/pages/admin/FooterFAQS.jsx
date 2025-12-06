// import React, { useState, useEffect } from "react";
// import FaqsSection from "../../components/addmin/FaqsSection";
// export default function FooterFAQS() {
//   const [faqTitle, setFaqTitle] = useState("");
//   const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

//   // Load existing data (if any)
//   useEffect(() => {
//     const saved = localStorage.getItem("footerFaqsData");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setFaqTitle(parsed.faqTitle || "");
//       setFaqs(parsed.faqs || [{ question: "", answer: "" }]);
//     }
//   }, []);

//   // Save / Submit data
//   const handleSubmit = () => {
//     const data = { faqTitle, faqs };
//     localStorage.setItem("footerFaqsData", JSON.stringify(data));
//     alert("FAQS Saved Successfully!");
//   };

//   return (
//     <div style={{margin:'5rem 15rem',padding: "20px" }}>
//       <h1 style={{ marginBottom: "15px" }}>Footer FAQS Editor</h1>

//       <FaqsSection
//         faqTitle={faqTitle}
//         setFaqTitle={setFaqTitle}
//         faqs={faqs}
//         setFaqs={setFaqs}
//       />

//       <button
//         style={{
//           marginTop: "20px",
//           padding: "10px 20px",
//           background: "#4CAF50",
//           color: "white",
//           border: "none",
//           borderRadius: "6px",
//           cursor: "pointer",
//           fontSize: "16px",
//         }}
//         onClick={handleSubmit}
//       >
//         Save FAQS
//       </button>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import FaqsSection from "../../components/addmin/FaqsSection";
import toast, { Toaster } from "react-hot-toast";

export default function FooterFAQS() {
  const [faqTitle, setFaqTitle] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  // Load existing data (if any)
  useEffect(() => {
    const saved = localStorage.getItem("footerFaqsData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFaqTitle(parsed.faqTitle || "");
      setFaqs(parsed.faqs || [{ question: "", answer: "" }]);
    }
  }, []);

  const handleSubmit = () => {
    // ✅ Native confirm dialog with OK + Cancel
    const isConfirmed = window.confirm("Do you want to save FAQS?");
    if (!isConfirmed) return; // Cancel pressed → do nothing

    // Save data
    const data = { faqTitle, faqs };
    localStorage.setItem("footerFaqsData", JSON.stringify(data));

    // ✅ Toast
    toast.success("FAQS Updated Successfully!", {
      duration: 4000,
      style: {
        borderRadius: "6px",
        top:'-300px'
       
       
      },
    });
  };

  return (
    <div style={{ margin: "5rem 15rem", padding: "20px" }}>
      {/* Toast container */}
      <Toaster position="top-right" />

      <h1 style={{ marginBottom: "15px",color:'#4a90bd',fontWeight:'600',fontSize:'2.2rem',textAlign:'center' }}>Footer FAQS Editor</h1>

      <FaqsSection
        faqTitle={faqTitle}
        setFaqTitle={setFaqTitle}
        faqs={faqs}
        setFaqs={setFaqs}
      />

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          marginLeft:'2rem'
        }}
        onClick={handleSubmit}
      >
        Save FAQS
      </button>
    </div>
  );
}

