// import React, { useEffect, useState } from 'react';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import './ListPackageOrders.css'; 

// const ListPackageOrders = () => {
//   const { axios, token } = useAppContext();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get('/api/package-orders');
//       if (data.success) {
//         setOrders(data.orders);
//       } else {
//         toast.error('Failed to fetch package orders');
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to fetch package orders');
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if(token) {
//       fetchOrders();
//     }
//   }, [token]);

//   const handleStatusChange = async (orderId, status) => {
//     if (window.confirm('Are you sure you want to change the status?')) {
//       try {
//         await axios.put(`/api/package-orders/${orderId}/status`, { status });
//         toast.success('Order status updated');
//         fetchOrders();
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Failed to update order status');
//       }
//     }
//   };

//   const handleDelete = async (orderId) => {
//     try {
//       await axios.delete(`/api/package-orders/${orderId}`);
//       toast.success('Order deleted');
//       fetchOrders();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to delete order');
//     }
//   };

//   if (loading) {
//     return <div className="loader-container"><div className="loader"></div></div>;
//   }

//   return (
//     <div className="list-table-container">
//       <h2>All Package Orders</h2>
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Customer Name</th>
//             <th>Profile Image</th>
//             <th>Place</th>
//             <th>No. of Persons</th>
//             <th>Other Travelers</th>
//             <th>Total Cost</th>
//             <th>Order Time</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order) => (
//             <tr key={order._id}>
//               <td>{order.fullName}</td>
//               <td>
//                 {order.profileImage ? (
//                   <img
//                     src={order.profileImage}
//                     alt="Profile"
//                   />
//                 ) : '-'}
//               </td>
//               <td>{order.package?.place}</td>
//               <td>{order.numberOfPersons}</td>
//               <td>{order.otherTravelers || 'N/A'}</td>
//               <td>${order.totalCost}</td>
//               <td>{new Date(order.createdAt).toLocaleString()}</td>
//               <td>
//                 <select
//                   value={order.status}
//                   onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="cancelled">Cancelled</option>
//                   <option value="ongoing">Ongoing</option>
//                   <option value="completed">Completed</option>
//                 </select>
//               </td>
//               <td>
//                 <button onClick={() => navigate(`../package-order/${order._id}`)}>
//                   View
//                 </button>
//                 <button onClick={() => handleDelete(order._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ListPackageOrders;



import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './ListPackageOrders.css'; 

const ListPackageOrders = () => {
  const { axios, token } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/package-orders');
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error('Failed to fetch package orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch package orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const handleStatusChange = async (orderId, status) => {
    if (!window.confirm('Are you sure you want to change the status?')) return;
    try {
      await axios.put(`/api/package-orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`/api/package-orders/${orderId}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete order');
    }
  };


  const orderStatusCounts = orders.reduce(
    (acc, order) => {
      acc.total++;
      acc[order.status]++;
      return acc;
    },
    { total: 0, pending: 0, ongoing: 0, confirmed: 0, cancelled: 0, completed: 0 }
  );

  return (
    <div className="list-table-container list-package-orders-page">
      <h2>All Package Orders</h2>

      <div className="order-summary">
        <div className="summary-card">
          <i className="fas fa-list-alt"></i>
          <div>
            <p>Total Orders</p>
            <span>{orderStatusCounts.total}</span>
          </div>
        </div>
        <div className="summary-card">
          <i className="fas fa-clock"></i>
          <div>
            <p>Pending</p>
            <span>{orderStatusCounts.pending}</span>
          </div>
        </div>
        <div className="summary-card">
          <i className="fas fa-spinner"></i>
          <div>
            <p>Ongoing</p>
            <span>{orderStatusCounts.ongoing}</span>
          </div>
        </div>
        <div className="summary-card">
          <i className="fas fa-check-circle"></i>
          <div>
            <p>Confirmed</p>
            <span>{orderStatusCounts.confirmed}</span>
          </div>
        </div>
        <div className="summary-card">
          <i className="fas fa-times-circle"></i>
          <div>
            <p>Cancelled</p>
            <span>{orderStatusCounts.cancelled}</span>
          </div>
        </div>
         <div className="summary-card">
          <i className="fas fa-check-double"></i>
          <div>
            <p>Completed</p>
            <span>{orderStatusCounts.completed}</span>
          </div>
        </div>
      </div>

      <table className="table-order">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer Name</th>
            {/* <th>Age</th> */}
            <th>Place</th>
            <th>No. of Persons</th>
            {/* <th>Pick-up Address</th> */}
            {/* <th>Any Problem?</th> */}
            {/* <th>Other Travelers</th> */}
            <th>Total Cost</th>
            <th>Order Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="11" className="loader-cell">
                <div className="loader"></div>
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={order._id} style={{ "--i": index + 1 }}>
                <td data-label="#">{index + 1}</td>
                <td data-label="Customer Name">{order.fullName}</td>
                {/* <td data-label="Age">{order.age || 'N/A'}</td> */}
                <td data-label="Place">{order.package?.place}</td>
                <td data-label="No. of Persons">{order.numberOfPersons}</td>
                {/* <td data-label="Pick-up Address">{order.pickupAddress || 'N/A'}</td> */}
                {/* <td data-label="Any Problem?">{order.clientProblem || 'N/A'}</td> */}
                <td data-label="Total Cost">${order.totalCost}</td>
                <td data-label="Order Time">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td data-label="Status">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td data-label="Actions">
                  <button onClick={() => navigate(`../package-order/${order._id}`)}>View</button>
                  <button onClick={() => handleDelete(order._id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListPackageOrders;
