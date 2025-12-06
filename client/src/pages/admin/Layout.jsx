// src/pages/admin/Layout.jsx

import React from 'react';
import { assets } from '../../assets/assets';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/addmin/Sidebar';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
  const navigate = useNavigate();
  const { setToken, axios } = useAppContext();

  const logout = () => {
    localStorage.removeItem('token');      
    setToken(null);                         
    delete axios.defaults.headers.common['Authorization'];  
    navigate('/login');                     
  };

  return (
    <>
      <div style={{cursor: 'pointer'}} onClick={() => window.open('/', '_blank', 'noopener,noreferrer')} className='admin-panel-nav-header'>

      <div style={{display:'flex',alignItems:'center'}}>
        <img
        className="admin-panel-logo"

  // src={assets.logo}
  src="/assets/Insignia-Logo-2nd.png"
  alt="logo"
  
  
  style={{ width:'120px',marginRight:"7px" }}
/>
 <img style={{width:'100%',height:'42px',marginTop:'5px'}} src="\assets\textlogo3..png" alt="logo" />
</div>
        <button onClick={logout} className='logout-button'>
          Logout <img className='logo-button-arrow' src={assets.arrow} alt='arrow' />
        </button>
      </div>

      <div className='main-content-area' style={{ display: 'flex' }}>
        <Sidebar />
        <div className='admin-main-content'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
