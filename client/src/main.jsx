


// import { createRoot } from 'react-dom/client'
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'
// import { AppProvider } from './context/AppContext';

// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//    <AppProvider>
//      <App />
//    </AppProvider>
    
//   </BrowserRouter>,
// )


import { createRoot } from 'react-dom/client';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { HelmetProvider } from 'react-helmet-async';  // ✅ add this

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <HelmetProvider>  {/* ✅ wrap App with HelmetProvider */}
        <App />
      </HelmetProvider>
    </AppProvider>
  </BrowserRouter>,
);
