import https from 'https';



// This helper is still needed for the profile image URL from ImageKit.
const imageToData = (url) => {
  if (!url) return Promise.resolve({ base64: null, error: 'No URL provided' });

  return new Promise((resolve) => {
    https.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        resolve({ error: `Failed to fetch image (Status: ${response.statusCode})` });
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        try {
          const buffer = Buffer.concat(chunks);
          const contentType = response.headers['content-type'] || 'image/jpeg';
          const base64 = `data:${contentType};base64,${buffer.toString('base64')}`;
          resolve({ base64 });
        } catch (e) {
          resolve({ error: `Image conversion failed: ${e.message}` });
        }
      });
    }).on('error', (err) => {
      resolve({ error: `Image download failed: ${err.message}` });
    });
  });
};

const generateOrderHTML = async (order) => {
  // Helper to render a profile image from a URL or show an error.
  const renderProfileImage = async (url, alt) => {
    if (!url) return ''; // No image, so return empty.
    const data = await imageToData(url);
    if (data.error) return `<div class="error">Profile Image Error: ${data.error}</div>`;
    if (data.base64) return `<img src="${data.base64}" alt="${alt}" class="profile-image">`;
    return '';
  };

  // Helper to render a package thumbnail from a Base64 string.
  const renderPackageImage = (base64, alt) => {
    if (base64) return `<img src="${base64}" alt="${alt}" class="package-thumbnail">`;
    return ''; // No thumbnail data.
  };

  const profileImgHtml = await renderProfileImage(order.profileImage, 'Profile Image');
  const bookingDate = new Date(order.createdAt);

  // Common styles for both order types.
  const commonStyles = `
   @page {
  margin: 2rem; 
  size: auto;}


    body { 
      font-family: 'Helvetica Neue', Arial, sans-serif; 
      color: #333; 
      margin: 0; 
      padding: 0;
      background-color: #f7f7f7;
    }
      .item,
.section-header,
.cart-item,
.profile-image,
.package-thumbnail,
.footer,
div, 
p, 
strong, 
span {
  page-break-inside: avoid; 
}

table, tr, td, th {
  page-break-inside: avoid;
  page-break-after: auto;
  page-break-before: auto;
}

        

    .container { 
      padding: 2.5rem; 
      max-width: 800px; 
      margin: 2rem auto; 
      border: 1px solid #777; 
      background-color: #fff;
      box-shadow: 0 0 15px rgba(0,0,0,0.05);
    }
    .header { 
      text-align: center; 
      margin-bottom: 2.5rem; 
      border-bottom: 2px solid #4a90bd;
      padding-bottom: 1rem;
    }
    .header h2 {
      color: #4a90bd;
      font-size: 2rem;
      margin: 0;
    }
    .item { 
      margin-bottom: 0.8rem; 
      padding-bottom: 0.8rem; 
      border-bottom: 1px solid #eee; 
      display: flex;
      align-items: center;
    }
    .item:last-child { border-bottom: none; }
    .item strong { 
      display: inline-block; 
      width: 200px; 
      color: #555; 
      font-weight: 600;
    }
    .status { 
      padding: 0.5rem 1rem; 
      border-radius: 20px; 
      color: white; 
      font-weight: bold; 
      font-size: 0.9rem;
      text-transform: capitalize;
    }
    .status-pending { background-color: #ffc107; }
    .status-approved, .status-confirmed { background-color: #28a745; }
    .status-cancelled { background-color: #dc3545; }
    .status-finished, .status-completed { background-color: #17a2b8; }
    .status-ongoing { background-color: #007bff; }
    .section-header { 
      font-size: 1.6rem; 
      color: #4a90bd; 
      margin-top: 2.5rem; 
      margin-bottom: 1.5rem; 
      text-align: left; 
      border-bottom: 2px solid #f0f0f0; 
      padding-bottom: 0.5rem; 
    }
    .profile-image { 
      max-width: 160px; 
      height: auto;
      
      margin-top: 1rem; 
      border: 3px solid #eee;
    }
    .package-thumbnail { max-width: 250px; display: block; margin: 1rem auto; border-radius: 8px; }
    .location-tag { 
      display: inline-block; 
      background-color: #eaf3fa; 
      color: #4a90bd;
      padding: 0.4rem 0.9rem; 
      border-radius: 15px; 
      margin: 0.2rem; 
      font-size: 0.9rem; 
      font-weight: 500;
    }
    .error { color: red; font-weight: bold; text-align: center; padding: 1rem; background-color: #ffeeee; border: 1px solid red; }
    .cart-item { display: flex; align-items: center; margin-bottom: 1rem; }
    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid #ddd;
      font-size: 0.9rem;
      color: #777;
    }
  `;

  // Shared customer details section.
  const customerDetailsHtml = `
    <div class="section-header">Your Details</div>
    <div class="item"><strong>Name:</strong> ${order.fullName}</div>
    <div class="item"><strong>Age:</strong> ${order.age || 'N/A'}</div>
    <div class="item"><strong>Country:</strong> ${order.country || 'N/A'}</div>
    <div class="item"><strong>WhatsApp Number:</strong> +${order.phone}</div>
    <div class="item"><strong>Email:</strong> ${order.email}</div>
    <div class="item"><strong>Booking Date (Your Local):</strong> ${bookingDate.toLocaleString()}</div>
    <div class="item"><strong>Booking Date (BD Time):</strong> ${bookingDate.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}</div>
    
    <div class="item" style="text-align: center; flex-direction: column; align-items: center;">
      <strong>Your Photo:</strong><br/>
      ${profileImgHtml || 'N/A'}
    </div>
  `;

  let contentHtml;

  // Check if it's a cart order.
  if (order.cartItems && order.cartItems.length > 0) {
    const cartItemsHtml = order.cartItems.map(item => {
      return `
        <div class="cart-item">
          <div>
            <strong>Place: ${item.title}</strong><br>
            <span>City: ${item.categoryName}</span><br>
            <span>Price: $${item.price.toFixed(2)}</span><br>
            <span>Food: ${item.foodSelection || 'N/A'}</span>
          </div>
        </div>
      `;
    }).join('');

    contentHtml = `
      <div class="section-header">Cart Items</div>
      ${cartItemsHtml}
      <div class="section-header">Booking Summary</div>
      <div class="item"><strong>Gender:</strong> ${order.gender || 'N/A'}</div>
      <div class="item"><strong>Other Travelers Name:</strong> ${order.otherTravelers || 'N/A'}</div>
      <div class="item"><strong>Hotel Type:</strong> ${order.hotelType || 'N/A'}</div>
      <div class="item"><strong>Transport Type:</strong> ${order.transportType || 'N/A'}</div>
      <div class="item"><strong>Number of Person:</strong> ${order.personCount || 'N/A'}</div>
      <div class="item"><strong>Total Day(s):</strong> ${order.dayCount || 'N/A'}</div>
      <div class="item"><strong>Total Night(s):</strong> ${order.nightCount || 'N/A'}</div>
      <div class="item"><strong>Total Place Fee:</strong> $${order.placeCost ? order.placeCost.toFixed(2) : 'N/A'}</div>
      <div class="item"><strong>Food Cost:</strong> $${order.foodCost ? order.foodCost.toFixed(2) : 'N/A'}</div>
      <div class="item"><strong>Hotel Cost:</strong> $${order.hotelCost ? order.hotelCost.toFixed(2) : 'N/A'}</div>
      <div class="item"><strong>Transport Cost:</strong> $${order.transportCost ? order.transportCost.toFixed(2) : 'N/A'}</div>
     <div class="item"><strong>Grand Total:</strong> $${Math.round(order.totalAmount)}</div>
    `;
  } else { // Otherwise, it's a package order.
    const packageDetails = order.package || {};
    const locationsHTML = packageDetails.placesLocation?.map(loc => `<span class="location-tag">${loc.name}</span>`).join('') || 'N/A';

    contentHtml = `
      <div class="section-header">Package Information</div>
      <div class="item"><strong>Order ID:</strong> ${order._id}</div>
      <div class="item">
        <strong>Package Name:</strong> 
        <span style="font-weight: 600; color: #333;">${packageDetails.place || 'N/A'}</span>
      </div>
      <div class="item"><strong>Status:</strong> <span class="status status-${order.status}">${order.status}</span></div>
      <div class="item"><strong>Tour Date:</strong> ${order.tourDate ? new Date(order.tourDate).toLocaleDateString() : 'N/A'}</div>
      <div class="item"><strong>Duration:</strong> ${packageDetails.duration?.value || 'N/A'} ${packageDetails.duration?.unit || ''}(s)</div>
      <div style="display:flex; align-items:center;" class="item">
  <strong style="margin-right:0.5rem;">Locations:</strong>
  <div style="overflow-x:auto; white-space:nowrap;"">
    ${locationsHTML}
  </div>
</div>

      
      <div class="section-header">Booking Summary</div>
      <div class="item"><strong>Number of Persons:</strong> ${order.numberOfPersons}</div>
      <div class="item"><strong>Price from per Person:</strong> $${order.pricePerPerson ? order.pricePerPerson.toFixed(2) : 'N/A'}</div>
      

      <div class="section-header">Additional Information</div>
      <div class="item"><strong>Other Travelers Details:</strong> ${order.otherTravelers || 'N/A'}</div>
      <div class="item"><strong>Pick-up Address:</strong> ${order.pickupAddress || 'N/A'}</div>
      <div class="item"><strong>Problem or Special Request:</strong> ${order.clientProblem || 'N/A'}</div>
      <div class="item"><strong>Notes:</strong> ${order.notes || 'N/A'}</div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head><style>${commonStyles}</style></head>
    <body>
      <div class="container">
        <div class="header"><h2>Booking Invoice</h2></div>
        ${customerDetailsHtml}
        ${contentHtml}
        <div class="footer">
          <p>Thank you for booking with Insignia Tour & Travel.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};


export default generateOrderHTML;

