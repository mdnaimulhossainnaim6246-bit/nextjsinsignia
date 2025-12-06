

import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const styles = {
  container: {
    maxWidth: 700,
    margin: "auto",
    padding:  20,
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  headerInput: {
    width: "250px",
    border: "1px solid rgb(17, 17, 17)", 
    height: "40px",
    padding: "8px 16px",
    color: "#111",
    borderRadius: 6,
    fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none",
  },
  uploadLabel: {
    display: "inline-block",
    cursor: "pointer",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgb(204, 204, 204)",
    borderRadius: 10,
    width: 150,
    height: 100,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#fafafa",
    transition: "border-color 0.2s ease",
    flexShrink: 0,
  },
  uploadLabelHover: {
    borderColor: "#333",
  },
  hiddenInput: {
    display: "none",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0,
  },
  uploadPlaceholder: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#888",
    fontSize: 13,
    textAlign: "center",
    pointerEvents: "none",
    lineHeight: 1.2,
    whiteSpace: "pre-wrap",
  },
  editorWrapper: {
    marginBottom: 30,
  },
};

// Simple image upload box reused
const ImageUploadBox = ({ label, image, setImage, alt, setAlt, id }) => {
  const [hover, setHover] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (image) {
      const url = typeof image === "string" ? image : URL.createObjectURL(image);
      setPreviewUrl(url);
      return () => {
        if (typeof image !== "string") URL.revokeObjectURL(url);
        setPreviewUrl(null);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  return (
    <div style={{ position: "relative" }}>
      <label
        htmlFor={id}
        style={{
          ...styles.uploadLabel,
          ...(hover ? styles.uploadLabelHover : {}),
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label={label}
      >
        {!previewUrl && (
          <div style={styles.uploadPlaceholder}>
            {label}
            <br />
            Click to upload
          </div>
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length) setImage(e.target.files[0]);
            else setImage(null);
          }}
          style={styles.hiddenInput}
          aria-describedby={`${id}-desc`}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt={alt || `${label} preview`}
            style={styles.imagePreview}
            draggable={false}
          />
        )}
      </label>
      {previewUrl && (
        <input
          type="text"
          placeholder="Enter alt text"
          value={alt || ""}
          onChange={(e) => setAlt(e.target.value)}
          style={{
            position: 'absolute',
            bottom: '0px',
            left: '0px',
            width: '100%',
            padding: '5px',
            backgroundColor: 'rgba(9,9,9,0.8)',
            border: '1px solid #777',
            borderRadius: '0px',
            zIndex: 2,
            color: '#eee'
          }}
        />
      )}
    </div>
  );
};

const CKEditorTableEditor = ({
  value = {
    headerTitle: "",
    locationTitle: "",
    image1: null,
    image2: null,
    alt1: "",
    alt2: "",
    cqeditorTable: "",
  },
  onChange,
}) => {
  const [headerTitle, setHeaderTitle] = useState(value.headerTitle || "");
  const [locationTitle, setLocationTitle] = useState(value.locationTitle || "");
  const [image1, setImage1] = useState(value.image1 || null);
  const [image2, setImage2] = useState(value.image2 || null);
  const [alt1, setAlt1] = useState(value.alt1 || "");
  const [alt2, setAlt2] = useState(value.alt2 || "");
  const [cqeditorTable, setCqeditorTable] = useState(value.cqeditorTable || "");

  // keep local state in sync when parent value changes (edit mode)
  useEffect(() => {
    setHeaderTitle(value.headerTitle || "");
    setLocationTitle(value.locationTitle || "");
    setImage1(value.image1 || null);
    setImage2(value.image2 || null);
    setAlt1(value.alt1 || "");
    setAlt2(value.alt2 || "");
    setCqeditorTable(value.cqeditorTable || "");
  }, [value]);

  useEffect(() => {
    if (onChange) {
      onChange({
        headerTitle,
        locationTitle,
        image1,
        image2,
        alt1,
        alt2,
        cqeditorTable,
      });
    }
  }, [headerTitle, locationTitle, image1, image2, alt1, alt2, cqeditorTable]);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setCqeditorTable(data);
  };


  return (
    <div style={styles.container}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 12,
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <input
          aria-label="Header place name"
          type="text"
          placeholder="Enter header place name"
          value={headerTitle}
          onChange={(e) => setHeaderTitle(e.target.value)}
          style={styles.headerInput}
        />

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <ImageUploadBox
            label="First Image"
            image={image1}
            setImage={setImage1}
            alt={alt1}
            setAlt={setAlt1}
            id="first-image-upload"
          />
        </div>
      </div>

      <div style={styles.editorWrapper}>
        <CKEditor
          editor={ClassicEditor}
          data={cqeditorTable}
          onChange={handleEditorChange}
          config={{
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "insertTable",
              "blockQuote",
              "undo",
              "redo",
            ],
            placeholder: 'Write Place Summary here...',
          }}
        />
      </div>

      
        <div
          style={{
            display: "flex",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 12,
          justifyContent: "space-around",
          alignItems: "center",
          }}
        >
          <ImageUploadBox
            label="Second Image"
            image={image2}
            setImage={setImage2}
            alt={alt2}
            setAlt={setAlt2}
            id="second-image-upload"
          />
          <input
            type="text"
            placeholder="Enter location title (optional)"
            value={locationTitle}
            onChange={(e) => setLocationTitle(e.target.value)}
            style={styles.headerInput}
            aria-label="Location title (optional)"
          />
        </div>
      
    </div>
  );
};

export default CKEditorTableEditor;
