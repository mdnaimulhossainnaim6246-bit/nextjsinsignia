import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import 'flag-icon-css/css/flag-icons.min.css';

import Nav from "./pages/Nav";
import Home from "./pages/Home"
// import Tourdetails from "./pages/Tourdetails";
import OurTravelersdetails from "./pages/OurTravelersdetails";                                                               
import BlogDetails from "./pages/BlogDetails";
import Discoverplace from "./pages/Discoverplace";
import CategoryPackages from "./pages/CategoryPackages";
// import AllPackages from "./pages/AllPackages";

import Discover from "./components/Discover";
import OurTravelers from "./pages/OurTravelers";
import Bloginner from "./components/Bloginner";

import Layout from "./pages/admin/Layout";
// import Dashboard from "./pages/admin/Dashboard";
import Dashboard from "./pages/admin/Dashboard.jsx";


import Addtour from "./pages/admin/Addtour";

import AddGroupTour from "./pages/admin/AddGroupTour";
import ListGroupTour from "./pages/admin/ListGroupTour";

import AddOurTravelers from "./pages/admin/AddOurTravelers"; 
import Adddiscover from "./pages/admin/Adddiscover";
// import AddBookingPlace from "./pages/admin/AddBookingPlace";
import Addpackages from "./pages/admin/Addpackages";
import Addaboutnumber from "./pages/admin/Addaboutnumber";
import AdminTheme from "./pages/admin/AdminTheme"
import AddReview from "./pages/admin/AddReview";
import ListReview from "./pages/admin/ListReview";

import Listtour from "./pages/admin/Listtour";
import ListOurTravelers from "./pages/admin/ListOurTravelers";
import Listdiscover from "./pages/admin/Listdiscover";
// import ListBookingPlace from "./pages/admin/ListBookingPlace";
// import ListOrders from "./pages/admin/ListOrders";
import ListPackageOrders from "./pages/admin/ListPackageOrders";
import PackageOrderDetails from "./pages/admin/PackageOrderDetails";
// import CartOrderDetails from "./pages/admin/CartOrderDetails";
import Listpackages from "./pages/admin/Listpackages";
// import ListCartBooking from "./pages/admin/ListCartBooking";
import AddBlog from "./pages/admin/AddBlog";
import ListBlog from "./pages/admin/ListBlog";
// import ListCartOrders from "./pages/admin/ListCartOrders";

// import TransportHotelFeeAdmin from "./pages/admin/TransportHotelFeeAdmin"; 
// import Cart from './pages/Cart'; 


import Login from "./components/addmin/Login";
import AdminPopup from "./components/addmin/AdminPopup";

import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import Packagedetails from "./pages/Packagedetails";
import Booking from "./pages/Booking";
import About from './components/About';
import Packagesfilter from './components/Packagesfilter'
// import BookingPlaceDetails from "./pages/BookingPlaceDetails";
import Contact from "./pages/Contact";
import GroupTour from "./pages/GroupTour";
import OurTravelersLanding from "./pages/OurTravelersLanding";
import FooterFAQS from "./pages/admin/FooterFAQS";
import FAQS from "./pages/FAQS";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReviewsPage from "./pages/ReviewsPage";
import ReviewDetails from "./pages/ReviewDetails";
import Guideinner from "./components/Guideinner";
import GuideDetails from "./pages/GuideDetails";
import AddTravelguide from "./pages/admin/AddTravelguide";
import ListTravelguide from "./pages/admin/ListTravelguide";


const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        containerStyle={{ top: 63 }}
        toastOptions={{
          className: 'custom-toast',
          duration: 6000,
        }}
      />

      <Routes>
        <Route path="/" element={<Nav />} />
        <Route path="/Home"element={<Home/>}/>

        {/* <Route path="/Tourdetails/:placename" element={<Tourdetails />} /> */}
        <Route path="/ourtravelers-details/:id" element={<OurTravelersdetails />} />                                         
        {/* <Route path="/Discoverplace/:id" element={<Discoverplace />} /> */}
        <Route path="/all-place-list" element={<Discover />} />
        <Route path="/OurTravelers" element={<OurTravelers />} />
        <Route path="/discoverplace/:placename" element={<Discoverplace />} />
        <Route path="/tour-packages-details/:placename" element={<Packagedetails />} />
        <Route path="/booking/:placename" element={<Booking />} />
        <Route path="/packages/:categoryName" element={<CategoryPackages />} />
        <Route path="/tour-packages-list" element={<Packagesfilter />} />
        <Route path="/Blog" element={<Bloginner />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/cart" element={<Cart />} /> */}
        {/* <Route path="/booking-place/:id" element={<BookingPlaceDetails />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/grouptour" element={<GroupTour />} />
        <Route path="/our-travelers" element={<OurTravelersLanding />} />
        <Route path="/faqs" element={<FAQS />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/review/:travelerSlug" element={<ReviewDetails />} />
        <Route path="/travel-guides" element={<Guideinner />} />
        <Route path="/travel-guide/:title" element={<GuideDetails />} />
        

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="addTheme" element={<AdminTheme />} />

          <Route path="Addtour" element={<Addtour />} />
          <Route path="Listtour" element={<Listtour />} />

          <Route path="addourtravelers" element={<AddOurTravelers />} />                                                     
          <Route path="listourtravelers" element={<ListOurTravelers />} /> 

          <Route path="Adddiscover" element={<Adddiscover />} />
          <Route path="Listdiscover" element={<Listdiscover />} />

          {/* <Route path="Addbookingplace" element={<AddBookingPlace />} /> */}
          {/* <Route path="Listbookingplace" element={<ListBookingPlace />} /> */}

          <Route path="Addpackages" element={<Addpackages />} />
          <Route path="Listpackages" element={<Listpackages />} />

          <Route path="Addblog" element={<AddBlog />} />
          <Route path="Listblog" element={<ListBlog />} />
          
          <Route path="AddTravelguide" element={<AddTravelguide />} />
          <Route path="ListTravelguide" element={<ListTravelguide />} />

          <Route path="Addreview" element={<AddReview />} />
          <Route path="Listreview" element={<ListReview />} />

          <Route path="AddGroupTour" element={<AddGroupTour />} />
          <Route path="ListGroupTour" element={<ListGroupTour />} />

          <Route path="Addaboutnumber" element={<Addaboutnumber />} />

          {/* <Route path="TransportHotelFeeAdmin" element={<TransportHotelFeeAdmin />} /> */}
          {/* <Route path="orders" element={<ListOrders />} /> */}
          <Route path="package-orders" element={<ListPackageOrders />} />
          <Route path="package-order/:id" element={<PackageOrderDetails />} />
          {/* <Route path="cart-orders" element={<ListCartOrders />} /> */}
          {/* <Route path="cart-order/:id" element={<CartOrderDetails />} /> */}
          {/* <Route path="cart-bookings" element={<ListCartBooking />} /> */}
          <Route path="popups" element={<AdminPopup />} />
          <Route path="FAQS" element={<FooterFAQS />} />
          

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;