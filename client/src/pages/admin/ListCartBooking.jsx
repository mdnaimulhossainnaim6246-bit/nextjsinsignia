
// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';
// import CartBookingTable from '../../components/addmin/CartBookingTable';

// const ListCartBooking = () => {
//   const [cartBookings, setCartBookings] = useState([]);
//   const { axios } = useAppContext();

//   const fetchCartBookings = async () => {
//     try {
//       const { data } = await axios.get('/api/cart-orders');
//       if (data.success) {
//         setCartBookings(data.orders);
//       } else {
//         toast.error(data.message || 'Failed to fetch cart bookings');
//       }
//     } catch (error) {
//       toast.error(error.message || 'Error fetching cart bookings');
//     }
//   };

//   useEffect(() => {
//     fetchCartBookings();
//   }, []);

//   return (
//     <div>
//       <div>
//         <div className="data-list">
//           <i className="recent-Data-icon fa-solid fa-table-list"></i>
//           <p className="Recent-added">Cart Bookings</p>
//         </div>

//         <div className="data-table">
//           <table className="table">
//             <thead className="table-thead">
//               <tr className="data-table-tr data-table-tr-thead">
//                 <th scope="col" className="table-th-n">#</th>
//                 <th scope="col" className="table-th-title">Full Name</th>
//                 <th scope="col" className="table-th-title">Email</th>
//                 <th scope="col" className="table-th-status">Date</th>
//                 <th scope="col" className="table-th-status">STATUS</th>
//                 <th scope="col" className="table-th-action">ACTION</th>
//               </tr>
//             </thead>

//             <tbody className="table-tbody">
//               {Array.isArray(cartBookings) && cartBookings.length > 0 ? (
//                 cartBookings.map((booking, index) => (
//                   <CartBookingTable
//                     key={booking._id}
//                     booking={booking}
//                     fetchCartBookings={fetchCartBookings}
//                     index={index + 1}
//                   />
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" style={{ textAlign: 'center' }}>
//                     No cart bookings found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ListCartBooking;
