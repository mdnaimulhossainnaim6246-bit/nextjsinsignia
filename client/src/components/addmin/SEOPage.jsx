import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";

const SEOPage = forwardRef(({ defaultTitle = "", defaultDescription = "", defaultKeywords = "" }, ref) => {
  const [seotitle, setSeoTitle] = useState(defaultTitle);
  const [seodescription, setSeoDescription] = useState(defaultDescription);
  const [seokeywords, setSeoKeywords] = useState(defaultKeywords);

  useEffect(() => {
    setSeoTitle(defaultTitle);
    setSeoDescription(defaultDescription);
    setSeoKeywords(defaultKeywords);
  }, [defaultTitle, defaultDescription, defaultKeywords]);

  useImperativeHandle(ref, () => ({
    getSEOData: () => {
      return {
        seotitle,
        seodescription,
        seokeywords,
      };
    },
  }));

  const containerStyle = {
    padding: "2rem 2rem 3rem 2rem",
    minHeight: "100%",
    backgroundColor: "#1e1e2f",
    color: "#f0f0f5",
    fontFamily: "'Poppins', sans-serif",
    
  };

  const inputStyle = {
    width: "100%",
    padding: "0.6rem 0.8rem",
    marginTop: "0.25rem",
    borderRadius: "8px",
    border: "1px solid #444",
    backgroundColor: "#2a2a3d",
    color: "#f0f0f5",
    outline: "none",
    fontSize: "1rem",
  };

  const labelStyle = {
    fontWeight: "500",
    fontSize: "0.95rem",
    marginBottom: "0.25rem",
    display: "block",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "120px",
    resize: "vertical",
  };

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "600px",
    backgroundColor: "#2c2c44",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  };

  const titleStyle = {
    marginBottom: "2rem",
    fontSize: "2rem",
    fontWeight: "700",
    textAlign: "center",
    color: "#ffffff",
  };

  return (
    <div style={{padding:"1rem 0"}}>
    <div style={containerStyle}>
      <h1 style={titleStyle}>Dynamic SEO Meta Section</h1>

      <div style={cardStyle}>
        <div>
          <label htmlFor="title" style={labelStyle}>Title:</label>
          <input
            type="text"
            id="title"
            value={seotitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Enter page title"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="description" style={labelStyle}>Description:</label>
          <textarea
            id="description"
            value={seodescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Enter meta description"
            style={textareaStyle}
          />
        </div>

        <div>
          <label htmlFor="keywords" style={labelStyle}>Keywords:</label>
          <input
            type="text"
            id="keywords"
            value={seokeywords}
            onChange={(e) => setSeoKeywords(e.target.value)}
            placeholder="Enter meta keywords"
            style={inputStyle}
          />
        </div>
      </div>
    </div>
    </div>
  );
});

export default SEOPage;
