// // server/routes/adminRoutes.js
// import express from "express";
// import { getAllToursAdmin,getAllDiscoversAdmin, getTourlist, getDiscoverlist, sendOtp, verifyOtp } from "../controllers/adminController.js";
// import auth from "../middleware/auth.js";

// const router = express.Router();

// router.post("/send-otp", sendOtp);
// router.post("/verify-otp", verifyOtp);
// router.get("/tours", auth, getAllToursAdmin);
// router.get("/discovers", auth, getAllDiscoversAdmin);
// router.get("/tourdata", auth, getTourlist);
// router.get("/discoverdata", auth, getDiscoverlist);

// export default router;

import express from "express";
import {
  getAllToursAdmin,
  getAllDiscoversAdmin,
  getTourlist,
  getDiscoverlist,
  sendOtp,
  verifyOtp,
  // getBookingById, 
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/tours", auth, getAllToursAdmin);
router.get("/discovers", auth, getAllDiscoversAdmin);
router.get("/tourdata", auth, getTourlist);
router.get("/discoverdata", auth, getDiscoverlist);


// router.get("/addbooking/:id", auth, getBookingById);

export default router;
