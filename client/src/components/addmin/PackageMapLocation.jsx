// PackageMapLocation.jsx
import React, { useState } from "react";

const iconOptions = [
  { id: 1, name: "Food Place", url: "https://cdn-icons-png.flaticon.com/512/7928/7928726.png " },
  { id: 2, name: "Forest", url: "https://cdn-icons-png.flaticon.com/512/16177/16177100.png" },
  { id: 4, name: "Forest 2", url: "   https://cdn-icons-png.flaticon.com/512/5194/5194013.png" },
  { id: 5, name: "Hill", url: "https://cdn-icons-png.flaticon.com/512/8059/8059166.png" },
  { id: 6, name: "Beach", url: "https://cdn-icons-png.flaticon.com/128/1183/1183171.png" },
  { id: 7, name: "Hotel", url: "https://cdn-icons-png.flaticon.com/128/8209/8209373.png" },
  { id: 8, name: "Sightseeing", url: "https://cdn-icons-png.flaticon.com/128/6350/6350319.png" },
   { id: 9, name: "pin-Location", url: "https://cdn-icons-png.flaticon.com/512/8701/8701582.png " },
];

const PackageMapLocation = ({ locations, setLocations }) => {
  // locations -> state from parent, array of location objects
  // setLocations -> parent state setter

  // Handle input change
  const handleChange = (index, field, value) => {
    const updated = [...locations];
    updated[index][field] = value;
    setLocations(updated);
  };

  // Handle icon select (only one per block)
  const handleIconSelect = (index, iconId) => {
    const updated = [...locations];
    updated[index].icon = iconOptions.find((ic) => ic.id === iconId);
    setLocations(updated);
  };

  // Handle rating select (only one per block)
  const handleRatingSelect = (index, rating) => {
    const updated = [...locations];
    updated[index].rating = rating;
    setLocations(updated);
  };

  // Add new block
  const addBlock = () => {
    setLocations([
      ...locations,
      {
        name: "",
        latitude: "",
        longitude: "",
        description: "",
        image: "",
        icon: null,
        rating: null,
        link: "",
      },
    ]);
  };

  // Remove block
  const removeBlock = (index) => {
    if (window.confirm("Are you sure you want to remove this location?")) {
      const updated = [...locations];
      updated.splice(index, 1);
      setLocations(updated);
    }
  };

  return (
    <div style={{margin:"1rem 0",minWidth:'350px',maxWidth:'100%px'}}>
      {locations.map((loc, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h4 style={{fontSize:'1.2rem',color:"#1887c2",fontWeight:'600'}}>Location {index + 1}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Location Name"
              value={loc.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              required
              style={{
                    padding: '6px 8px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                   
              }}
            />
            <input
              type="number"
              step="any"
              placeholder="Latitude"
              value={loc.latitude}
              onChange={(e) => handleChange(index, "latitude", e.target.value)}
              required
               style={{
                    padding: '6px 8px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                     marginTop:'0.3rem'
                   
              }}
            />
            <input
              type="number"
              step="any"
              placeholder="Longitude"
              value={loc.longitude}
              onChange={(e) => handleChange(index, "longitude", e.target.value)}
              required
               style={{
                    padding: '6px 8px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                     marginTop:'0.3rem'
                   
              }}
            />
            <textarea
              placeholder="Description"
              value={loc.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
               style={{
                    padding: '6px 8px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                     marginTop:'0.3rem'
                   
              }}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={loc.image}
              onChange={(e) => handleChange(index, "image", e.target.value)}
               style={{
                    padding: '6px 8px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    marginTop:'0.3rem'
                   
              }}
            />

            {/* Icon Selection */}
            <div>
              <p>Select Icon:</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {iconOptions.map((icon) => (
                  <label key={icon.id} style={{ textAlign: "center" }}>
                    <input
                      type="radio"
                      name={`icon-${index}`}
                      checked={loc.icon?.id === icon.id}
                      onChange={() => handleIconSelect(index, icon.id)}
                    />
                    <br />
                    <img src={icon.url} alt={icon.name} style={{ width: "30px", height: "30px" }} />
                    <br />
                    {icon.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Selection */}
            <div>
              <p>Select Rating:</p>
              <div style={{ display: "flex", gap: "10px" }}>
                {[1, 2, 3, 4, 5].map((r) => (
                  <label key={r}>
                    <input
                      type="radio"
                      name={`rating-${index}`}
                      checked={loc.rating === r}
                      onChange={() => handleRatingSelect(index, r)}
                    />{" "}
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Page Link URL"
              value={loc.link}
              onChange={(e) => handleChange(index, "link", e.target.value)}
            />

            {/* Remove Block Button */}
            <button
              type="button"
              onClick={() => removeBlock(index)}
              style={{
                background: "#FF4D4F",
                color: "#fff",
                border: "none",
                padding: "6px 10px",
                borderRadius: "4px",
                marginTop: "10px",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Add Block Button */}
      <button
        type="button"
        onClick={addBlock}
        style={{
          background: "#007BFF",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          borderRadius: "4px",
        }}
      >
        Add Location
      </button>
    </div>
  );
};

export default PackageMapLocation;
