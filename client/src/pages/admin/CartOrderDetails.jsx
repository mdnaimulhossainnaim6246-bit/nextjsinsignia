// import React, { useEffect, useState, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import ImageLightbox from '../../components/ImageLightbox'; // Import the lightbox component
// import './CartOrderDetails.css'; // Import the new CSS file
// // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// const CartOrderDetails = () => {
//   const { axios } = useAppContext();
//   const { id } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [allCategories, setAllCategories] = useState([]);
//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [lightboxImage, setLightboxImage] = useState('');
//   const pdfRef = useRef();

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         const { data } = await axios.get(`/api/cart-orders/${id}`);
//         if (data.success) {
//           setOrder(data.order);
//         } else {
//           toast.error('Failed to fetch order details');
//         }
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Failed to fetch order details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchOrderDetails();
//     }
//   }, [id, axios]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get("/addtour/all");
//         // const { data } = await axios.get(`${BACKEND_URL}/addtour/all`);
//         if (data.success && Array.isArray(data.tour)) {
//           setAllCategories(data.tour);
//         }
//       } catch {
//         toast.error("Failed to load category titles");
//       }
//     };
//     fetchCategories();
//   }, [axios]);

//   const getCategoryName = (categoryId) => {
//     const match = allCategories.find((cat) => cat._id === categoryId);
//     return match?.title || "Unknown City";
//   };

//   const totalPlaces = order?.cartItems?.length || 0;
//   const uniqueCities = order ? [...new Set(order.cartItems.map(item => getCategoryName(item.category)))] : [];

//   const openLightbox = (image) => {
//     setLightboxImage(image);
//     setLightboxOpen(true);
//   };

//   const closeLightbox = () => {
//     setLightboxOpen(false);
//     setLightboxImage('');
//   };

//   const handleDownloadPDF = () => {
//     const toastId = toast.loading('Downloading PDF...');
//     const input = pdfRef.current;
//     html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4', true);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = pdf.internal.pageSize.getHeight();
//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;
//       const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
//       const imgX = (pdfWidth - imgWidth * ratio) / 2;
//       const imgY = 15;
//       pdf.setFontSize(18);
//       pdf.text('Order Details', pdfWidth / 2, 10, { align: 'center' });
//       pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
//       pdf.save(`order-details-${order._id}.pdf`);
//       toast.success('PDF Downloaded!', { id: toastId });
//     }).catch((error) => {
//       toast.error('Failed to download PDF.', { id: toastId });
//     });
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!order) {
//     return <div>Order not found.</div>;
//   }

//   return (
//     <>
//       <div className="order-details-container">
//         <div className="order-details-card" ref={pdfRef}>
//           <div className="card-body">
//             <div className="detail-item">
//               <strong>Order ID:</strong> {order._id}
//             </div>
//             <div className="detail-item">
//               <strong>Customer Name:</strong> {order.fullName}
//             </div>
//             <div className="detail-item">
//               <strong>Country:</strong> {order.country || 'N/A'}
//             </div>
//             {order.profileImage && (
//               <div className="detail-item profile-image-container">
//                 <strong>Profile Image:</strong>
//                 <img 
//                   src={order.profileImage} 
//                   alt="Profile" 
//                   className="profile-image" 
//                   onClick={() => openLightbox(order.profileImage)}
//                 />
//               </div>
//             )}
//             <div className="detail-item">
//               <strong>Gender:</strong> {order.gender}
//             </div>
//             <div className="detail-item">
//               <strong>Other Travelers:</strong> {order.otherTravelers || 'N/A'}
//             </div>
//             <div className="detail-item">
//               <strong>Phone:</strong> {order.phone}
//             </div>
//             <div className="detail-item">
//               <strong>Email:</strong> {order.email}
//             </div>
//             <div className="detail-item">
//               <strong>Notes:</strong> {order.notes || 'N/A'}
//             </div>
//             <div className="detail-item">
//               <strong>Status:</strong> <span className={`status-badge status-${order.status}`}>{order.status}</span>
//             </div>
//             <div className="detail-item">
//               <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
//             </div>
//             <div className="detail-item">
//               <strong>Tour Date:</strong> {new Date(order.tourDate).toLocaleDateString()}
//             </div>
//           </div>

//           <div className="total-summary">
//             <h1 className="total-summary-h">SUMMARY</h1>
//             <p>
//               <strong>🏨Hotel Type:</strong> {order.hotelType}
//             </p>
//             <p>
//               <strong>✈️Transport Type:</strong> {order.transportType}
//             </p>
//             <p>
//               <strong>👥Number of Persons:</strong> {order.personCount}
//             </p>
//             <p>
//               <strong>🔢Total Places:</strong> {totalPlaces}
//             </p>
//             <p>
//               <strong>🏙️Cities Covered:</strong> {uniqueCities.join(", ")}
//             </p>
//             <p>
//               <strong>☀️Total Days:</strong> {order.dayCount}
//             </p>
//             <p>
//               <strong>🌙Total Nights:</strong> {order.nightCount}
//             </p>
//             <p>
//               <strong>🍽️Total Food Cost:</strong> ${(order.foodCost || 0).toFixed(2)}
//             </p> 
//             <p>
//               <strong>🏖️Total Place Fee:</strong> ${(order.placeCost || 0).toFixed(2)}
//             </p> 
//             <p>
//               <strong>🏨Hotel Cost:</strong> ${(order.hotelCost || 0).toFixed(2)}
//             </p>
//             <p>
//               <strong>✈️Transport Cost:</strong> ${(order.transportCost || 0).toFixed(2)}
//             </p>
//             <p className="cart-grand-total-p">
//               <strong className="cart-grand-total">💰Grand Total:</strong> ${(order.totalAmount || 0).toFixed(2)}
//             </p>
//           </div>

//           <div className="cart-items-section">
//             <h4>Cart Items</h4>
//             <table className="table-order">
//               <thead>
//                 <tr>
//                   <th className='cart-order-th'>Image</th>
//                   <th className='cart-order-th'>Item</th>
//                   <th className='cart-order-th'>Category</th>
//                   <th className='cart-order-th'>Food</th>
//                   <th className='cart-order-th'>Price</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {order.cartItems.map((item, index) => (
//                   <tr key={index}>
//                     <td className='cart-order-td'><img src={item.image} alt={item.title} style={{width: '100px', height: 'auto', borderRadius: '5px'}} onClick={() => openLightbox(item.image)}/></td>
//                     <td className='cart-order-td'>{item.title}</td>
//                     <td className='cart-order-td'>{getCategoryName(item.category)}</td>
//                     <td className='cart-order-td'>{order.foodSelections && order.foodSelections[item._id] ? order.foodSelections[item._id] : 'N/A'}</td>
//                     <td className='cart-order-td'>${item.price}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <div style={{ textAlign: 'center', padding: '1rem 0' }}>
//           <button onClick={handleDownloadPDF} className="download-pdf-btn">Download as PDF</button>
//         </div>
//       </div>
//       {lightboxOpen && <ImageLightbox imageUrl={lightboxImage} onClose={closeLightbox} />} 
//     </>
//   );
// };

// export default CartOrderDetails;