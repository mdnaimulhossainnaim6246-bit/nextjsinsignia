// import PackageOrder from '../models/PackageOrder.js';
// import Package from '../models/packages.js';
// import imagekit from '../configs/imageKit.js';
// import { sendBookingConfirmationEmail, sendAdminBookingNotificationEmail, sendOrderStatusUpdateEmail } from '../utils/sendBookingEmail.js';
// import generateOrderHTML from '../utils/generateOrderPDF.js';
// import pdf from 'html-pdf';
// import fs from 'fs';
// import path from 'path';

// export const createPackageOrder = async (req, res) => {
//   try {
//     const {
//       packageId,
//       numberOfPersons,
//       pricePerPerson,
//       totalCost,
//       gender,
//       fullName,
//       otherTravelers,
//       phone,
//       email,
//       notes,
//     } = req.body;

//     const existingPackage = await Package.findById(packageId);
//     if (!existingPackage) {
//       return res.status(404).json({ success: false, message: 'Package not found' });
//     }

//     let profileImageUrl = '';
//     if (req.file) {
//       const filePath = path.resolve(req.file.path);
//       const fileBuffer = fs.readFileSync(filePath);

//       const uploadResponse = await imagekit.upload({
//         file: fileBuffer,
//         fileName: req.file.originalname,
//         folder: '/package-orders',
//       });
//       profileImageUrl = uploadResponse.url;
//       fs.unlinkSync(filePath); // Clean up uploaded file
//     }

//     const newOrder = new PackageOrder({
//   package: packageId,
//   place: existingPackage.place, // <-- এই লাইনটি যোগ করা হলো
//   numberOfPersons,
//   pricePerPerson,
//   totalCost,
//   gender,
//   fullName,
//   otherTravelers,
//   phone,
//   email,
//   notes,
//   profileImage: profileImageUrl,
// });



//     const savedOrder = await newOrder.save();

//     // Populate package details for email
//     const orderDetails = await PackageOrder.findById(savedOrder._id).populate('package');

//     // Generate PDF and send emails
//     const html = generateOrderHTML(orderDetails);
//     pdf.create(html).toBuffer(async (err, buffer) => {
//       if (err) {
//         console.error('PDF Generation Error:', err);
//       }
//       if (buffer) {
//         try {
//           await sendBookingConfirmationEmail(email, orderDetails, buffer);
//           await sendAdminBookingNotificationEmail(orderDetails, buffer);
//         } catch (emailError) {
//           console.error('Email Sending Error:', emailError);
//         }
//       }
//     });

//     res.status(201).json({ success: true, message: 'Order created successfully', order: savedOrder });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
//   }
// };

// export const getPackageOrders = async (req, res) => {
//   try {
//     const orders = await PackageOrder.find().populate('package').sort({ createdAt: -1 });
//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to get orders', error: error.message });
//   }
// };

// export const getPackageOrderById = async (req, res) => {
//     try {
//         const order = await PackageOrder.findById(req.params.id).populate('package');
//         if (!order) {
//             return res.status(404).json({ success: false, message: 'Order not found' });
//         }
//         res.status(200).json({ success: true, order });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to get order', error: error.message });
//     }
// };


// export const updatePackageOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const order = await PackageOrder.findById(id).populate('package');
//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     order.status = status;
//     await order.save();

//     const html = generateOrderHTML(order);

//     pdf.create(html).toBuffer(async (err, buffer) => {
//       if (err) {
//         console.error('PDF Generation Error:', err);
//         // We don't return here, just log the error. The main response will be sent below.
//       }

//       if (buffer) {
//         try {
//           await sendOrderStatusUpdateEmail(order.email, order.status, order, buffer);
//         } catch (emailError) {
//           console.error('Email Sending Error:', emailError);
//           // Optional: handle email sending failure, maybe log to a different system
//         }
//       }
//     });

//     res.status(200).json({ success: true, message: 'Order status updated successfully.', order });

//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to update order status.', error: error.message });
//   }
// };

// export const deletePackageOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const order = await PackageOrder.findByIdAndDelete(id);
//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }
//     res.status(200).json({ success: true, message: 'Order deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to delete order', error: error.message });
//   }
// };



import PackageOrder from '../models/PackageOrder.js';
import Package from '../models/packages.js';
import imagekit from '../configs/imageKit.js';
import { sendBookingConfirmationEmail, sendAdminBookingNotificationEmail, sendOrderStatusUpdateEmail } from '../utils/sendBookingEmail.js';
import generateOrderHTML from '../utils/generateOrderPDF.js';
import pdf from 'html-pdf';
import fs from 'fs';
import path from 'path';

export const createPackageOrder = async (req, res) => {
  try {
    const {
      packageId,
      numberOfPersons,
      pricePerPerson,
      totalCost,
      gender,
      fullName,
      age,
      country,
      tourDate,
      otherTravelers,
      phone,
      email,
      notes,
      packageThumbnailBase64,
      pickupAddress,
      clientProblem,
      option1,
      option2,
    } = req.body;

    // Required fields check
    if (!packageId || !fullName || !email || !country) {
      return res.status(400).json({ success: false, message: 'Package ID, Full Name, Country, and Email are required' });
    }

    const existingPackage = await Package.findById(packageId);
    if (!existingPackage) return res.status(404).json({ success: false, message: 'Package not found' });

    let profileImageUrl = '';
    if (req.file) {
      try {
        const uploadResponse = await imagekit.upload({
          file: req.file.buffer,
          fileName: req.file.originalname,
          folder: '/package-orders',
        });
        profileImageUrl = uploadResponse.url;
      } catch (imgError) {
        console.error('Image upload failed, continuing without image:', imgError);
        profileImageUrl = '';
      }
    }

    const newOrder = new PackageOrder({
      package: packageId,
      place: existingPackage.place || '',
      numberOfPersons: Number(numberOfPersons) || 1,
      pricePerPerson: Number(pricePerPerson) || existingPackage.latestPrice || 0,
      totalCost: Number(totalCost) || (Number(pricePerPerson) || existingPackage.latestPrice || 0) * (Number(numberOfPersons) || 1),
      gender: gender || '',
      fullName,
      age: Number(age) || null,
      country,
      tourDate,
      otherTravelers: otherTravelers || '',
      phone: phone || '',
      email,
      notes: notes || '',
      profileImage: profileImageUrl,
      packageThumbnailBase64: packageThumbnailBase64,
      pickupAddress: pickupAddress || '',
      clientProblem: clientProblem || '',
      option1: option1 === 'true',
      option2: option2 === 'true',
    });

    const savedOrder = await newOrder.save();

    const orderDetails = await PackageOrder.findById(savedOrder._id).populate('package');
    
    (async () => {
      try {
        const html = await generateOrderHTML(orderDetails);
        pdf.create(html, { renderDelay: 1000 }).toBuffer(async (err, buffer) => {
          if (err) {
            console.error('PDF Generation Error:', err);
            return;
          }
          if (buffer) {
            try {
              await sendBookingConfirmationEmail(email, orderDetails, buffer);
              await sendAdminBookingNotificationEmail(orderDetails, buffer);
            } catch (emailError) {
              console.error('Email Sending Error:', emailError);
            }
          }
        });
      } catch (e) {
        console.error("Failed to generate PDF or send email", e);
      }
    })();

    res.status(201).json({ success: true, message: 'Order created successfully', order: savedOrder });

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
  }
};

export const getPackageOrders = async (req, res) => {
  try {
    const orders = await PackageOrder.find().select('-profileImage -packageThumbnailBase64').populate('package', 'place').sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get orders', error: error.message });
  }
};

export const getPackageOrderById = async (req, res) => {
  try {
    const order = await PackageOrder.findById(req.params.id).populate('package');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get order', error: error.message });
  }
};

export const updatePackageOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await PackageOrder.findById(id).populate('package');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status || order.status;
    await order.save();

    // Generate PDF and send email asynchronously
    (async () => {
      try {
        const html = await generateOrderHTML(order);
        pdf.create(html, { renderDelay: 1000 }).toBuffer(async (err, buffer) => {
          if (err) {
            console.error('PDF Generation Error:', err);
            return;
          }
          if (buffer) {
            try {
              await sendOrderStatusUpdateEmail(order.email, order.status, order, buffer);
            } catch (emailError) {
              console.error('Email Sending Error:', emailError);
            }
          }
        });
      } catch (e) {
        console.error("Failed to generate PDF or send email for status update", e);
      }
    })();

    res.status(200).json({ success: true, message: 'Order status updated successfully.', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status.', error: error.message });
  }
};

export const deletePackageOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await PackageOrder.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete order', error: error.message });
  }
};
