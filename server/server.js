
// // server.js

// import express from 'express';
// import 'dotenv/config';
// import cors from 'cors';
// import connectDB from './configs/db.js';
// // import feeRoutes from './routes/feeRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import tourRouter from "./routes/tourRoutes.js";
// import discoverRouter from './routes/discoverRoutes.js';
// // import bookingPlaceRouter from './routes/bookingPlaceRouter.js';
// // import placesRoutes from './routes/placesRoutes.js';
// // import orderRoutes from './routes/orderRoutes.js';
// import packageOrderRoutes from './routes/packageOrderRoutes.js';
// // import cartOrderRoutes from './routes/cartOrderRoutes.js';
// import packagesRouter from './routes/PackagesRoutes.js';
// import contactRoutes from './routes/contactRoutes.js';
// import popupRouter from './routes/popupRouter.js';
// import blogRouter from './routes/blogRouter.js';
// import groupTourRouter from './routes/groupTourRoutes.js';
// import aboutNumberRoutes from './routes/aboutnumberRoutes.js';
// import ourTravelersRoutes from './routes/ourTravelersRoutes.js';
// import yearRoutes from './routes/yearRoutes.js';
// import themeRoutes from './routes/themeRoutes.js';
// import reviewRoutes from './routes/reviewRoutes.js';
// import guideRoutes from './routes/guideRoutes.js';

// const app = express();

// const startServer = async () => {
//   try {
//     // ডাটাবেজ কানেক্ট
//     await connectDB();

//     // Middleware
//     app.use(cors());
//     app.use(express.json());

//     // হেলথ চেক রুট
//     app.get('/', (req, res) => res.send('API is running'));

//     // Admin রুটস
//     app.use('/admin', adminRoutes);
//     // app.use('/admin', feeRoutes);

//     // Content Management রুটস
//     app.use('/addtour', tourRouter);
//     app.use('/adddiscover', discoverRouter);
//     app.use('/addpackages', packagesRouter);
//     // app.use('/addbooking', bookingPlaceRouter);
//     app.use('/addpopup', popupRouter);
//     app.use('/addblog', blogRouter);
//     app.use('/addguide', guideRoutes);
//     app.use('/addgrouptour', groupTourRouter);
//     app.use('/addreview', reviewRoutes);
//     app.use('/api', aboutNumberRoutes);
//     app.use('/addourtravelers', ourTravelersRoutes);
//     app.use('/api', themeRoutes);
    

//     // Places & Orders API
//     // app.use('/api/places', placesRoutes);
//     // app.use('/api/orders', orderRoutes);
//     app.use('/api/package-orders', packageOrderRoutes);
//     // app.use('/api/cart-orders', cartOrderRoutes);
//     app.use('/api/contact', contactRoutes);
//     app.use('/api/years', yearRoutes);

    

//     // সার্ভার চালু
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error('❌ Error starting server:', err.message);
//     process.exit(1);
//   }
// };

// startServer();

// export default app;



// server.js

import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './configs/db.js';
// import feeRoutes from './routes/feeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import tourRouter from "./routes/tourRoutes.js";
import discoverRouter from './routes/discoverRoutes.js';
// import bookingPlaceRouter from './routes/bookingPlaceRouter.js';
// import placesRoutes from './routes/placesRoutes.js';
// import orderRoutes from './routes/orderRoutes.js';
import packageOrderRoutes from './routes/packageOrderRoutes.js';
// import cartOrderRoutes from './routes/cartOrderRoutes.js';
import packagesRouter from './routes/PackagesRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import popupRouter from './routes/popupRouter.js';
import blogRouter from './routes/blogRouter.js';
import groupTourRouter from './routes/groupTourRoutes.js';
import aboutNumberRoutes from './routes/aboutnumberRoutes.js';
import ourTravelersRoutes from './routes/ourTravelersRoutes.js';
import yearRoutes from './routes/yearRoutes.js';
import themeRoutes from './routes/themeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import guideRoutes from './routes/guideRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const startServer = async () => {
  try {
    // ডাটাবেজ কানেক্ট
    await connectDB();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // হেলথ চেক রুট
    app.get('/', (req, res) => res.send('API is running'));

    // Admin রুটস
    app.use('/admin', adminRoutes);
    // app.use('/admin', feeRoutes);

    // Content Management রুটস
    app.use('/addtour', tourRouter);
    app.use('/adddiscover', discoverRouter);
    app.use('/addpackages', packagesRouter);
    // app.use('/addbooking', bookingPlaceRouter);
    app.use('/addpopup', popupRouter);
    app.use('/addblog', blogRouter);
    app.use('/addguide', guideRoutes);
    app.use('/addgrouptour', groupTourRouter);
    app.use('/addreview', reviewRoutes);
    app.use('/api', aboutNumberRoutes);
    app.use('/addourtravelers', ourTravelersRoutes);
    app.use('/api', themeRoutes);
    

    // Places & Orders API
    // app.use('/api/places', placesRoutes);
    // app.use('/api/orders', orderRoutes);
    app.use('/api/package-orders', packageOrderRoutes);
    // app.use('/api/cart-orders', cartOrderRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/years', yearRoutes);

    // Serve static files from the React app
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });

    // সার্ভার চালু
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error starting server:', err.message);
    process.exit(1);
  }
};

startServer();

export default app;


