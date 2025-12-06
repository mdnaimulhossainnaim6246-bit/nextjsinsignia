import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASS.trim(),
  },
});



const generateBookingHtml = (orderDetails) => {
  if (orderDetails.cartItems && orderDetails.cartItems.length > 0) {
    // CartOrder HTML

    
    const itemsHtml = orderDetails.cartItems.map(item => `

      <li>
        <strong>Place Name:</strong> ${item.title} <br/>
        <strong>City Name (of this place):</strong> ${item.categoryName} <br/>
        <strong>Place Fee:</strong> $${item.price.toFixed(2)} <br/>
        <strong>Food Type:</strong> ${item.foodSelection || 'N/A'}
      </li>
    `).join('');

    return `
       
      <ul>
      <h3> Booking Place details </h3>
      
        ${itemsHtml}
      </ul>
        
      <div>
        <h3> Booking form details </h3>
      <p><strong>Gender:</strong> ${orderDetails.gender || 'N/A'}</p>
      <p><strong>Other Travelers Name:</strong> ${orderDetails.otherTravelers || 'N/A'}</p>
      <p><strong>Hotel Type:</strong> ${orderDetails.hotelType || 'N/A'}</p>
      <p><strong>Transport Type:</strong> ${orderDetails.transportType || 'N/A'}</p>
      <p><strong>Number of Person:</strong> ${orderDetails.personCount || 'N/A'}</p>
      <p><strong>Total Day(s):</strong> ${orderDetails.dayCount || 'N/A'}</p>
      <p><strong>Total Night(s):</strong> ${orderDetails.nightCount || 'N/A'}</p>
      <p><strong> Total Place Fee:</strong> $${orderDetails.placeCost ? orderDetails.placeCost.toFixed(2) : 'N/A'}</p>
      <p><strong>Food Cost:</strong> $${orderDetails.foodCost ? orderDetails.foodCost.toFixed(2) : 'N/A'}</p>
      <p><strong>Hotel Cost:</strong> $${orderDetails.hotelCost ? orderDetails.hotelCost.toFixed(2) : 'N/A'}</p>
      <p><strong>Transport Cost:</strong> $${orderDetails.transportCost ? orderDetails.transportCost.toFixed(2) : 'N/A'}</p>
      <p><strong>Grand Total:</strong> $${Math.round(orderDetails.totalAmount)}</p>
      </div>
    `;
  } else {
    const packageDetails = orderDetails.package || {};
    const locations = packageDetails.placesLocation?.map(loc => loc.name).join(', ') || 'N/A';

    return `

     <h2> Package Details </h2>    

      <ul>
       <li><strong>Order ID:</strong> ${orderDetails._id || 'N/A'}</li>
        <li><strong>Package Name:</strong> ${packageDetails.place || 'N/A'}</li>
        <li><strong>Booking Date (BD Time):</strong> ${new Date(orderDetails.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}</li>
        <li><strong>Booking Date (Your Local Time):</strong> ${new Date(orderDetails.createdAt).toLocaleString()}</li>
        <li><strong>Number of Persons:</strong> ${orderDetails.numberOfPersons || 'N/A'}</li>
        <li><strong>Duration:</strong> 
          ${packageDetails.duration?.value || 'N/A'} 
          ${packageDetails.duration?.unit || ''}(s)
        </li>
        
        <li><strong>Locations:</strong> ${locations}</li>
        <li><strong>Price from per Person:</strong> $${orderDetails.pricePerPerson ? orderDetails.pricePerPerson.toFixed(2) : 'N/A'} </li>
      </ul>

     <h2> Your Details </h2>

     <ul>
        
        <li><strong>Name:</strong> ${orderDetails.fullName || 'N/A'}</li>
        <li><strong>Gender:</strong> ${orderDetails.gender || 'N/A'}</li>
        <li><strong>Age:</strong> ${orderDetails.age || 'N/A'}</li>
        <li><strong>Country:</strong> ${orderDetails.country || 'N/A'}</li>
        
      </ul>

      <h2> Contact & Tour Information </h2>

      <ul>
        <li><strong>WhatsApp Number:</strong> +${orderDetails.phone || 'N/A'}</li>
        <li><strong>Email:</strong> ${orderDetails.email || 'N/A'}</li>
        <li><strong>Tour Date:</strong> ${orderDetails.tourDate ? new Date(orderDetails.tourDate).toLocaleDateString() : 'N/A'}</li>
        <li><strong>Other Travelers Details:</strong> ${orderDetails.otherTravelers || 'N/A'}</li>
        <li><strong>Pick-up Address:</strong> ${orderDetails.pickupAddress || 'N/A'}</li>
      </ul>
        
       <h2> Additional Information </h2>
       <ul>
         
          <li><strong>Problem or Special Request:</strong> ${orderDetails.clientProblem || 'N/A'}</li>
           <li><strong>Notes:</strong> ${orderDetails.notes || 'N/A'}</li>
       </ul>
        
       
    `;
  }
};

export const sendBookingConfirmationEmail = async (userEmail, orderDetails, pdfBuffer) => {
  const mailOptions = {
    from: `"Insignia Tour & Travel" <${process.env.ADMIN_EMAIL}>`,
    to: userEmail,
    subject: "Booking Submitted Successfully – Insignia Tour & Travel",
    html: `
      <div style="font-family: 'poppins', sans-serif; padding: 20px;">
        <h2>Your Booking Has Been Submitted Successfully!</h2>
        
<p style="font-size:16px; color:#333; margin-bottom: 16px;">
  ${orderDetails.fullName 
      ? `Dear <span style="font-weight:bold; color:#1a73e8;">${orderDetails.fullName}</span>,` 
      : 'Dear Customer,'}
</p>



        <p>Thank you for booking with us.Your booking has been successfully submitted and is currently in <strong>Pending</strong> status.</p>

        <p>Please wait for the confirmation email.</p>

        <p>Our team will review your booking and get in touch with you shortly.</p>

        <p>Below are the details of your booking:</p>
        ${generateBookingHtml(orderDetails)}
        <p>We will contact you shortly with more details. A PDF with your order details is attached.</p>
        <br/>
        <p style="font-size: 13px; color: #888;">If you didn't make this booking, please contact us immediately.</p>
      </div>
    `,
    attachments: [
      {
        filename: `Booking-details-${orderDetails._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

export const sendAdminBookingNotificationEmail = async (orderDetails, pdfBuffer) => {
  const mailOptions = {
    from: `"Insignia Tour & Travel" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Booking Notification",
    html: `
      <div style="font-family: 'poppins', sans-serif; padding: 20px;">
        <h2>A new booking has been made.</h2>
        <p>Here are the details:</p>
        ${generateBookingHtml(orderDetails)}
        <p><strong>Booked by:</strong> ${orderDetails.fullName} (${orderDetails.email})</p>
        <p>A PDF with the full order details is attached.</p>
      </div>
    `,
    attachments: [
      {
        filename: `new-order-${orderDetails._id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

export const sendOrderStatusUpdateEmail = async (userEmail, status, orderDetails, pdfBuffer) => {
  let subject = "";
  let text = "";

  switch (status) {
    case "approved":
    case "confirmed":
      subject = "Your Booking is Confirmed!";
      text = "We are pleased to inform you that your booking has been confirmed. Please find the details in the attached PDF.";
      break;
    case "cancelled":
      subject = "Your Booking has been Cancelled";
      text = "We are sorry to inform you that your booking has been cancelled. Please see the attached PDF for details.";
      break;
    case "ongoing":
      subject = "Your Trip is Ongoing!";
      text = "We hope you are enjoying your trip! Please find the summary of your booking in the attached PDF.";
      break;
    case "completed":
    case "finished": 
      subject = "Your Trip has Finished!";
      text = "We hope you enjoyed your trip! Please find the summary of your booking in the attached PDF.";
      break;
    default:
      subject = "Your Booking Status has been Updated";
      text = `Your booking status has been updated to ${status}. Please see the attached PDF for details.`;
  }

  const mailOptions = {
    from: `"Insignia Tour & Travel" <${process.env.ADMIN_EMAIL}>`,
    to: userEmail,
    subject: subject,
    html: `<p>${text}</p>`,
    attachments: [
      {
        filename: `order-details-${orderDetails._id}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

