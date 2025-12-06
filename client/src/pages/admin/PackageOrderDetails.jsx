import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ImageLightbox from '../../components/ImageLightbox'; // Corrected path
import './PackageOrderDetails.css';


const PackageOrderDetails = () => {
  const { axios } = useAppContext();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const pdfRef = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const { data } = await axios.get(`/api/package-orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (data.success) {
          console.log('API Response:', data);
          setOrder(data.order);
        } else {
          toast.error('Failed to fetch order details');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch order details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, axios, token]);

  const handleDownloadPDF = () => {
    const toastId = toast.loading('Downloading PDF...');
    const input = pdfRef.current;
    html2canvas(input, { 
      scale: 2,
      useCORS: true // Allow cross-origin images
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 15;
      pdf.setFontSize(18);
      pdf.text('Order Details', pdfWidth / 2, 10, { align: 'center' });
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`order-details-${order._id}.pdf`);
      toast.success('PDF Downloaded!', { id: toastId });
    }).catch((error) => {
      toast.error('Failed to download PDF.', { id: toastId });
      console.error('PDF Download Error:', error);
    });
  };

  const handleImageDownload = () => {
    const link = document.createElement('a');
    link.href = order.profileImage;
    link.download = `profile-image-${order.fullName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found.</div>;
  }

  return (
    <>
      <div className="order-details-container">
        <div className="order-details-card" ref={pdfRef}>
          <div className="card-body">
            <div className="detail-item">
              <strong>Order ID:</strong> {order._id}
            </div>
            <div className="detail-item">
              <strong>Customer Name:</strong> {order.fullName}
            </div>
            <div className="detail-item">
              <strong>Age:</strong> {order.age || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Country:</strong> {order.country || 'N/A'}
            </div>
            {order.profileImage && (
              <div className="detail-item profile-image-container">
                <strong>Profile Image:</strong>
                <img 
                  src={order.profileImage} 
                  alt="Profile" 
                  className="profile-image" 
                  onClick={() => setLightboxOpen(true)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}

            {order.package && (
              <div className="detail-item package-summary" style={{ gridColumn: 'span 2' }}>
                <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Package Details</h4>
                <img src={order.package.image} alt={`Thumbnail for ${order.package.place}`} style={{ maxWidth: '300px', borderRadius: '8px', marginBottom: '1rem', display: 'block', margin: '0 auto' }} />
                <div className="package-summary-details" style={{ textAlign: 'center' }}>
                  <p>
                    <strong>Duration:</strong> {order.package.duration?.value} {order.package.duration?.unit}
                  </p>
                  <div className="locations">
                    <strong>Locations:</strong>
                    {order.package.placesLocation?.map((loc, index) => (
                      <span key={index} style={{ display: 'inline-block', backgroundColor: '#e0e0e0', padding: '0.3rem 0.8rem', borderRadius: '15px', margin: '0.2rem', fontSize: '0.9rem',color:'#555' }}>{loc.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="detail-item">
              <strong>Place:</strong> {order.place}
            </div>
            <div className="detail-item">
              <strong>Number of Persons:</strong> {order.numberOfPersons}
            </div>
            <div className="detail-item">
              <strong>Price Per Person:</strong> ${order.pricePerPerson}
            </div>
            <div className="detail-item">
              <strong>Total Cost:</strong> ${order.totalCost}
            </div>
            <div className="detail-item">
              <strong>Gender:</strong> {order.gender}
            </div>
            <div className="detail-item">
              <strong>Other Travelers:</strong> {order.otherTravelers || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Phone:</strong> +{order.phone}
            </div>
            <div className="detail-item">
              <strong>Email:</strong> {order.email}
            </div>
            <div className="detail-item">
              <strong>Notes:</strong> {order.notes || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Client Problem:</strong> {order.clientProblem || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Notes:</strong> {order.notes || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Pick-up Address:</strong> {order.pickupAddress || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Tour Date:</strong> {new Date(order.tourDate).toLocaleDateString()}
            </div>
            <div className="detail-item">
              <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
            </div>
            {/* <div className="detail-item">
              <strong>Status:</strong> <span className={`status-badge status-${order.status}`}>{order.status}</span>
            </div> */}
          </div>
          <div className="detail-item" style={{textAlign:'center'}}>
              <strong>Status:</strong> <span className={`status-badge status-${order.status}`}>{order.status}</span>
            </div>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <button onClick={handleDownloadPDF} className="download-pdf-btn">Download as PDF</button>
        </div>
      </div>

      {isLightboxOpen && (
        <ImageLightbox 
          src={order.profileImage} 
          onClose={() => setLightboxOpen(false)} 
          onDownload={handleImageDownload}
        />
      )}
    </>
  );
};

export default PackageOrderDetails;
