import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TableContentEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ["blockquote", "code-block"],
          ["link", "clean"],
        ],
      },
      formats: [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "indent",
        "align",
        "color",
        "background",
        "blockquote",
        "code-block",
        "link",
      ],
      placeholder: "Add Link here...",
    });

    if (value) {
      quillRef.current.root.innerHTML = value;
    }

    quillRef.current.on("text-change", () => {
      const html = quillRef.current.root.innerHTML;
      onChange(html);
    });

    return () => {
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div>
      <h2 style={{ marginBottom: "1rem",fontSize:'18px',color:'#333',fontFamily:'Poppins',fontWeight:'700',textAlign:'center' }}>Content part Link (optional*)</h2>
      <div
        ref={editorRef}
        style={{
          height: "400px",
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
    </div>
  );
};

export default TableContentEditor;
