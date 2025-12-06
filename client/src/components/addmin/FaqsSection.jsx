// import React from "react";
// import "./FaqsSection.css";

// export default function FaqsSection({
//   faqTitle,
//   setFaqTitle,
//   faqs,
//   setFaqs,
// }) {
//   const addFaq = () => setFaqs([...faqs, { question: "", answer: "" }]);
//   const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));

//   const handleChange = (index, field, value) => {
//     const updated = [...faqs];
//     updated[index][field] = value;
//     setFaqs(updated);
//   };

//   return (
//     <div className="faq-container">
//       <h2 className="faq-heading">Add FAQs Section</h2>

//       <div className="faq-title-box">
//         <label>FAQ Title:</label>
//         <input
//           type="text"
//           value={faqTitle}
//           onChange={(e) => setFaqTitle(e.target.value)}
//           placeholder="FAQS Title"
//         />
//       </div>

//       <div>
//         {faqs.map((faq, index) => (
//           <div className="faq-item" key={index}>
//             <div className="faq-field">
//               <label>Question:</label>
//               <input
//                 type="text"
//                 value={faq.question}
//                 onChange={(e) =>
//                   handleChange(index, "question", e.target.value)
//                 }
//                 placeholder="Enter question"
//               />
//             </div>

//             <div className="faq-field">
//               <label>Answer:</label>
//               <textarea
//                 value={faq.answer}
//                 onChange={(e) => handleChange(index, "answer", e.target.value)}
//                 placeholder="Enter answer"
//               />
//             </div>

//             <div className="faq-actions">
//               {index === faqs.length - 1 && (
//                 <button
//                   type="button"
//                   onClick={addFaq}
//                 >
//                   <i className="add-btn fa fa-plus"></i>
//                 </button>
//               )}
//               {faqs.length > 1 && (
//                 <button
//                   type="button"
                  
//                   onClick={() => removeFaq(index)}
//                 >
//                   <i className="faqs-remove-btn fa fa-minus"></i>
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React from "react";

export default function FaqsSection({ faqTitle, setFaqTitle, faqs, setFaqs }) {
  const addFaq = (index) => {
    const updated = [...faqs];
    updated.splice(index + 1, 0, { question: "", answer: "" });
    setFaqs(updated);
  };

  const removeFaq = (index) => setFaqs(faqs.filter((_, i) => i !== index));

  const handleChange = (index, field, value) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  return (
    <>
      <style>{`
        .faq-container {
          max-width: 100%;
          background: transparent;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }

        .faq-heading {
          text-align: center;
          font-size: 1.5rem;
          font-style:italic;
          margin-bottom: 1.5rem;
          color: #eee;
        }

        .faq-title-box {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .faq-title-box label {
          font-weight: 500;
          margin-bottom: 0.4rem;
        }

        .faq-title-box input {
          border: 1px solid #d0d0d0;
          border-radius: 0.5rem;
          padding: 0.6rem 0.8rem;
          font-size: 1rem;
        }

        .faq---item {
          position: relative;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .faq-field {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
        }

        .faq-field input,
        .faq-field textarea {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.6rem 0.8rem;
          font-size: 0.95rem;
        }

        .faq-actions {
          position: absolute;
          top: 0.8rem;
          right: 0.8rem;
          display: flex;
          gap: 0.4rem;
        }

        .add-btn {
          background: #22c55e;
          position: absolute;
          top: -5px;
          right: 70px;
          border: none;
          color: #ffffff;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
        }

        .faqs-remove-btn {
          background: #ef4444;
          position: absolute;
          top: -5px;
          right: 15px;
          border: none;
          color: #fff;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>

      <div className="faq-container">
        <h2 className="faq-heading">Add FAQs Section</h2>

        <div className="faq-title-box">
          <label>FAQ Title:</label>
          <input
            type="text"
            value={faqTitle}
            onChange={(e) => setFaqTitle(e.target.value)}
            placeholder="FAQS Title"
          />
        </div>

        <div>
          {faqs.map((faq, index) => (
            <div className="faq---item" key={index}>
              <div className="faq-field">
                <label>Question:</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleChange(index, "question", e.target.value)}
                  placeholder="Enter question"
                />
              </div>

              <div className="faq-field">
                <label>Answer:</label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => handleChange(index, "answer", e.target.value)}
                  placeholder="Enter answer"
                />
              </div>

              <div className="faq-actions">
                <button type="button" onClick={() => addFaq(index)}>
                  <i className="add-btn fa fa-plus"></i>
                </button>

                {faqs.length > 1 && (
                  <button type="button" onClick={() => removeFaq(index)}>
                    <i className="faqs-remove-btn fa fa-minus"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}