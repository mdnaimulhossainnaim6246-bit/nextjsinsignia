

// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { sendOTPEmail } from "../utils/sendOTPEmail.js";
// import Tour from "../models/tour.js";
// import Discover from "../models/discover.js";
// import BookingPlace from "../models/bookingPlace.js"; 
// import Packages from "../models/packages.js";

// dotenv.config();

// const allowedEmails = [
//   "mdnaimulhossainnaim6246@gmail.com",
//   "naimhossain7155@gmail.com",
//   "tours.insignia@gmail.com"
// ];

// const otpStore = new Map(); // key = email, value = { otp, expires }

// export const sendOtp = async (req, res) => {
//   const { email } = req.body;

//   if (!allowedEmails.includes(email)) {
//     return res.status(401).json({ message: "Unauthorized email address" });
//   }

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expires = Date.now() + 5 * 60 * 1000;

//   otpStore.set(email, { otp, expires });

//   try {
//     await sendOTPEmail(email, otp);
//     return res.status(200).json({ message: "OTP sent successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: "Failed to send OTP" });
//   }
// };

// export const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   const record = otpStore.get(email);

//   if (!record || record.otp !== otp || Date.now() > record.expires) {
//     return res.status(400).json({ message: "Invalid or expired OTP" });
//   }

//   const token = jwt.sign({ email }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });

//   return res.status(200).json({ token });
// };

// export const getAllToursAdmin = async (req, res) => {
//   try {
//     const tours = await Tour.find({}).sort({ createdAt: -1 });
//     res.json({ success: true, tours });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const getAllDiscoversAdmin = async (req, res) => {
//   try {
//     const discovers = await Discover.find({}).sort({ createdAt: -1 });
//     res.json({ success: true, discovers });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const getAllPackagesAdmin = async (req, res) => {
//   try {
//     const discovers = await Packages.find({}).sort({ createdAt: -1 });
//     res.json({ success: true, discovers });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const getTourlist = async (req, res) => {
//   try {
//     const recentTours = await Tour.find({}).sort({ createdAt: -1 });
//     const tours = await Tour.countDocuments();
//     const drafts = await Tour.countDocuments({ isPublished: false });

//     const TourData = {
//       tours,
//       drafts,
//       recentTours,
//     };
//     res.json({ success: true, TourData });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const getDiscoverlist = async (req, res) => {
//   try {
//     const recentDiscovers = await Discover.find({}).sort({ createdAt: -1 });
//     const discovers = await Discover.countDocuments();
//     const drafts = await Discover.countDocuments({ isPublished: false });

//     const DiscoverData = {
//       discovers,
//       drafts,
//       recentDiscovers,
//     };
//     res.json({ success: true, DiscoverData });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const getPackageslist = async (req, res) => {
//   try {
//     const recentPackages = await Packages.find({}).sort({ createdAt: -1 });
//     const discovers = await Packages.countDocuments();
//     const drafts = await Packages.countDocuments({ isPublished: false });

//     const PackagesData = {
//       discovers,
//       drafts,
//       recentPackages,
//     };
//     res.json({ success: true, PackagesData });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // --- নতুন ফাংশন --- //
// export const getBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const booking = await BookingPlace.findById(id);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     res.json(booking);
//   } catch (error) {
//     console.error("Error fetching booking:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendOTPEmail } from "../utils/sendOTPEmail.js";
import Tour from "../models/tour.js";
import Discover from "../models/discover.js";
// import BookingPlace from "../models/bookingPlace.js"; 
import Packages from "../models/packages.js";

dotenv.config();

const allowedEmails = [
  "mdnaimulhossainnaim6246@gmail.com",
  "naimhossain7155@gmail.com",
  "tours.insignia@gmail.com"
];

const otpStore = new Map(); // key = email, value = { otp, expires }

export const sendOtp = async (req, res) => {
  console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
  console.log("ADMIN_EMAIL_PASS:", process.env.ADMIN_EMAIL_PASS);
  const { email } = req.body;

  if (!allowedEmails.includes(email)) {
    return res.status(401).json({ message: "Unauthorized email address" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000;

  otpStore.set(email, { otp, expires });

  try {
    await sendOTPEmail(email, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore.get(email);

  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.status(200).json({ token });
};

export const getAllToursAdmin = async (req, res) => {
  try {
    const tours = await Tour.find({}).sort({ createdAt: -1 });
    res.json({ success: true, tours });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllDiscoversAdmin = async (req, res) => {
  try {
    const discovers = await Discover.find({}).sort({ createdAt: -1 });
    res.json({ success: true, discovers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllPackagesAdmin = async (req, res) => {
  try {
    const discovers = await Packages.find({}).sort({ createdAt: -1 });
    res.json({ success: true, discovers });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getTourlist = async (req, res) => {
  try {
    const recentTours = await Tour.find({}).sort({ createdAt: -1 });
    const tours = await Tour.countDocuments();
    const drafts = await Tour.countDocuments({ isPublished: false });

    const TourData = {
      tours,
      drafts,
      recentTours,
    };
    res.json({ success: true, TourData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getDiscoverlist = async (req, res) => {
  try {
    const recentDiscovers = await Discover.find({}).sort({ createdAt: -1 });
    const discovers = await Discover.countDocuments();
    const drafts = await Discover.countDocuments({ isPublished: false });

    const DiscoverData = {
      discovers,
      drafts,
      recentDiscovers,
    };
    res.json({ success: true, DiscoverData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPackageslist = async (req, res) => {
  try {
    const recentPackages = await Packages.find({}).sort({ createdAt: -1 });
    const discovers = await Packages.countDocuments();
    const drafts = await Packages.countDocuments({ isPublished: false });

    const PackagesData = {
      discovers,
      drafts,
      recentPackages,
    };
    res.json({ success: true, PackagesData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// --- নতুন ফাংশন --- //
// export const getBookingById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const booking = await BookingPlace.findById(id);
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }
//     res.json(booking);
//   } catch (error) {
//     console.error("Error fetching booking:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
