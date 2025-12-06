// // components/addmin/DynamicContentBuilder.jsx

// import React, { useState, useRef, useEffect, memo } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";

// const THEME_OPTIONS = [
//   { value: "theme1", label: "Light Blue", color: "#d0e8ff" },
//   { value: "theme2", label: "Light Green", color: "#d4edda" },
//   { value: "theme3", label: "Light Yellow", color: "#fff3cd" },
//   { value: "theme4", label: "Light Pink", color: "#f8d7da" },
//   { value: "theme5", label: "Light Gray", color: "#e2e3e5" },
// ];

// const QuillEditor = memo(({ value, onChange }) => {
//   const editorRef = useRef(null);
//   const quillRef = useRef(null);

//   useEffect(() => {
//     if (editorRef.current && !quillRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             ["bold", "italic", "underline", "strike"],
//             [{ header: [1, 2, 3, false] }],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ color: [] }, { background: [] }],
//             ["link", "clean"],
//           ],
//         },
//         placeholder: "Write something...",
//       });

//       quillRef.current.on("text-change", (delta, oldDelta, source) => {
//         if (source === "user") {
//           onChange(quillRef.current.root.innerHTML);
//         }
//       });
//     }
//   }, [onChange]);

//   useEffect(() => {
//     if (!quillRef.current) return;

//     const editor = quillRef.current;
//     const currentHTML = editor.root.innerHTML;

//     const normalize = (str) => str.replace(/\s/g, "").toLowerCase();

//     if (normalize(value || "") !== normalize(currentHTML)) {
//       const selection = editor.getSelection();
//       editor.clipboard.dangerouslyPasteHTML(value || "");
//       if (selection) {
//         try {
//           editor.setSelection(selection.index, selection.length);
//         } catch (e) {}
//       }
//     }
//   }, [value]);

//   return (
//     <div
//       ref={editorRef}
//       style={{
//         border: "1px solid #ccc",
//         borderRadius: 4,
//         minHeight: 120,
//         marginTop: 6,
//       }}
//     />
//   );
// });

// const useObjectURL = (file) => {
//   const [url, setUrl] = useState(null);

//   useEffect(() => {
//     if (!file) {
//       setUrl(null);
//       return;
//     }
//     if (typeof file === "string") {
//       setUrl(file);
//       return;
//     }

//     const objectUrl = URL.createObjectURL(file);
//     setUrl(objectUrl);

//     return () => {
//       URL.revokeObjectURL(objectUrl);
//     };
//   }, [file]);

//   return url;
// };

// const BlockType1 = ({ data, onChange, onRemove }) => {
//   const { description, id } = data;
//   const [image, setImage] = useState(data.image || null);
//   const imageUrl = useObjectURL(image);

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImage(file);
//       onChange({ ...data, image: file });
//     }
//   };

//   return (
//     <div
//       className="block-type block-type-1"
//       style={{
//         padding: 12,
//         marginBottom: 20,
//         border: "1px solid #aaa",
//         borderRadius: 8,
//       }}
//     >
//       <h4 className="add-tour-upload-des-q">Content Blog</h4>

//       <input
//         type="file"
//         accept="image/*"
//         id={`file-input-block1-${id}`}
//         style={{ display: "none" }}
//         onChange={handleImageChange}
//       />

//       <label
//         htmlFor={`file-input-block1-${id}`}
//         style={{
//           display: "inline-block",
//           width: 150,
//           height: 100,
//           border: "1px dashed #ccc",
//           borderRadius: 6,
//           cursor: "pointer",
//           overflow: "hidden",
//           backgroundColor: "#f9f9f9",
//           marginBottom: 10,
//           userSelect: "none",
//           textAlign: "center",
//           lineHeight: "100px",
//           color: "#aaa",
//           fontSize: 14,
//         }}
//       >
//         {imageUrl ? (
//           <img
//             src={imageUrl}
//             alt="selected"
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         ) : (
//           "Choose Image"
//         )}
//       </label>

//       <QuillEditor
//         value={description || ""}
//         onChange={(val) => onChange({ ...data, description: val, image })}
//       />

//       <button
//         type="button"
//         style={{
//           marginTop: 10,
//           backgroundColor: "#e74c3c",
//           color: "white",
//           border: "none",
//           padding: "6px 12px",
//           borderRadius: 4,
//           cursor: "pointer",
//         }}
//         onClick={onRemove}
//       >
//         Remove
//       </button>
//     </div>
//   );
// };

// const BlockType2 = ({ data, onChange, onRemove }) => {
//   const { description, theme, id } = data;
//   const [image, setImage] = useState(data.image || null);
//   const imageUrl = useObjectURL(image);

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImage(file);
//       onChange({ ...data, image: file });
//     }
//   };

//   const handleThemeChange = (val) => {
//     onChange({ ...data, theme: val, image });
//   };

//   return (
//     <div
//       className="block-type block-type-2"
//       style={{
//         padding: 12,
//         marginBottom: 20,
//         border: "1px solid #444",
//         borderRadius: 8,
//         backgroundColor:
//           THEME_OPTIONS.find((t) => t.value === theme)?.color || "transparent",
//       }}
//     >
//       <h4 className="add-tour-upload-des-q">Author Block</h4>

//       <input
//         type="file"
//         accept="image/*"
//         id={`file-input-block2-${id}`}
//         style={{ display: "none" }}
//         onChange={handleImageChange}
//       />

//       <label
//         htmlFor={`file-input-block2-${id}`}
//         style={{
//           display: "inline-block",
//           width: 150,
//           height: 100,
//           border: "1px dashed #ccc",
//           borderRadius: 6,
//           cursor: "pointer",
//           overflow: "hidden",
//           backgroundColor: "#f9f9f9",
//           marginBottom: 10,
//           userSelect: "none",
//           textAlign: "center",
//           lineHeight: "100px",
//           color: "#aaa",
//           fontSize: 14,
//         }}
//       >
//         {imageUrl ? (
//           <img
//             src={imageUrl}
//             alt="selected"
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         ) : (
//           "Choose Image"
//         )}
//       </label>

//       <QuillEditor
//         value={description || ""}
//         onChange={(val) =>
//           onChange({
//             ...data,
//             description: val,
//             image,
//             theme,
//           })
//         }
//       />

//       <div style={{ marginTop: 12 }}>
//         <strong className="Choose-Theme-Background">Choose Background:</strong>
//         <div style={{ display: "flex", gap: 10, marginTop: 1 }}>
//           {THEME_OPTIONS.map((t) => (
//             <div
//               key={t.value}
//               onClick={() => handleThemeChange(t.value)}
//               style={{
//                 cursor: "pointer",
//                 width: 30,
//                 height: 30,
//                 borderRadius: 4,
//                 backgroundColor: t.color,
//                 border: theme === t.value ? "3px solid #000" : "1px solid #ccc",
//               }}
//               title={t.label}
//             />
//           ))}
//         </div>
//       </div>

//       <button
//         type="button"
//         style={{
//           marginTop: 10,
//           backgroundColor: "#e74c3c",
//           color: "white",
//           border: "none",
//           padding: "6px 12px",
//           borderRadius: 4,
//           cursor: "pointer",
//         }}
//         onClick={onRemove}
//       >
//         Remove
//       </button>
//     </div>
//   );
// };

// const BlockType3 = ({ data, onChange, onRemove }) => {
//   const { description, theme } = data;

//   const handleThemeChange = (val) => {
//     onChange({ ...data, theme: val });
//   };

//   return (
//     <div
//       className="block-type block-type-3"
//       style={{
//         padding: 12,
//         marginBottom: 20,
//         border: "1px solid #777",
//         borderRadius: 8,
//         backgroundColor:
//           THEME_OPTIONS.find((t) => t.value === theme)?.color || "transparent",
//       }}
//     >
//       <h4 className="add-tour-upload-des-q">Link Block</h4>
//       <QuillEditor
//         value={description || ""}
//         onChange={(val) => onChange({ ...data, description: val })}
//       />

//       <div style={{ marginTop: 12 }}>
//         <strong className="Choose-Theme-Background">Choose Background:</strong>
//         <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
//           {THEME_OPTIONS.map((t) => (
//             <div
//               key={t.value}
//               onClick={() => handleThemeChange(t.value)}
//               style={{
//                 cursor: "pointer",
//                 width: 30,
//                 height: 30,
//                 borderRadius: 4,
//                 backgroundColor: t.color,
//                 border: theme === t.value ? "3px solid #000" : "1px solid #ccc",
//               }}
//               title={t.label}
//             />
//           ))}
//         </div>
//       </div>

//       <button
//         type="button"
//         style={{
//           marginTop: 10,
//           backgroundColor: "#e74c3c",
//           color: "white",
//           border: "none",
//           padding: "6px 12px",
//           borderRadius: 4,
//           cursor: "pointer",
//         }}
//         onClick={onRemove}
//       >
//         Remove
//       </button>
//     </div>
//   );
// };

// const DynamicContentBuilder = ({ value: blocks = [], onChange }) => {
//   const addBlock = (type) => {
//     if (!onChange) return;
//     const id = `${Date.now()}-${Math.random()}`;
//     let newBlock;
//     if (type === 1) {
//       newBlock = { id, type: "block1", image: null, description: "" };
//     } else if (type === 2) {
//       newBlock = {
//         id,
//         type: "block2",
//         image: null,
//         description: "",
//         theme: "theme1",
//       };
//     } else if (type === 3) {
//       newBlock = { id, type: "block3", description: "", theme: "theme1" };
//     }
//     onChange([...blocks, newBlock]);
//   };

//   const updateBlock = (index, newData) => {
//     if (!onChange) return;
//     const updated = [...blocks];
//     updated[index] = { ...updated[index], ...newData };
//     onChange(updated);
//   };

//   const removeBlock = (index) => {
//     if (!onChange) return;
//     const updated = [...blocks];
//     updated.splice(index, 1);
//     onChange(updated);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 700,
//         marginTop: "30px",
//         textAlign: "center",
//         fontSize: "22px",
//       }}
//     >
//       <h2>Dynamic Content Builder</h2>

//       <>
//         {blocks.map((block, i) => {
//           if (block.type === "block1") {
//             return (
//               <BlockType1
//                 key={block.id}
//                 data={block}
//                 onChange={(data) => updateBlock(i, data)}
//                 onRemove={() => removeBlock(i)}
//               />
//             );
//           }
//           if (block.type === "block2") {
//             return (
//               <BlockType2
//                 key={block.id}
//                 data={block}
//                 onChange={(data) => updateBlock(i, data)}
//                 onRemove={() => removeBlock(i)}
//               />
//             );
//           }
//           if (block.type === "block3") {
//             return (
//               <BlockType3
//                 key={block.id}
//                 data={block}
//                 onChange={(data) => updateBlock(i, data)}
//                 onRemove={() => removeBlock(i)}
//               />
//             );
//           }
//           return null;
//         })}
//       </>

//       <div
//         style={{
//           marginBottom: 20,
//           marginTop: "5px",
//           textAlign: "center",
//           fontSize: "16px",
//         }}
//       >
//         <button
//           type="button"
//           onClick={() => addBlock(1)}
//           style={{ padding: "8px 16px" }}
//         >
//           Add Content Block
//         </button>
//         <button
//           type="button"
//           onClick={() => addBlock(2)}
//           style={{ padding: "8px 16px" }}
//         >
//           Add Author Block
//         </button>
//         <button
//           type="button"
//           onClick={() => addBlock(3)}
//           style={{ padding: "8px 16px" }}
//         >
//           Add Link Block
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DynamicContentBuilder;
