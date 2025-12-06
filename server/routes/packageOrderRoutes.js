// // server/routes/packageOrderRoutes.js

// import express from 'express';
// import { 
//   createPackageOrder, 
//   getPackageOrders, 
//   updatePackageOrderStatus, 
//   deletePackageOrder,
//   getPackageOrderById   // <-- added this import
// } from '../controllers/packageOrderController.js';
// import auth from '../middleware/auth.js';
// import upload from '../middleware/multer.js';

// const router = express.Router();

// // Create a new package order
// router.post('/', upload.single('profileImage'), createPackageOrder);

// // Get all package orders (protected)
// router.get('/', auth, getPackageOrders);

// // Get a single package order by ID (protected)
// router.get('/:id', auth, getPackageOrderById);

// // Update order status (protected)
// router.put('/:id/status', auth, updatePackageOrderStatus);

// // Delete an order (protected)
// router.delete('/:id', auth, deletePackageOrder);

// export default router;


import express from 'express';
import { 
  createPackageOrder, 
  getPackageOrders, 
  updatePackageOrderStatus, 
  deletePackageOrder,
  getPackageOrderById
} from '../controllers/packageOrderController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post('/', upload.single('profileImage'), createPackageOrder);
router.get('/', auth, getPackageOrders);
router.get('/:id', auth, getPackageOrderById);
router.put('/:id/status', auth, updatePackageOrderStatus);
router.delete('/:id', auth, deletePackageOrder);

export default router;
