// // src/pages/admin/ListBookingPlace.jsx

// import React, { useEffect, useState } from "react";
// import Loader from "../../components/Loader";
// import toast from "react-hot-toast";
// import BookingPlaceTable from "../../components/addmin/BookingPlaceTable";
// import api from "../../utils/api";
// // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


// const ListBookingPlace = () => {
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [uploadedCount, setUploadedCount] = useState(0);
//   const [draftCount, setDraftCount] = useState(0);
//   const [categories, setCategories] = useState([]);
//   const [selectedPlaces, setSelectedPlaces] = useState([]);

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedPlaces(places.map((p) => p._id));
//     } else {
//       setSelectedPlaces([]);
//     }
//   };

//   const handleSelect = (e, id) => {
//     if (e.target.checked) {
//       setSelectedPlaces((prev) => [...prev, id]);
//     } else {
//       setSelectedPlaces((prev) => prev.filter((pId) => pId !== id));
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (!window.confirm("Are you sure you want to delete the selected places?")) return;
//     try {
//       const { data } = await api.post("/addbooking/delete-many", { ids: selectedPlaces });
//       if (data.success) {
//         toast.success("Selected places deleted");
//         setPlaces((prev) => prev.filter((p) => !selectedPlaces.includes(p._id)));
//         setSelectedPlaces([]);
//       } else {
//         toast.error("Failed to delete selected places");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Booking places fetch (showAll=true to get all, published+unpublished)

//         const { data: placesData } = await api.get("/addbooking/all?showAll=true");
//         // const { data: placesData } = await api.get(`${BACKEND_URL}/addbooking/all?showAll=true`);

//         // Categories fetch (tours)
//         const { data: catsData } = await api.get("/addtour/all");
//         // const { data: catsData } = await api.get(`${BACKEND_URL}/addtour/all`);

//         if (placesData.success && catsData.success) {
//           const catsMap = new Map();
//           catsData.tour.forEach((cat) => {
//             catsMap.set(cat._id, cat.title); // map _id to title
//           });

//           // Attach category name to places
//           const updatedPlaces = placesData.places.map((place) => ({
//             ...place,
//             categoryName: catsMap.get(place.tour) || place.tour,
//           }));

//           setPlaces(updatedPlaces);

//           setUploadedCount(updatedPlaces.filter((p) => p.isPublished).length);
//           setDraftCount(updatedPlaces.filter((p) => !p.isPublished).length);
//           setCategories(catsData.tour);
//         } else {
//           toast.error("Failed to fetch places or categories");
//           setPlaces([]);
//         }
//       } catch (error) {
//         toast.error("Server error while fetching data");
//         setPlaces([]);
//       }
//       setLoading(false);
//     };

//     fetchData();
//   }, []);

//   const deleteHandler = async (id) => {
//     if (!window.confirm("Are you sure you want to delete?")) return;

//     try {
//       const { data } = await api.post("/addbooking/delete", { id });
//       if (data.success) {
//         toast.success("Place deleted");
//         // Delete হয়ে গেলে শুধু জায়গা থেকে আইটেম রিমুভ করবো, রি-ফেচ নয়
//         setPlaces((prevPlaces) => prevPlaces.filter((place) => place._id !== id));
//         setUploadedCount((prev) => prev - 1);
//       } else {
//         toast.error("Delete failed");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const togglePublish = async (id) => {
//     try {
//       const { data } = await api.post("/addbooking/toggle-publish", { id });
//       if (data.success) {
//         const msg = data.isPublished
//           ? "Booking place published successfully"
//           : "Booking place unpublished successfully";
//         toast.success(msg);

//         setPlaces((prevPlaces) =>
//           prevPlaces.map((place) =>
//             place._id === id ? { ...place, isPublished: data.isPublished } : place
//           )
//         );

//         setUploadedCount((prev) => (data.isPublished ? prev + 1 : prev - 1));
//         setDraftCount((prev) => (data.isPublished ? prev - 1 : prev + 1));
//       } else {
//         toast.error("Failed to update status");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="admin-list-posts">
//       <h2 className="admin-section-title">All Booking Places</h2>

//       {/* Summary */}
//       <div className="add-tour-main-container">
//         <div className="total-data-effect">
//           <div className="tottal-data">
//             <i className="Data-icon fa-solid fa-clipboard-list"></i>
//             <div className="data-contain">
//               <p className="Data-count">{uploadedCount}</p>
//               <p className="data-title">Uploaded</p>
//             </div>
//           </div>
//         </div>

//         <div className="total-data-effect">
//           <div className="tottal-data-draft">
//             <i className="Data-icon fa-solid fa-file-pen"></i>
//             <div className="data-contain">
//               <p className="Data-count">{draftCount}</p>
//               <p className="data-title">Drafts</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Recent Added Table */}
      
//         <div className="data-list">
//           <i className="recent-Data-icon fa-solid fa-table-list"></i>
//           <p className="Recent-added">Recent Added</p>
//           {selectedPlaces.length > 0 && (
//             <button onClick={handleDeleteSelected} className="delete-selected-btn">
//               Delete Selected ({selectedPlaces.length})
//             </button>
//           )}
//         </div>

//       {/* Table */}
//       {loading ? (
//         <Loader />
//       ) : (
//         <div className="data-table-booking-place">
//           <table className="table">
//             <thead className="table-thead">
//               <tr className="data-table-tr data-table-tr-thead-booking">
//                 <th className="table-th-n">
//                   <input type="checkbox" onChange={handleSelectAll} checked={selectedPlaces.length === places.length && places.length > 0} />
//                 </th>
//                 <th className="table-th-n">#</th>
//                 <th className="table-th-title">PLACE</th>
//                 <th className="table-th-category">CITY</th>
//                 <th className="table-th-price">PRICE</th>
//                 {/* <th className="table-th-food">FOOD</th> */}
//                 <th className="table-th-status">STATUS</th>
//                 <th className="table-th-action">ACTION</th>
//               </tr>
//             </thead>
//             <tbody className="table-tbody">
//               {places.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
//                     No Booking Places Found
//                   </td>
//                 </tr>
//               ) : (
//                 places.map((place, index) => (
//                   <BookingPlaceTable
//                     key={place._id}
//                     place={{
//                       ...place,
//                       category: place.categoryName,
//                       foodAvailability: place.foodAvailability || place.food,
//                     }}
//                     index={index + 1}
//                     deleteHandler={deleteHandler}
//                     togglePublish={togglePublish}
//                     handleSelect={handleSelect}
//                     isSelected={selectedPlaces.includes(place._id)}
//                   />
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ListBookingPlace;
