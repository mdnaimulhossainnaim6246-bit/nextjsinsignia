// src/component/addmin/Sidebar.jsx 


import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef();

  const isMobile = window.innerWidth < 768;

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        isMobile &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile]);

  return (

    
    

    <div
      ref={sidebarRef}
      className={`admin-panel-sidebar sidebar-wrapper ${isOpen ? 'open' : ''}`}
    >
      {isMobile && (
        <div className='sidebar-toggle-button-div'><button className="sidebar-toggle-button" onClick={toggleSidebar}>
          {isOpen ? '⇨' : '⇨'}
        </button> </div>
      )}

      {/* home sectiom  */}
      <div className="sidebar-section">
        <div className="sidebar-header sidebar-header-for-arrow">Home</div>
        <NavLink
          end={true}
          to="/admin"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.home_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Dashboard</p>
        </NavLink>

        <NavLink
          end={true}
          to="/admin/AddTheme"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.home_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Theme</p>
        </NavLink>


        <NavLink
          to="/admin/popups"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Popup</p>
        </NavLink>

      </div>

      {/* Tour Section */}
      {/* <div className="sidebar-section">
        <div className="sidebar-header">Tour</div>
       

        <NavLink
          to="/admin/Addtour"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Add Tour</p>
        </NavLink>

        <NavLink
          to="/admin/Listtour"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Tour List</p>
        </NavLink>
      </div> */}

      {/* booking Section */}
      {/* <div className="sidebar-section">
        <div className="sidebar-header">Booking place</div>
       

        <NavLink
          to="/admin/AddBookingPlace"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Add Booking Place</p>
        </NavLink>

        <NavLink
          to="/admin/ListBookingPlace"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Booking Place List</p>
        </NavLink>
        <NavLink
          to="/admin/TransportHotelFeeAdmin"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Fee</p>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Cart Orders</p>
        </NavLink>

        <NavLink
          to="/admin/package-orders"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Package Orders</p>
        </NavLink>
      </div> */}

      {/* Discover Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">Destination</div>
        <NavLink
          to="/admin/Adddiscover"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Add Destination</p>
        </NavLink>
        <NavLink
          to="/admin/ListDiscover"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">List Destination</p>
        </NavLink>
        <NavLink
          to="/admin/Listtour"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Category List</p>
        </NavLink>
      </div>

      {/* package Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">Package</div>
        <NavLink
          to="/admin/Addpackages"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Add Packages</p>
        </NavLink>
        <NavLink
          to="/admin/Listpackages"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">List Packages</p>
        </NavLink>
        <NavLink
          to="/admin/package-orders"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Package Orders</p>
        </NavLink>
      </div>

      {/* AddGroupTour Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">GroupTour</div>
        <NavLink
          to="/admin/AddGroupTour"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">AddGroupTour</p>
        </NavLink>

        <NavLink
          to="/admin/ListGroupTour"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">List GroupTour</p>
        </NavLink>
      </div>

      {/* Blog Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">Blog</div>
        <NavLink
          to="/admin/AddBlog"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Add Blog</p>
        </NavLink>
        <NavLink
          to="/admin/Listblog"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">List Blog</p>
        </NavLink>
      </div>

      {/* Travelguide Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">Guide</div>
        <NavLink
          to="/admin/AddTravelguide"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Add Guide</p>
        </NavLink>
        <NavLink
          to="/admin/ListTravelguide"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">List Guide</p>
        </NavLink>
      </div>

      {/* ourtravelers Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">Review</div>
        <NavLink
          to="/admin/addourtravelers"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">About Traveler</p>
        </NavLink>
        <NavLink
          to="/admin/listourtravelers"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">List Traveler</p>
        </NavLink>
      </div>

      {/* Review Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">Review</div>
        <NavLink
          to="/admin/AddReview"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">Add Review</p>
        </NavLink>
        <NavLink
          to="/admin/ListReview"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.list_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">List Review</p>
        </NavLink>
      </div>

      {/* About Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">About</div>
        <NavLink
          to="/admin/AddAboutnumber"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">About number</p>
        </NavLink>

        
      </div>
      
      {/* Faqs Section */}
      <div className="sidebar-section">
        <div className="sidebar-header">Footer</div>
        <NavLink
          to="/admin/FAQS"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
          }
        >
          <img src={assets.add_icon} className="sidebar-icon" alt="" />
          <p className="sidebar-label">FAQS</p>
        </NavLink>
      </div>


      
    </div>

   
  );
};

export default Sidebar;