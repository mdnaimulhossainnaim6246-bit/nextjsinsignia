
// components/addmin/DynamicContentBuilder.jsx

import React, { useState, useRef, useEffect, memo } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import 'quill/dist/quill.core.css';
// import '../../pages/admin/quill-castom.css'

const THEME_OPTIONS = [
  { value: "theme1", label: "White", color: "#ffffff" },
  { value: "theme2", label: "Transparent", color: "transparent" },
  // --- Dark Blue / Indigo ---
  { value: "theme21", label: "dark Blue", color: "#112c77" },
  { value: "theme22", label: "deep Blue", color: "#0b2f82" },
  { value: "theme3", label: "dark indigo", color: "#252565" },
  { value: "theme4", label: "dark slate blue", color: "#1F305E" },
  { value: "theme5", label: "navy indigo", color: "#1B1B4B" },
  { value: "theme6", label: "deep purple-blue", color: "#2A1A5E" },

  // --- Purple / Eggplant ---
  { value: "theme7", label: "dark purple", color: "#562B6E" },
  { value: "theme8", label: "deep eggplant", color: "#42275A" },
  { value: "theme9", label: "vibrant purple", color: "#8338EC" },

  // --- Teal / Green ---
  { value: "theme10", label: "dark cyan", color: "#1A535C" },
  { value: "theme11", label: "dark olive green", color: "#3E4C3C" },
  { value: "theme12", label: "Light Green", color: "#007bff" },

  // --- Brown / Neutral / Gray ---
  { value: "theme13", label: "dark brown", color: "#4A3F35" },
  { value: "theme14", label: "charcoal", color: "#3B3B3B" },
  { value: "theme15", label: "dark desaturated", color: "#2d4d4d" },

  // --- Red / Orange ---
  { value: "theme16", label: "crimson red.", color: "#E71D36" },
  { value: "theme17", label: "vivid orange-red", color: "#FF3700" },

  // --- Light / Pastel ---
  { value: "theme18", label: "light pastel green", color: "#bffcc4" },
  { value: "theme19", label: "pale cream", color: "#fcecbf" },
  { value: "theme20", label: "pale sky blue", color: "#e0f0ff" },
  

  // --- Gradients ---
  { value: "theme23", label: "Gradient 1", color: "linear-gradient(135deg, #BFFCC4, #88E0A1)" },
  { value: "theme24", label: "Gradient 2", color: "linear-gradient(135deg, #FCECBF, #FADFA0)" },
  { value: "theme25", label: "Gradient 3", color: "linear-gradient(135deg, #E0F0FF, #B8DFFF)" },
  { value: "theme26", label: "Gradient 4", color: "linear-gradient(135deg, #457B9D, #1A535C)" },
  { value: "theme27", label: "Gradient 6", color: "linear-gradient(135deg, #3E4C3C, #1A535C)" },
  { value: "theme28", label: "Gradient 7", color: "linear-gradient(135deg, #3B3B3B, #2C2C2C)" },
  { value: "theme29", label: "Gradient 8", color: "linear-gradient(135deg, #1F305E, #252565)" },
  { value: "theme30", label: "Gradient 9", color: "linear-gradient(135deg, #1B1B4B, #2A1A5E)" },
  { value: "theme31", label: "Gradient 5", color: "linear-gradient(135deg, #42275A, #562B6E)" },
  { value: "theme32", label: "Gradient 10", color: "linear-gradient(135deg, #E71D36, #833844)" },
  { value: "theme33", label: "Gradient 11", color: "linear-gradient(135deg, #562B6E, #8338EC)" },
  { value: "theme34", label: "Gradient 12", color: "linear-gradient(135deg, #1A535C, #205072)" },
  { value: "theme35", label: "Gradient 13", color: "linear-gradient(135deg, #252565, #42275A)" },
];

const QuillEditor = memo(({ value, onChange }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const lastHtml = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);


  const Color = Quill.import("formats/color");
  Color.whitelist = [
  // Blacks / Dark Grays
  "#000000",
  "#111111",
  "#222222",
  "#333333",
  "#444444",
  "#555555",
  "#666666",
  "#777777",
  "#888888",
  "#999999",

  // Whites / Light Grays
  "#FFFFFF",
  "#FEFEFE",
  "#FDFDFD",
  "#FCFCFC",
  "#FBFBFB",
  "#FAFAFA",
  "#F5F5F5",
  "#F0F0F0",
  "#EDEDED",
  "#E0E0E0",
   
  "#006400", // Dark Green
"#007A33", // Forest Green
"#008A00", // Green
"#009933", // Medium Green
"#00B386", // Teal Green
"#00CC66", // Limeish Green
"#33D699", // Light Green
"#66E0AA", // Pastel Green
"#99F0C0", // Very Light Green
"#BFFCC4", // Light Pastel Green
   
"#E71D36", // Crimson Red
"#FF1A1A", // Red
"#FF3700", // Vivid Orange-Red
"#FF5733", // Tomato
"#FF6B6B", // Coral Red
"#FF8C42", // Orange
"#FFA500", // Pure Orange
"#FFB800", // Amber
"#FF8562", // Amber
"#FFC966", // Light Orange
"#FFD699", // Pastel Orange

"#112C77", // Dark Blue
"#0B2F82", // Deep Blue
"#252565", // Dark Indigo
"#1F305E", // Slate Blue
"#1B1B4B", // Navy Indigo
"#2A1A5E", // Deep Purple-Blue
"#457B9D", // Sky Blue
"#66A3D2", // Light Blue
"#007bff", // Light Blue
"#88C0E0", // Baby Blue
"#8338EC", 
"#4a90bd", 
"#5eb3d6", 
"#2c5282", 
"#55bde9",
"#457b9d",
"#1e3a5f",


  "#e60000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  // Existing bright / dark colors
  "#E71D36", // Crimson Red
  "#FF3700", // Vivid Orange-Red
  "#112C77", // Dark Blue
  "#0B2F82", // Deep Blue
  "#252565", // Dark Indigo
  "#1F305E", // Dark Slate Blue
  "#1B1B4B", // Navy Indigo
  "#2A1A5E", // Deep Purple-Blue
  "#562B6E", // Dark Purple
  "#42275A", // Deep Eggplant
  "#8338EC", // Vibrant Purple
  "#1A535C", // Dark Cyan
  "#3E4C3C", // Dark Olive Green
  "#007BFF", // Light Green / Blue
  "#4A3F35", // Dark Brown
  "#3B3B3B", // Charcoal
  "#2D4D4D", // Dark Desaturated
  "#BFFCC4", // Light Pastel Green
  "#FCECBF", // Pale Cream
  "#E0F0FF", // Pale Sky Blue
  "#FFB800", // Amber
  "#FF6B6B", // Coral Red
  "#6A4C93", // Dark Violet
  "#5F4B8B", // Indigo-ish
  "#2A9D8F", // Teal
  "#264653", // Dark Teal Blue
  "#F4A261", // Light Orange
  "#E9C46A", // Light Yellow
  "#A8DADC", // Light Cyan
];


  Quill.register(Color, true);

  const Background = Quill.import('formats/background');
  Background.whitelist = Color.whitelist;
  Quill.register(Background, true);


 useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
       modules: {
  toolbar: [
  [{ header: [1, 2, 3, 4,5,6, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: Color.whitelist }, { background: Color.whitelist }],  
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "code-block"],
  ["link", "video", "clean"],
],
},

        formats: [
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "color",
          "background",
          "list",
          // "bullet",
          "blockquote",
          "code-block",
          "link",
           "video"
          // "clean",
        ],
        placeholder: "Write something...",
      });

      if (value) {
        quillRef.current.root.innerHTML = value;
        lastHtml.current = quillRef.current.root.innerHTML;
      }

      quillRef.current.on("text-change", (delta, oldDelta, source) => {
        if (source === "user") {
          const html = quillRef.current.root.innerHTML;
          if (html !== lastHtml.current) {
            lastHtml.current = html;
            onChangeRef.current(html);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!quillRef.current) return;
    const editor = quillRef.current;
    const currentHTML = editor.root.innerHTML;

    if (value !== currentHTML && value !== lastHtml.current) {
      const selection = editor.getSelection();
      editor.root.innerHTML = value || "";
      lastHtml.current = editor.root.innerHTML;
      if (selection && selection.index <= editor.getLength()) {
        editor.setSelection(selection.index, selection.length);
      }
    }
  }, [value]);

  return (
    <div
      ref={editorRef}
      style={{
        border: "1px solid #ccc",
        borderRadius: 4,
        minHeight: 120,
        marginTop: 6,
      }}
    />
  );
});

const useObjectURL = (file) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    if (typeof file === "string") {
      setUrl(file);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return url;
};

const BlockType1 = ({ data, onChange, onRemove }) => {
  const { description, subtitle, idName, id, image, alt } = data;
  const imageUrl = useObjectURL(image);

  const updateField = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onChange({
        ...data,
        image: file,
      });
    }
  };

  return (
    <div
      id={idName || undefined}
      className="block-type block-type-1"
      style={{
        padding: 12,
        marginBottom: 20,
        border: "1px solid #aaa",
        borderRadius: 8,
        background:'#fff'
      }}
    >
      <h4 style={{ marginBottom: "1rem",fontSize:'18px',color:'#333',fontFamily:'Poppins',fontWeight:'700',textAlign:'center' }}>Content Blog</h4>
      <div className="subtitle-id-container">
        <input
          type="text"
          placeholder="Enter Content Title"
          value={subtitle || ""}
          onChange={(e) => updateField("subtitle", e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Content Id"
          value={idName || ""}
          onChange={(e) => updateField("idName", e.target.value)}
        />
      </div>

      <input
        type="file"
        accept="image/*"
        id={`file-input-block1-${id}`}
        style={{ display: "none" }}
        onChange={handleImageChange}
      />

      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
        <label
          htmlFor={`file-input-block1-${id}`}
          style={{
            display: "block",
            width: 150,
            height: 100,
            border: "1px dashed #ccc",
            borderRadius: 6,
            cursor: "pointer",
            overflow: "hidden",
            backgroundColor: "#f9f9f9",
            userSelect: "none",
            textAlign: "center",
            lineHeight: "100px",
            color: "#aaa",
            fontSize: 14,
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={alt || "selected"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            "Choose Image"
          )}
        </label>
        {imageUrl && (
          <input
            type="text"
            placeholder="Enter alt text"
            value={alt || ""}
            onChange={(e) => updateField("alt", e.target.value)}
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

      <QuillEditor 
        key={id}
        value={description || ""}
        onChange={(val) => updateField("description", val)}
      />
      

      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          style={{
            marginTop: 10,
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: "17px",
          }}
          onClick={onRemove}
        >
          Remove
        </button>
      </div>
    </div>
  );
};


const BlockType2 = ({ data, onChange, onRemove }) => {


  const { description, theme, idName, subtitle, id, image, alt } = data;


  const imageUrl = useObjectURL(image);





  const updateField = (field, value) => {


    onChange({


      ...data,


      [field]: value,


    });


  };





 const handleImageChange = (e) => {


  if (e.target.files && e.target.files[0]) {


    const file = e.target.files[0];


    onChange({


      ...data,


      image: file,


    });


  }


};








  const handleThemeChange = (val) => {


    onChange({ ...data, theme: val });


  };





  return (


    <div


      id={data.idName || undefined}


      className="block-type block-type2"


      style={{


        background:'#d5eff5',


        padding: 12,


        marginBottom: 20,


        border: "1px solid #444",


        borderRadius: 8,


        width:'100%'


      }}


    >


      <h4 style={{ marginBottom: "1rem",fontSize:'18px',color:'#333',fontFamily:'Poppins',fontWeight:'700',textAlign:'center' }}>Author Block</h4>


      <div className="subtitle-id-container">


        <input


          type="text"


          placeholder="Enter Content Title"


          value={subtitle || ""}


          onChange={(e) => updateField("subtitle", e.target.value)}


        />


        <input


          type="text"


          placeholder="Enter Content Id"


          value={idName || ""}


          onChange={(e) => updateField("idName", e.target.value)}


        />


      </div>





      <div


        style={{


          background:


            THEME_OPTIONS.find((t) => t.value === theme)?.color || "transparent",


        }}


      >


        <input


          type="file"


          accept="image/*"


          id={`file-input-block2-${id}`}


          style={{ display: "none" }}


          onChange={handleImageChange}


        />





        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>


          <label


            htmlFor={`file-input-block2-${id}`}


            style={{


              display: "block",


              width: 150,


              height: 100,


              border: "1px dashed #ccc",


              borderRadius: 6,


              cursor: "pointer",


              overflow: "hidden",


              backgroundColor: "#f9f9f9",


              userSelect: "none",


              textAlign: "center",


              lineHeight: "100px",


              color: "#aaa",


              fontSize: 14,


            }}


          >


            {imageUrl ? (


              <img


                src={imageUrl}


                alt={alt || "selected"}


                style={{ width: "100%", height: "100%", objectFit: "cover" }}


              />


            ) : (


              "Choose Image"


            )}


          </label>


          {imageUrl && (


            <input


              type="text"


              placeholder="Enter alt text"


              value={alt || ""}


              onChange={(e) => updateField("alt", e.target.value)}


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





        <QuillEditor


          key={data.id}


          value={description || ""}


          onChange={(val) =>


            onChange({


              ...data,


              description: val,


            })


          }


        />





        <div style={{ marginTop: 12, textAlign: "left" }}>


          <strong className="Choose-Theme-Background">Choose Background:</strong>


          <div style={{ display: "flex", gap: 10, marginTop: 1,flexWrap:"wrap",padding:"5px",justifyContent:'center' }}>


            {THEME_OPTIONS.map((t) => (


              <div


                key={t.value}


                onClick={() => handleThemeChange(t.value)}


                style={{


                  cursor: "pointer",


                  width: 25,


                  height: 25,


                  borderRadius: 4,


                  background: t.color,


                  border: theme === t.value ? "3px solid #000" : "1px solid #ccc",


                }}


                title={t.label}


              />


            ))}


          </div>


        </div>





        <div style={{ textAlign: "center" }}>


          <button


            type="button"


            style={{


              marginTop: 10,


              backgroundColor: "#e74c3c",


              color: "white",


              border: "none",


              padding: "6px 12px",


              borderRadius: 4,


              cursor: "pointer",


              fontSize: "17px",


            }}


            onClick={onRemove}


          >


            Remove


          </button>


        </div>


      </div>


    </div>


  );


};


const BlockType3 = ({ data, onChange, onRemove }) => {
  const { description, theme, idName, subtitle } = data;  // subtitle ও idName আনতে হবে

  const updateField = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleThemeChange = (val) => {
    onChange({ ...data, theme: val });
  };

  return (
    <div
      id={data.idName || undefined}
      className="block-type block-type3"
      style={{
        background:'#d5eff5',
        padding: 12,
        marginBottom: 20,
        border: "1px solid #777",
        borderRadius: 8,
      }}
    >
      <h4 style={{ marginBottom: "1rem",fontSize:'18px',color:'#333',fontFamily:'Poppins',fontWeight:'700',textAlign:'center' }}>Link Block</h4>
      <div className="subtitle-id-container">
        <input
          type="text"
          placeholder="Enter Content Title"
          value={subtitle || ""}
          onChange={(e) => updateField("subtitle", e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Content Id"
          value={idName || ""}
          onChange={(e) => updateField("idName", e.target.value)}
        />
      </div>

      <div 
        style={{
          background:
            THEME_OPTIONS.find((t) => t.value === theme)?.color || "transparent",
        }}
      >
        <QuillEditor
          key={data.id}
          value={description || ""}
          onChange={(val) => onChange({ ...data, description: val })}
        />

        <div style={{ marginTop: 12, textAlign: "left" }}>
          <strong className="Choose-Theme-Background">Choose Background:</strong>
          <div style={{ display: "flex", gap: 10, marginTop: 1,flexWrap:"wrap",padding:"5px",justifyContent:'center'}}>
            {THEME_OPTIONS.map((t) => (
              <div
                key={t.value}
                onClick={() => handleThemeChange(t.value)}
                style={{
                  cursor: "pointer",
                  width: 25,
                  height: 25,
                  borderRadius: 4,
                  background: t.color,
                  border: theme === t.value ? "3px solid #000" : "1px solid #ccc",
                }}
                title={t.label}
              />
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            style={{
              marginTop: 10,
              backgroundColor: "#e74c3c",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "17px",
            }}
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};


const DynamicContentBuilder = ({ value: blocks = [], onChange }) => {
  const addBlock = (type) => {
    if (!onChange) return;
    const id = Date.now() + Math.random();
    let newBlock;
    if (type === 1) {
      newBlock = { id, type: "block1", image: null, description: "", subtitle: "", idName: "", alt: "" };
    } else if (type === 2) {
      newBlock = {
        id,
        type: "block2",
        image: null,
        description: "",
        subtitle: "",
        idName: "",
        theme: "theme1",
        alt: "",
      };
    } else if (type === 3) {
      newBlock = { id, type: "block3", description: "", subtitle: "", idName: "", theme: "theme1" };
    }
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (index, newData) => {
    if (!onChange) return;
    const updated = [...blocks];
    updated[index] = newData;
    onChange(updated);
  };

  const removeBlock = (index) => {
    if (!onChange) return;
    const updated = [...blocks];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div style={{ maxWidth: 700, marginTop: "50px",textAlign:'center',fontSize:'22px', fontWeight:'600' }}>
      <h2 style={{fontFamily:'Poppins',color:'#e0e0e0',}}>Dynamic Content Builder</h2>

      {/* <div style={{ marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => addBlock(1)}
          style={{  padding: "8px 16px" }}
        >
          Add Content Block
        </button>
        <button
          type="button"
          onClick={() => addBlock(2)}
          style={{ padding: "8px 16px" }}
        >
         Add Author Block
        </button>
        <button
          type="button"
          onClick={() => addBlock(3)}
          style={{ padding: "8px 16px" }}
        >
          Add Link Block
        </button>
      </div> */}

      <>
        {blocks.map((block, i) => {
          if (block.type === "block1") {
            return (
              <BlockType1
                key={block.id}
                data={block}
                onChange={(data) => updateBlock(i, data)}
                onRemove={() => removeBlock(i)}
              />
            );
          }
          if (block.type === "block2") {
            return (
              <BlockType2
                key={block.id}
                data={block}
                onChange={(data) => updateBlock(i, data)}
                onRemove={() => removeBlock(i)}
              />
            );
          }
          if (block.type === "block3") {
            return (
              <BlockType3
                key={block.id}
                data={block}
                onChange={(data) => updateBlock(i, data)}
                onRemove={() => removeBlock(i)}
              />
            );
          }
          return null;
        })}
      </>

      <div style={{ marginBottom: 20,marginTop:'5px',textAlign:'center', fontSize:'16px' }}>
        <button
          type="button"
          onClick={() => addBlock(1)}
          style={{ cursor:'pointer' ,padding: "8px 12px",color:'#e0e0e0',fontFamily:'Poppins',background: ' blue', margin:'12px', borderRadius:'3px'}}
        >
          Add Content Block
        </button>
        <button
          type="button"
          onClick={() => addBlock(2)}
          style={{cursor:'pointer' , padding: "8px 16px",color:'#e0e0e0',fontFamily:'Poppins', background: ' blue', margin:'12px', borderRadius:'3px' }}
        >
         Add Author Block
        </button>
        <button
          type="button"
          onClick={() => addBlock(3)}
          style={{cursor:'pointer' ,color:'#e0e0e0',fontFamily:'Poppins', padding: "8px 16px",background: ' blue', margin:'12px', borderRadius:'3px' }}
        >
          Add Link Block
        </button>
      </div>
    </div>
  );
};

export default DynamicContentBuilder;









