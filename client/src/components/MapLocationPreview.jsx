

// // MapLocationPreview.jsx
// import React, { useEffect, useRef, useState } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const defaultIcon = "https://cdn-icons-png.flaticon.com/512/684/684908.png";

// const MapLocationPreview = ({ locations = [] }) => {
//   const smallMapRef = useRef(null);
//   const fullMapRef = useRef(null);
//   const smallMapInstance = useRef(null);
//   const fullMapInstance = useRef(null);
//   const markersGroupSmall = useRef(null);
//   const markersGroupFull = useRef(null);
//   const hoverTooltipRef = useRef(null);

//   const [showFullScreen, setShowFullScreen] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   // helper: create a DivIcon for preview (compact name visible)
//   const createPreviewDivIcon = (loc) => {
//     const iconUrl = loc.icon?.url || defaultIcon;
//     const safeName = (loc.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//     // HTML: icon + mini label (light theme: white bg, black text)
//     const html = `
//       <div class="marker-wrap">
//         <img class="marker-img" src="${iconUrl}" alt="${safeName}" />
//         <div class="mini-label mini-label-preview">
//           <div class="mini-title">${safeName}</div>
//         </div>
//       </div>
//     `;
//     return L.divIcon({
//       html,
//       className: "custom-divicon preview-divicon",
//       iconSize: [140, 40],
//       iconAnchor: [70, 40],
//     });
//   };

//   // helper: create DivIcon for full map (shows rating + name + short desc)
//   const createFullDivIcon = (loc) => {
//     const iconUrl = loc.icon?.url || defaultIcon;
//     const safeName = (loc.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//     const shortDesc = (loc.description || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//     const ratingText = loc.rating ? `⭐ ${loc.rating}` : "";
//     // mini-card has rating on top-left (small), name + description to the right
//     const html = `
//       <div class="marker-wrap-full">
//         <img class="marker-img-full" src="${iconUrl}" alt="${safeName}" />
//         <div class="mini-label mini-label-full">
//           <div class="mini-rating">${ratingText}</div>
//           <div class="mini-title">${safeName}</div>
//           <div class="mini-desc">${shortDesc}</div>
//         </div>
//       </div>
//     `;
//     return L.divIcon({
//       html,
//       className: "custom-divicon full-divicon",
//       iconSize: [260, 60],
//       iconAnchor: [20, 60],
//     });
//   };

//   // create tooltip content for hover: round image + "Click"
//   const createHoverHtml = (loc) => {
//     const img = loc.image || loc.icon?.url || defaultIcon;
//     const safeName = (loc.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//     return `
//       <div class="hover-tooltip-inner">
//         <img src="${img}" alt="${safeName}" class="hover-thumb" />
//         <div class="hover-text">Click</div>
//       </div>
//     `;
//   };

//   // initialize small preview map
//   useEffect(() => {
//     if (smallMapRef.current && !smallMapInstance.current) {
//       smallMapInstance.current = L.map(smallMapRef.current, {
//         zoomControl: false,
//         dragging: false,
//         scrollWheelZoom: false,
//         doubleClickZoom: false,
//         boxZoom: false,
//         touchZoom: false,
//         attributionControl: false,
//       }).setView([23.8103, 90.4125], 6);

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         maxZoom: 19,
//       }).addTo(smallMapInstance.current);

//       markersGroupSmall.current = L.layerGroup().addTo(smallMapInstance.current);
//     }
//     // update markers whenever locations change
//     if (smallMapInstance.current) updateSmallMarkers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [locations]);

//   // initialize full map when opening fullscreen (or update markers)
//   useEffect(() => {
//     if (showFullScreen) {
//       if (fullMapRef.current && !fullMapInstance.current) {
//         fullMapInstance.current = L.map(fullMapRef.current, {
//           zoomControl: true,
//           attributionControl: true,
//         }).setView([23.8103, 90.4125], 6);

//         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//           maxZoom: 19,
//         }).addTo(fullMapInstance.current);

//         markersGroupFull.current = L.layerGroup().addTo(fullMapInstance.current);
//       }
//       if (fullMapInstance.current) updateFullMarkers();
//     } else {
//       // when closing fullscreen, remove hover tooltip if any and clear selected
//       if (hoverTooltipRef.current) {
//         try { hoverTooltipRef.current.remove(); } catch (e) {}
//         hoverTooltipRef.current = null;
//       }
//       setSelectedLocation(null);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [showFullScreen, locations]);

//   // update preview markers
//   const updateSmallMarkers = () => {
//     if (!markersGroupSmall.current || !smallMapInstance.current) return;
//     markersGroupSmall.current.clearLayers();
//     const bounds = [];

//     locations.forEach((loc) => {
//       if (loc.latitude == null || loc.longitude == null) return;
//       const marker = L.marker([loc.latitude, loc.longitude], {
//         icon: createPreviewDivIcon(loc),
//         interactive: false, // non-interactive preview
//       }).addTo(markersGroupSmall.current);

//       bounds.push([loc.latitude, loc.longitude]);
//     });

//     if (bounds.length === 1) {
//       smallMapInstance.current.setView(bounds[0], 10);
//     } else if (bounds.length > 1) {
//       smallMapInstance.current.fitBounds(bounds, { padding: [50, 50] });
//     }
//   };

//   // update full markers (interactive)
//   const updateFullMarkers = () => {
//     if (!markersGroupFull.current || !fullMapInstance.current) return;
//     markersGroupFull.current.clearLayers();
//     const bounds = [];

//     locations.forEach((loc) => {
//       if (loc.latitude == null || loc.longitude == null) return;
//       const latlng = [loc.latitude, loc.longitude];

//       // create marker with DivIcon that shows mini-card always
//       const marker = L.marker(latlng, {
//         icon: createFullDivIcon(loc),
//       }).addTo(markersGroupFull.current);

//       // bind tooltip for hover with image + "Click"
//       marker.on("mouseover", function (e) {
//         // open a tooltip like overlay with custom HTML
//         const tooltip = L.tooltip({
//           direction: "top",
//           offset: [0, -50],
//           permanent: false,
//           sticky: true,
//           className: "custom-hover-tooltip",
//         })
//           .setLatLng(latlng)
//           .setContent(createHoverHtml(loc))
//           .addTo(fullMapInstance.current);

//         // store to remove on mouseout
//         hoverTooltipRef.current = tooltip;
//       });

//       marker.on("mouseout", function (e) {
//         if (hoverTooltipRef.current) {
//           try { fullMapInstance.current.removeLayer(hoverTooltipRef.current); } catch (e) {}
//           hoverTooltipRef.current = null;
//         }
//       });

//       marker.on("click", function () {
//         setSelectedLocation(loc);
//         // pan the map slightly so the card won't cover the marker (nice UX)
//         try {
//           fullMapInstance.current.panTo(latlng, { animate: true });
//         } catch (e) {}
//       });

//       bounds.push(latlng);
//     });

//     if (bounds.length === 1) {
//       fullMapInstance.current.setView(bounds[0], 10);
//     } else if (bounds.length > 1) {
//       fullMapInstance.current.fitBounds(bounds, { padding: [80, 80] });
//     }
//   };

//   // Open fullscreen
//   const openFullScreen = () => {
//     setShowFullScreen(true);
//     // small delay to allow fullMapRef to mount
//     setTimeout(() => {
//       if (fullMapInstance.current) fullMapInstance.current.invalidateSize();
//       if (markersGroupFull.current) updateFullMarkers();
//     }, 250);
//   };

//   // Close fullscreen and cleanup
//   const closeFullScreen = () => {
//     setShowFullScreen(false);
//     setSelectedLocation(null);
//     // remove markersGroupFull if you want (keeps map instance for speed)
//     // if (markersGroupFull.current) markersGroupFull.current.clearLayers();
//   };

//   // render
//   return (
//     <div className="map-page-container">
//       {/* Inline CSS in same file */}
//       <style>{`
//         /* container */
//         .map-page-container { width:100%; }

//         /* Small preview */
//         .small-map-wrapper { position: relative; width: 100%; height: 300px; border-radius: 10px; overflow: hidden; border: 1px solid #e6e6e6; cursor: pointer; }
//         .small-map-wrapper .small-map { width:100%; height:100%; }
//         .map-overlay-text { position: absolute; display: flex; align-items: center; bottom: 15px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.5); color: #fff; font-family:"inter"; padding:8px 12px; border-radius: 2px; font-size: 13px; z-index:999;font-weight: 400; }

//         /* Custom DivIcon wrapper - preview */
//         .custom-divicon.preview-divicon { background: transparent; border: none; }
//         .marker-wrap { display:flex; align-items:center; gap:0px; }
//         .marker-img { width:32px; height:32px; border-radius:6px; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
//         .mini-label { color: #002b11; padding: 0px 0px; border-radius: 8px; box-shadow: 0 6px 18px rgba(15,15,15,0.08); font-weight: 400; font-size: 12px; white-space: nowrap; text-shadow:-1px -1px 0 #fff,1px -1px 0 #fff,-1px  1px 0 #fff,1px  1px 0 #fff;
// }

//         .mini-label-preview { transform: translateY(-4px); }

//         /* Full map marker divicon */
//         .custom-divicon.full-divicon { background: transparent; border: none; }
//         .marker-wrap-full { display:flex; align-items:center; gap:2px; }
//         .marker-img-full { width:38px; height:38px; border-radius:6px; box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
//         .mini-label-full { background: #fff; color:#111; padding:2px 4px; border-radius:10px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); max-width: 220px;font-size:10px,font-family: system-ui }
//         .mini-rating { font-size:12px; color:#333; margin-bottom:4px; font-weight:700; }
//         .mini-title { font-size:14px;font-family: system-ui; font-weight:400; color:#002b11; margin-top:15px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
//         .mini-desc { font-size:12px; color:#555; max-height:36px; overflow:hidden; text-overflow:ellipsis; }

//         /* hover tooltip with round image and Click text */
//         .custom-hover-tooltip .leaflet-tooltip-content { padding:0; background: transparent; border:none; }
//         .hover-tooltip-inner { display:flex; flex-direction:column; align-items:center; gap:6px; }
//         .hover-thumb { width:56px; height:56px; border-radius:50%; object-fit:cover; border:3px solid #fff; box-shadow: 0 6px 18px rgba(0,0,0,0.25); }
//         .hover-text { background:#111; color:#fff; padding:4px 10px; border-radius:12px; font-size:12px; }

//         /* fullscreen overlay */
//         .fullscreen-overlay { position: fixed; inset:0; z-index: 99999; background: #fff; display:flex; flex-direction:column; }
//         .fullscreen-topbar { height:56px; display:flex; justify-content:flex-end; align-items:center; padding:10px 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); z-index: 20; }
//         .btn-close { background:#fff; border:1px solid #ddd; padding:8px 10px; border-radius:8px; cursor:pointer; font-size:16px; }
//         .full-map-wrap { flex:1; position:relative; }

//         /* bottom / side card for clicked location */
//         .location-card {
//           position: absolute;
//           left: 50%;
//           transform: translateX(-50%);
//           bottom: 20px;
//           width: min(980px, calc(100% - 32px));
//           background: #fff;
//           border-radius: 12px;
//           box-shadow: 0 12px 40px rgba(0,0,0,0.12);
//           display:flex;
//           gap:12px;
//           padding:12px;
//           align-items:center;
//           z-index: 9999;
//         }
//         .location-card img { width:140px; height:95px; object-fit:cover; border-radius:8px; }
//         .location-card .info h3 { margin:0; font-size:18px; color:#111; }
//         .location-card .info p { margin:6px 0 0 0; color:#444; font-size:14px; max-height:56px; overflow:hidden; text-overflow:ellipsis; }
//         .location-card .meta { margin-top:6px; display:flex; gap:8px; align-items:center; font-size:13px; color:#666; }

//         @media (max-width:720px) {
//           .location-card { left: 50%; transform: translateX(-50%); bottom: 0; width:100%; border-radius: 12px 12px 0 0; padding:10px; }
//           .location-card img { width:120px; height:80px; }
//           .mini-label-full { display:none; } /* optional: hide permanent mini labels on tiny screens if cluttered */
//         }
//       `}</style>

//       {/* Small preview - click opens fullscreen */}
//       <div className="small-map-wrapper" onClick={openFullScreen}>
//         <div ref={smallMapRef} className="small-map"></div>
//         <div className="map-overlay-text"> <img style={{width:'17px',marginBottom:'0px',marginRight:'2px'}} src="/assets/expand.svg" alt="expand icon" /> Full view</div>
//       </div>

//       {/* Fullscreen overlay */}
//       {showFullScreen && (
//         <div className="fullscreen-overlay" role="dialog" aria-modal="true">
//           <div className="fullscreen-topbar">
//             <button
//               className="btn-close"
//               onClick={() => {
//                 closeFullScreen();
//               }}
//             >
//               ✕ Close
//             </button>
//           </div>

//           <div className="full-map-wrap">
//             <div ref={fullMapRef} style={{ width: "100%", height: "100%" }} />

//             {/* clicked location card */}
//             {selectedLocation && (
//               <div className="location-card" role="region" aria-label={`Details of ${selectedLocation.name}`}>
//                 <img src={selectedLocation.image || selectedLocation.icon?.url || defaultIcon} alt={selectedLocation.name} />
//                 <div className="info">
//                   <h3>{selectedLocation.name}</h3>
//                   <div className="meta">
//                     <div style={{ fontWeight: 700 }}>{selectedLocation.rating ? `⭐ ${selectedLocation.rating}` : "No rating"}</div>
//                   </div>
//                   <p>{selectedLocation.description}</p>
//                   {selectedLocation.link && (
//                     <div style={{ marginTop: 8 }}>
//                       <a href={selectedLocation.link} className="mini-label" style={{ textDecoration: "none" }}>Check Place</a>
//                     </div>
//                   )}
//                 </div>
//                 <div style={{ marginLeft: 8 }}>
//                   <button onClick={() => setSelectedLocation(null)} style={{ background: "#f3f3f3", border: "1px solid #ddd", padding: 6, borderRadius: 8 }}>✕</button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapLocationPreview;











// // MapLocationPreview.jsx
// import React, { useEffect, useRef, useState } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const defaultIcon = "https://cdn-icons-png.flaticon.com/512/684/684908.png";

// const MapLocationPreview = ({ locations = [] }) => {
//   const smallMapRef = useRef(null);
//   const fullMapRef = useRef(null);
//   const smallMapInstance = useRef(null);
//   const fullMapInstance = useRef(null);
//   const markersGroupSmall = useRef(null);
//   const markersGroupFull = useRef(null);
//   const hoverTooltipRef = useRef(null);

//   const [showFullScreen, setShowFullScreen] = useState(false);
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   // helper: create a DivIcon for preview (compact name visible)
//   const createPreviewDivIcon = (loc) => {
//     const iconUrl = loc.icon?.url || defaultIcon;
//     const safeName = (loc.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//     // HTML: icon + mini label (light theme: white bg, black text)
//     const html = `
//       <div class="marker-wrap">
//         <img class="marker-img" src="${iconUrl}" alt="${safeName}" />
//         <div class="mini-label mini-label-preview">
//           <div class="mini-title">${safeName}</div>
//         </div>
//       </div>
//     `;
//     return L.divIcon({
//       html,
//       className: "custom-divicon preview-divicon",
//       iconSize: [140, 40],
//       iconAnchor: [70, 40],
//     });
//   };

//   // helper: create DivIcon for full map (shows rating + name + short desc)
//   const createFullDivIcon = (loc) => {
//     const iconUrl = loc.icon?.url || defaultIcon;
//     const safeName = (loc.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//     const shortDesc = (loc.description || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//     const ratingText = loc.rating ? `⭐${loc.rating}` : "";
//     // mini-card has rating on top-left (small), name + description to the right
//     const html = `
//       <div class="marker-wrap-full">
//         <img class="marker-img-full" src="${iconUrl}" alt="${safeName}" />
//         <div class="mini-label mini-label-full">
//           <div class="mini-ti-re-div">
//              <div class="mini-title">${safeName}</div>
//              <div class="mini-rating">${ratingText}.0</div>
//           </div>
//           <div class="mini-desc">${shortDesc}</div>
//         </div>
//       </div>
//     `;
//     return L.divIcon({
//       html,
//       className: "custom-divicon full-divicon",
//       iconSize: [260, 60],
//       iconAnchor: [20, 60],
//     });
//   };

//   // create tooltip content for hover: round image + "Click"
//   // const createHoverHtml = (loc) => {
//   //   const img = loc.image || loc.icon?.url || defaultIcon;
//   //   const safeName = (loc.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//   //   return `
//   //     <div class="hover-tooltip-inner">
//   //       <img src="${img}" alt="${safeName}" class="hover-thumb" />
//   //       <div class="hover-text">Click</div>
//   //     </div>
//   //   `;
//   // };

//   const createHoverHtml = (loc) => {
//   const img = loc.image || loc.icon?.url || defaultIcon;
//   const safeName = (loc.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//   return `
//     <div class="hover-tooltip-inner">
//       <img src="${img}" alt="${safeName}" class="hover-thumb" />
      
//     </div>
//   `;
// };


//   // initialize small preview map
//   useEffect(() => {
//     if (smallMapRef.current && !smallMapInstance.current) {
//       smallMapInstance.current = L.map(smallMapRef.current, {
//         zoomControl: false,
//         dragging: false,
//         scrollWheelZoom: false,
//         doubleClickZoom: false,
//         boxZoom: false,
//         touchZoom: false,
//         attributionControl: false,
//       }).setView([23.8103, 90.4125], 6);

//       L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         maxZoom: 19,
//       }).addTo(smallMapInstance.current);


// //       L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
// //   attribution: '&copy; <a href="https://www.carto.com/">CARTO</a>',
// //   subdomains: 'abcd',
// //   maxZoom: 19
// // }).addTo(smallMapInstance.current);


//       markersGroupSmall.current = L.layerGroup().addTo(smallMapInstance.current);
//     }
//     // update markers whenever locations change
//     if (smallMapInstance.current) updateSmallMarkers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [locations]);

//   // initialize full map when opening fullscreen (or update markers)
//   useEffect(() => {
//     if (showFullScreen) {
//       if (fullMapRef.current && !fullMapInstance.current) {
//         fullMapInstance.current = L.map(fullMapRef.current, {
//           zoomControl: true,
//           attributionControl: true,
//         }).setView([23.8103, 90.4125], 6);

//         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//           maxZoom: 19,
//         }).addTo(fullMapInstance.current);

// //         L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
// //   attribution: '&copy; <a href="https://www.carto.com/">CARTO</a>',
// //   subdomains: 'abcd',
// //   maxZoom: 19
// // }).addTo(fullMapInstance.current);


//         markersGroupFull.current = L.layerGroup().addTo(fullMapInstance.current);
//       }
//       if (fullMapInstance.current) updateFullMarkers();
//     } else {
//       // when closing fullscreen, remove hover tooltip if any and clear selected
//       if (hoverTooltipRef.current) {
//         try { hoverTooltipRef.current.remove(); } catch (e) {}
//         hoverTooltipRef.current = null;
//       }
//       setSelectedLocation(null);
//       if (fullMapInstance.current) {
//         fullMapInstance.current.remove();
//         fullMapInstance.current = null;
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [showFullScreen, locations]);

//   // update preview markers
//   const updateSmallMarkers = () => {
//     if (!markersGroupSmall.current || !smallMapInstance.current) return;
//     markersGroupSmall.current.clearLayers();
//     const bounds = [];

//     locations.forEach((loc) => {
//       if (loc.latitude == null || loc.longitude == null) return;
//       const marker = L.marker([loc.latitude, loc.longitude], {
//         icon: createPreviewDivIcon(loc),
//         interactive: false, // non-interactive preview
//       }).addTo(markersGroupSmall.current);

//       bounds.push([loc.latitude, loc.longitude]);
//     });

//     if (bounds.length === 1) {
//       smallMapInstance.current.setView(bounds[0], 10);
//     } else if (bounds.length > 1) {
//       smallMapInstance.current.fitBounds(bounds, { padding: [50, 50] });
//     }
//   };

//   // update full markers (interactive)
//   const updateFullMarkers = () => {
//     if (!markersGroupFull.current || !fullMapInstance.current) return;
//     markersGroupFull.current.clearLayers();
//     const bounds = [];

//     locations.forEach((loc) => {
//       if (loc.latitude == null || loc.longitude == null) return;
//       const latlng = [loc.latitude, loc.longitude];

//       // create marker with DivIcon that shows mini-card always
//       const marker = L.marker(latlng, {
//         icon: createFullDivIcon(loc),
//       }).addTo(markersGroupFull.current);

//       // bind tooltip for hover with image + "Click"
//       // marker.on("mouseover", function (e) {
//       //   // open a tooltip like overlay with custom HTML
//       //   const tooltip = L.tooltip({
//       //     direction: "top",
//       //     offset: [0, -50],
//       //     permanent: true,
//       //     sticky: true,
//       //     className: "custom-hover-tooltip",
//       //   })
//       //     .setLatLng(latlng)
//       //     .setContent(createHoverHtml(loc))
//       //     .addTo(fullMapInstance.current);

//       //   // store to remove on mouseout
//       //   hoverTooltipRef.current = tooltip;
//       // });

//       // marker.on("mouseout", function (e) {
//       //   if (hoverTooltipRef.current) {
//       //     try { fullMapInstance.current.removeLayer(hoverTooltipRef.current); } catch (e) {}
//       //     hoverTooltipRef.current = null;
//       //   }
//       // });

//       L.tooltip({
//         permanent: true,
//         direction: "top",
//         offset: [0, -50],
//         className: "custom-hover-tooltip",
//       })
//         .setLatLng(latlng)
//         .setContent(createHoverHtml(loc))
//         .addTo(fullMapInstance.current);
      

//       marker.on("click", function () {
//         setSelectedLocation(loc);
//         // pan the map slightly so the card won't cover the marker (nice UX)
//         try {
//           fullMapInstance.current.panTo(latlng, { animate: true });
//         } catch (e) {}
//       });

//       bounds.push(latlng);
//     });

//     if (bounds.length === 1) {
//       fullMapInstance.current.setView(bounds[0], 10);
//     } else if (bounds.length > 1) {
//       fullMapInstance.current.fitBounds(bounds, { padding: [80, 80] });
//     }
//   };

//   // Open fullscreen
//   const openFullScreen = () => {
//     setShowFullScreen(true);
//     // small delay to allow fullMapRef to mount
//     setTimeout(() => {
//       if (fullMapInstance.current) fullMapInstance.current.invalidateSize();
//       if (markersGroupFull.current) updateFullMarkers();
//     }, 250);
//   };

//   // Close fullscreen and cleanup
//   const closeFullScreen = () => {
//     setShowFullScreen(false);
//     setSelectedLocation(null);
//     // remove markersGroupFull if you want (keeps map instance for speed)
//     // if (markersGroupFull.current) markersGroupFull.current.clearLayers();
//   };

//   // render
//   return (
//     <div className="map-page-container">
//       {/* Inline CSS in same file */}
//       <style>{`
//         /* container */
//         .map-page-container { width:100%; }

//         /* Small preview */
//         .small-map-wrapper { position: relative; width: 100%; height: 300px; border-radius: 10px; overflow: hidden; border: 1px solid #e6e6e6; cursor: pointer; }
//         .small-map-wrapper .small-map { width:100%; height:100%; }
//         .map-overlay-text { position: absolute; display: flex; align-items: center; bottom: 15px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.5); color: #fff; font-family:"inter"; padding:8px 12px; border-radius: 2px; font-size: 13px; z-index:999;font-weight: 400; }

//         /* Custom DivIcon wrapper - preview */
//         .custom-divicon.preview-divicon { background: transparent; border: none; }
//         .marker-wrap { display:flex; align-items:center; gap:0px; }
//         .marker-img { width:32px; height:32px; border-radius:6px; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
//         .mini-label { color: #002b11; border-radius: 8px; box-shadow: 0 6px 18px rgba(15,15,15,0.08); font-weight: 400; font-size: 12px; text-shadow:-1px -1px 0 #fff,1px -1px 0 #fff,-1px  1px 0 #fff,1px  1px 0 #fff;
// }

//         .mini-label-preview { transform: translateY(-4px); }

//         /* Full map marker divicon */
//         .custom-divicon.full-divicon { background: transparent; border: none; }
//         .marker-wrap-full { display:flex; align-items:center; gap:2px; }
//         .marker-img-full { width:38px; height:38px; border-radius:6px; box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
//         .mini-label-full { background: #fff; color:#111; padding:3px 6px 3px 6px;clip-path: polygon(100% 0, 100% 100%, 7% 100%, 7% 86%, 0 87%, 7% 64%, 7% 0); border-radius: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.08); max-width: 220px;font-size:10px;font-family: system-ui;position:absolute; bottom:20px;left:30px }
//         .mini-ti-re-div {display:flex;align-items:center;margin-left:14px}
//         .mini-rating { font-size:12px; color:#333; margin-bottom:0px; font-weight:700; }
//         .mini-title { font-size:14px;font-family: system-ui; font-weight:400; color:#002b11; margin-right:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
//         .mini-desc {font-size:12px; margin-left:14px; color:#555; max-height: 55px; max-width:22ch; overflow:hidden; display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; word-break:break-word;}


//         /* hover tooltip with round image and Click text */
//         .leaflet-tooltip { background: transparent; box-shadow:none;border:none;padding:0; }
//         .custom-hover-tooltip .leaflet-tooltip-content { padding:0; background: transparent; border:none; }
//         .hover-tooltip-inner { display:flex; flex-direction:column; align-items:center; gap:6px; background:#transparent;width:45px;}
//         .hover-thumb { width:45px; height:45px; border-radius:50%; object-fit:cover; border:3px solid #fff;  }
//         .hover-text { background:#111; color:#fff; padding:4px 10px; border-radius:12px; font-size:12px; }

//         /* fullscreen overlay */
//         .fullscreen-overlay { position: fixed; inset:0; z-index: 99999; display:flex; flex-direction:column; }
//         .fullscreen-topbar { height:56px; display:flex; right:8px; top:8px; align-items:center; padding:10px 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); z-index: 999;;position:absolute; }
//         .btn-close { background:#fff;  padding:7px ;width:38px; border-radius:50%; cursor:pointer; font-size:16px; color:#2b8dca;box-shadow: 0px 1px 3px rgba(12,12,12,0.4);font-weight: 500;  }
//         .full-map-wrap { flex:1; position:relative;}

//         /* bottom / side card for clicked location */
//         .location-card {
//           position: absolute;
//           left: 50%;
//           transform: translateX(-50%);
//           bottom: 20px;
//           width: min(980px, calc(100% - 32px));
//           background: #fff;
//           border-radius: 12px;
//           box-shadow: 0 12px 40px rgba(0,0,0,0.12);
//           display:flex;
//           gap:12px;
//           padding:12px;
//           align-items:center;
//           z-index: 9999;
//         }
//         .location-card img { width:140px; height:95px; object-fit:cover; border-radius:8px; }
//         .location-card .info h3 { margin:0; font-size:18px; color:#111; }
//         .location-card .info p { margin:6px 0 0 0; color:#444; font-size:14px; max-height:56px; overflow:hidden; text-overflow:ellipsis; }
//         .location-card .meta { margin-top:6px; display:flex; gap:8px; align-items:center; font-size:13px; color:#666; }

//         @media (max-width:720px) {
//           .location-card { left: 50%; transform: translateX(-50%); bottom: 0; width:100%; border-radius: 12px 12px 0 0; padding:10px; }
//           .location-card img { width:120px; height:80px; }
//         /*  .mini-label-full { display:none; } */
//         }
//       `}</style>

//       {/* Small preview - click opens fullscreen */}
//       <div className="small-map-wrapper" onClick={openFullScreen}>
//         <div ref={smallMapRef} className="small-map"></div>
//         <div className="map-overlay-text"> <img style={{width:'17px',marginBottom:'0px',marginRight:'2px'}} src="/assets/expand.svg" alt="expand icon" /> Full view</div>
//       </div>

//       {/* Fullscreen overlay */}
//       {showFullScreen && (
//         <div className="fullscreen-overlay" role="dialog" aria-modal="true">
//           <div className="fullscreen-topbar">    
//             <button
//               className="btn-close"
//               onClick={() => {
//                 closeFullScreen();
//               }}
//             >
//               ✕
//             </button>
//           </div>

//           <div className="full-map-wrap">
//             <div ref={fullMapRef} style={{ width: "100%", height: "100%" }} />

//             {/* clicked location card */}
//             {selectedLocation && (
//               <div className="location-card" role="region" aria-label={`Details of ${selectedLocation.name}`}>
//                 <img src={selectedLocation.image || selectedLocation.icon?.url || defaultIcon} alt={selectedLocation.name} />
//                 <div className="info">
//                   <h3>{selectedLocation.name}</h3>
//                   <div className="meta">
//                     <div style={{ fontWeight: 700 }}>{selectedLocation.rating ? `⭐ ${selectedLocation.rating}` : "No rating"}</div>
//                   </div>
//                   <p>{selectedLocation.description}</p>
//                   {selectedLocation.link && (
//                     <div style={{ marginTop: 8 }}>
//                       <a href={selectedLocation.link} className="mini-label" style={{ textDecoration: "none" }}>Check Place</a>
//                     </div>
//                   )}
//                 </div>
//                 <div style={{ marginLeft: 8 }}>
//                   <button onClick={() => setSelectedLocation(null)} style={{ background: "#f3f3f3", border: "1px solid #ddd", padding: 6, borderRadius: 8 }}>✕</button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapLocationPreview;



// MapLocationPreview.jsx
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = "https://cdn-icons-png.flaticon.com/512/684/684908.png";

const MapLocationPreview = ({ locations = [] }) => {
  const smallMapRef = useRef(null);
  const fullMapRef = useRef(null);
  const smallMapInstance = useRef(null);
  const fullMapInstance = useRef(null);
  const markersGroupSmall = useRef(null);
  const markersGroupFull = useRef(null);
  const hoverTooltipRef = useRef(null);
  const markersRef = useRef({});
  const clickTimerRef = useRef(null);

  const [showFullScreen, setShowFullScreen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);


  // helper: create a DivIcon for preview (compact name visible)
  const createPreviewDivIcon = (loc) => {
    const iconUrl = loc.icon?.url || defaultIcon;
    const safeName = (loc.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = `
      <div class="marker-wrap">
        <img class="marker-img" src="${iconUrl}" alt="${safeName}" />
        <div class="mini-label mini-label-preview">
          <div class="mini-title">${safeName}</div>
        </div>
      </div>
    `;
    return L.divIcon({
      html,
      className: "custom-divicon preview-divicon",
      iconSize: [140, 40],
      iconAnchor: [70, 40],
    });
  };

  // helper: create DivIcon for full map
  const createFullDivIcon = (loc) => {
    const iconUrl = loc.icon?.url || defaultIcon;
    const safeName = (loc.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const shortDesc = (loc.description || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const ratingText = loc.rating ? `⭐${loc.rating}` : "";
    const html = `
      <div class="marker-wrap-full">
        <img class="marker-img-full" src="${iconUrl}" alt="${safeName}" />
        <div class="mini-label mini-label-full">
          <div class="mini-ti-re-div">
             <div class="mini-title">${safeName}</div>
             <div class="mini-rating">${ratingText}.0</div>
          </div>
          <div class="mini-desc">${shortDesc}</div>
        </div>
      </div>
    `;
    return L.divIcon({
      html,
      className: "custom-divicon full-divicon",
      iconSize: [260, 60],
      iconAnchor: [20, 60],
    });
  };

  const createHoverHtml = (loc) => {
    const img = loc.image || loc.icon?.url || defaultIcon;
    const safeName = (loc.name || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `
      <div class="hover-tooltip-inner">
        <img src="${img}" alt="${safeName}" class="hover-thumb" />
      </div>
    `;
  };

  // initialize small preview map
  useEffect(() => {
    if (smallMapRef.current && !smallMapInstance.current) {
      smallMapInstance.current = L.map(smallMapRef.current, {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        touchZoom: false,
        attributionControl: false,
      }).setView([23.8103, 90.4125], 6);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(smallMapInstance.current);

      markersGroupSmall.current = L.layerGroup().addTo(smallMapInstance.current);
    }
    if (smallMapInstance.current) updateSmallMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  // initialize/cleanup full map
  useEffect(() => {
    if (showFullScreen) {
      if (fullMapRef.current && !fullMapInstance.current) {
        fullMapInstance.current = L.map(fullMapRef.current, {
          zoomControl: true,
          attributionControl: true,
        }).setView([23.8103, 90.4125], 6);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(fullMapInstance.current);

        markersGroupFull.current = L.layerGroup().addTo(fullMapInstance.current);
      }
      if (fullMapInstance.current) updateFullMarkers();
    } else {
      if (hoverTooltipRef.current) {
        try { hoverTooltipRef.current.remove(); } catch (e) {}
        hoverTooltipRef.current = null;
      }
      setSelectedLocation(null);
      if (fullMapInstance.current) {
        fullMapInstance.current.remove();
        fullMapInstance.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFullScreen, locations]);

  // update preview markers
  const updateSmallMarkers = () => {
    if (!markersGroupSmall.current || !smallMapInstance.current) return;
    markersGroupSmall.current.clearLayers();
    const bounds = [];
    locations.forEach((loc) => {
      if (loc.latitude == null || loc.longitude == null) return;
      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: createPreviewDivIcon(loc),
        interactive: false,
      }).addTo(markersGroupSmall.current);
      bounds.push([loc.latitude, loc.longitude]);
    });
    if (bounds.length === 1) {
      smallMapInstance.current.setView(bounds[0], 10);
    } else if (bounds.length > 1) {
      smallMapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  // update full markers (interactive)
  const updateFullMarkers = () => {
    if (!markersGroupFull.current || !fullMapInstance.current) return;
    markersGroupFull.current.clearLayers();
    markersRef.current = {}; // Reset markers ref
    const bounds = [];

    locations.forEach((loc, index) => {
      if (loc.latitude == null || loc.longitude == null) return;
      const latlng = [loc.latitude, loc.longitude];
      const locationData = { ...loc, index };

      const marker = L.marker(latlng, {
        icon: createFullDivIcon(loc),
        locationData: locationData, // Attach data to marker
      }).addTo(markersGroupFull.current);

      markersRef.current[index] = marker; // Store marker by index

      L.tooltip({
        permanent: true,
        direction: "top",
        offset: [0, -50],
        className: "custom-hover-tooltip",
      })
        .setLatLng(latlng)
        .setContent(createHoverHtml(loc))
        .addTo(fullMapInstance.current);

      marker.on("click", () => {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = setTimeout(() => {
          if (selectedLocation && selectedLocation.index === index) {
            setSelectedLocation(null); // Toggle off if same is clicked
          } else {
            setSelectedLocation(locationData); // Select new one
            try {
              fullMapInstance.current.panTo(latlng, { animate: true });
            } catch (e) {}
          }
        }, 200);
      });

      marker.on("dblclick", () => {
        clearTimeout(clickTimerRef.current);
        setSelectedLocation(null); // Hide card on double click
      });

      bounds.push(latlng);
    });

    if (bounds.length === 1) {
      fullMapInstance.current.setView(bounds[0], 10);
    } else if (bounds.length > 1) {
      fullMapInstance.current.fitBounds(bounds, { padding: [80, 80] });
    }
  };
  
  // Effect to handle marker selection styling
  useEffect(() => {
    Object.values(markersRef.current).forEach(marker => {
      const markerLocIndex = marker.options.locationData.index;
      const isSelected = selectedLocation && selectedLocation.index === markerLocIndex;
      
      if (isSelected) {
        if (marker._icon) marker._icon.classList.add('selected');
      } else {
        if (marker._icon) marker._icon.classList.remove('selected');
      }
    });
  }, [selectedLocation]);

  // Open fullscreen
  const openFullScreen = () => {
    setShowFullScreen(true);
    setTimeout(() => {
      if (fullMapInstance.current) fullMapInstance.current.invalidateSize();
      if (markersGroupFull.current) updateFullMarkers();
    }, 250);
  };

  // Close fullscreen and cleanup
  const closeFullScreen = () => {
    setShowFullScreen(false);
    setSelectedLocation(null);
  };

  const locateUser = () => {
  if (!navigator.geolocation) {
    alert("Your browser does not support location access.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const { latitude, longitude } = coords;
      if (!fullMapInstance.current) return;

      // Add or move user marker
      if (!window._userMarker) {
        window._userMarker = L.marker([latitude, longitude], {
          icon: L.divIcon({
            html: `<div style="width:18px;height:18px;border-radius:50%;background:#0A84FF;border:3px solid #fff;box-shadow:0 0 8px rgba(0,0,0,0.55);"></div>`
          }),
        }).addTo(fullMapInstance.current);
      } else {
        window._userMarker.setLatLng([latitude, longitude]);
      }

      // Now apply auto fit bounds
      const bounds = L.latLngBounds([]);

      // Add all place markers
      locations.forEach((loc) => {
        if (loc.latitude && loc.longitude) {
          bounds.extend([loc.latitude, loc.longitude]);
        }
      });

      // Add user location
      bounds.extend([latitude, longitude]);

      fullMapInstance.current.fitBounds(bounds, {
        padding: [80, 80],
        animate: true,
      });
    },
    () => alert("Unable to get your location! Please enable GPS."),
    { enableHighAccuracy: true }
  );
};


  return (
    <div className="map-page-container">
      <style>{`
        .map-page-container { width:100%;margin: 1rem 0 1rem 0 }
        .small-map-wrapper { position: relative; width: 100%; height: 300px; border-radius: 0px; overflow: hidden; border: 1px solid #e6e6e6; cursor: pointer; }
        .small-map-wrapper .small-map { width:100%; height:100%; }
        .map-overlay-text { position: absolute; display: flex; align-items: center; bottom: 15px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.5); color: #fff; font-family:"inter"; padding:8px 12px; border-radius: 2px; font-size: 13px; z-index:999;font-weight: 400; }
        .custom-divicon.preview-divicon { background: transparent; border: none; }
        .marker-wrap { display:flex; align-items:center; gap:0px; }
        .marker-img { width:32px; height:32px; border-radius:6px; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
        .mini-label { color: #002b11; border-radius: 8px; box-shadow: 0 6px 18px rgba(15,15,15,0.08); font-weight: 400; font-size: 12px; text-shadow:-1px -1px 0 #fff,1px -1px 0 #fff,-1px  1px 0 #fff,1px  1px 0 #fff; }
        .mini-label-preview { transform: translateY(-4px); }

        /* Full map marker divicon */
        .custom-divicon.full-divicon { background: transparent; border: none; }
        .marker-wrap-full { display:flex; align-items:center; gap:2px; transition: transform 0.2s ease-in-out; }
        .marker-wrap-full:hover .marker-img-full  { transform: scale(1.2); z-index: 10; }
        .marker-img-full { width:38px; height:38px; border-radius:6px;  }
        
        .mini-label-full { transition: all 0.4s !important; background: #fff; color:#111; padding:3px 6px 3px 6px;clip-path: polygon(100% 0, 100% 100%, 7% 100%, 7% 86%, 0 87%, 7% 64%, 7% 0); border-radius: 0; box-shadow: 0 10px 30px rgba(0,0,0,0.08); max-width: 220px;font-size:10px;font-family: system-ui;position:absolute; bottom:20px;left:30px; transition: background-color 0.2s, color 0.2s; }
        .marker-wrap-full:hover .mini-label-full { background: #000; }
        .mini-ti-re-div {display:flex;align-items:center;margin-left:14px;text-shadow:none;}
        .mini-rating { transition: all 0.4s !important;font-size:12px; color:#333; margin-bottom:0px; font-weight:700; transition: color 0.2s; }
        .mini-title {transition: all 0.4 !importants; font-size:14px;font-family: system-ui; font-weight:400; color:#002b11; margin-right:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; transition: color 0.2s; }
        .mini-desc {transition: all 0.4s !important;text-shadow: none;font-size:12px; margin-left:14px; color:#555; max-height: 55px; max-width:22ch; overflow:hidden; display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; word-break:break-word; transition: color 0.2s;}
        .marker-wrap-full:hover .mini-title{ color:#fff;text-shadow: none  }
        .marker-wrap-full:hover .mini-desc{ color:#fff;text-shadow: none }
        .marker-wrap-full:hover .mini-rating{ color:#fff;text-shadow: none }
        /* Selected state for marker */
        .leaflet-div-icon.selected .marker-wrap-full { transform: scale(1.05); }
        .leaflet-div-icon.selected .mini-label-full { background-color: #002b11; color: #fff; }
        .leaflet-div-icon.selected .mini-label-full .mini-title,
        .leaflet-div-icon.selected .mini-label-full .mini-desc { color: #fff; }
        .leaflet-div-icon.selected .mini-label-full .mini-rating { color: #f0f0f0; }        
        
        .leaflet-tooltip { background: transparent; box-shadow:none;border:none;padding:0; }
        .custom-hover-tooltip .leaflet-tooltip-content { padding:0; background: transparent; border:none; }
        .hover-tooltip-inner { display:flex; flex-direction:column; align-items:center; gap:6px; background:#transparent;width:45px;}
        .hover-thumb { width:45px; height:45px; border-radius:50%; object-fit:cover; border:3px solid #fff;  }
        .hover-text { background:#111; color:#fff; padding:4px 10px; border-radius:12px; font-size:12px; }
        .fullscreen-overlay { position: fixed; inset:0; z-index: 99999; display:flex; flex-direction:column; }
        .fullscreen-topbar { height:56px; display:flex; right:8px; top:8px; align-items:center; padding:0; box-shadow: 0 2px 10px rgba(0,0,0,0.06); z-index: 999;;position:absolute; }
        .btn-close { background:#fff;  padding:7px ;width:38px; border-radius:50%; cursor:pointer; font-size:16px; color:#2b8dca;box-shadow: 0px 1px 3px rgba(12,12,12,0.4);font-weight: 500;  }
        .full-map-wrap { flex:1; position:relative;}
        .location-card { position: absolute;justify-content: center; left: 50%; transform: translateX(-50%); bottom: 20px; width: min(400px, calc(100% - 32px)); background: tansparent; border-radius: 0px; display:flex; gap:12px; padding:0px; align-items:center; z-index: 9999; }
        .location-card img { width:150px; height:110px; object-fit:cover; border-radius:0px; }
        .location-card .info h3 { margin:0; font-size:16px; color:#111; }
        .location-card .info p { margin:0; color:#444; font-size:12px; max-height:56px; overflow:hidden; text-overflow:ellipsis; }
        .location-card .meta { margin-top:0px; display:flex; gap:8px; align-items:center; font-size:13px; color:#222; }
        @media (max-width:720px) {
          .location-card { left: 50%; transform: translateX(-50%); width:100%; border-radius: 12px 12px 0 0; padding:0px; }
          .location-card img { width:120; height:100px; }
        }
      `}</style>

      <div className="small-map-wrapper" onClick={openFullScreen}>
        <div ref={smallMapRef} className="small-map"></div>
        <div className="map-overlay-text"> <img style={{width:'17px',marginBottom:'0px',marginRight:'2px'}} src="/assets/expand.svg" alt="expand icon" /> Full view</div>
      </div>

      {showFullScreen && (
        <div className="fullscreen-overlay" role="dialog" aria-modal="true">
          {/*  Current Location Button (Full screen only) */}
  <button
    onClick={locateUser}
    style={{
      background:"#fff",
      padding:"7px",
      width:"38px",
      borderRadius:"50%",
      cursor:"pointer",
      fontSize:"18px",
      marginLeft:"10px",
      color:"#0077ff",
      boxShadow:"0 1px 4px rgba(0,0,0,0.3)",
      
      position:'absolute',
      zIndex:'9999',
      top:'83px'
      
    }}
    title="Go to my location"
  >
    <img style={{ transform: "rotate(0deg)" }} src="/assets/location-arrow.png" alt="map-location-icon" />
  </button>
          <div className="fullscreen-topbar">    
  <button className="btn-close" onClick={closeFullScreen}>✕</button>

  
</div>

          <div className="full-map-wrap">
            <div ref={fullMapRef} style={{ width: "100%", height: "100%" }} />
            {selectedLocation && (
              <div className="location-card" role="region" aria-label={`Details of ${selectedLocation.name}`}>
                <div style={{width:'auto', display:"flex",justifyContent:'center',gap:'10px',background:'#fff',padding:'0px',boxShadow: '0 2px 3px  #00000026',borderRadius:'3px'}}>
                <a style={{objectFit:'cover'}} href={selectedLocation.link} target="_blank"  rel="noopener noreferrer"><img style={{objectFit:'cover', cursor:'pointer', borderRadius:'3px'}} src={selectedLocation.image || selectedLocation.icon?.url || defaultIcon} alt={selectedLocation.name} /> </a>
                <div style={{padding:'8px 8px 0px  0', display:'flex',alignItems:'center'}} className="info">
                  <div>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative'}}>
                  <div style={{display:'flex',alignItems:'center',}}>
                  <h3>{selectedLocation.name}</h3>
                  <div className="meta">
                    <div style={{ fontWeight: 500,marginLeft:'5px' }}>{selectedLocation.rating ? `⭐${selectedLocation.rating}.0`: "No rating"}</div>
                  </div>
                  </div> 
                  <div></div>               
                  </div>                  
                  <p>{selectedLocation.description}</p>
                  {selectedLocation.link && (
                    <div style={{ marginTop: 0, display:'inline-block',background:'transparent',position:'relative' }}>
                      <a href={selectedLocation.link} target="_blank" rel="noopener noreferrer" className="mini-label" style={{ textDecoration: "underline",textShadow:'none',boxShadow:'none',color:'#ff8562', }}>Check details</a>
                    </div>
                  )}
                  
                </div>                  
                </div> 
                <div style={{ marginLeft: 8 }}>
                    <button onClick={() => setSelectedLocation(null)} style={{ background: "#fff", borderRadius: '50%',height:'30px',width:'30px',color:"#222",boxShadow:'0 2px 12px #00000026',marginRight:'5px',marginTop:'5px',cursor:'pointer' }}>✕</button>
                  </div>               
              </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLocationPreview;