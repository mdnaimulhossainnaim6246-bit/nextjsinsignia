
// // src/context/AppContext.jsx
// import { createContext, useContext, useEffect, useState, useRef } from "react";
// import axios from "../utils/api";
// import toast from "react-hot-toast";

// const AppContext = createContext();


// // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// export const AppProvider = ({ children }) => {
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [tours, setTours] = useState([]);
//   const [discovers, setDiscovers] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [cart, setCart] = useState([]); // Cart state
//   const [cartHydrated, setCartHydrated] = useState(false);

//   const logoutTimerRef = useRef(null);

//   // Session duration in milliseconds (5 hours)
//   const SESSION_DURATION = 5 * 60 * 60 * 1000;

//   // Sync cart to localStorage with a 2-day expiry
//   useEffect(() => {
//     if (!cartHydrated) return;
//     const now = new Date();
//     const cartData = {
//       items: cart.map((item) => ({ _id: item._id })),
//       expiry: now.getTime() + 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
//     };
//     localStorage.setItem("bookingCart", JSON.stringify(cartData));
//   }, [cart, cartHydrated]);

//   const addToCart = async (item) => {
//     try {
//       const res = await axios.get(`/addbooking/${item._id}`);
//       const fullItem = {
//         ...res.data.bookingPlace,
//         coordinates: {
//           lat: res.data.bookingPlace.lat,
//           lng: res.data.bookingPlace.lng,
//         },
//       };

//       setCart((prevCart) => {
//         const isAdded = prevCart.find(
//           (cartItem) => cartItem._id === fullItem._id
//         );
//         if (isAdded) {
//           toast.error("Already in cart!");
//           return prevCart;
//         }
//         toast.success("Added to cart!");
//         return [...prevCart, fullItem];
//       });
//     } catch (error) {
//       toast.error("Failed to fetch full item info.");
//     }
//   };

//   const removeFromCart = (itemId) => {
//     setCart((prevCart) => {
//       const updatedCart = prevCart.filter((item) => item._id !== itemId);
//       toast.success("Removed from cart!");
//       return updatedCart;
//     });
//   };

  

//   const setAxiosAuthToken = (token) => {
//     if (token) {
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common["Authorization"];
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setToken(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("loginStartTime");
//     delete axios.defaults.headers.common["Authorization"];
//     toast("Session expired. Logged out.", { icon: "🔒" });
//     window.location.href = "/admin/login";
//   };

//   // Start or reset session timer
//   const startSessionTimer = () => {
//     if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

//     const loginStartTime = localStorage.getItem("loginStartTime");
//     if (!loginStartTime) return;

//     const elapsed = Date.now() - parseInt(loginStartTime, 10);
//     const remaining = SESSION_DURATION - elapsed;

//     if (remaining <= 0) {
//       logout();
//       return;
//     }

//     logoutTimerRef.current = setTimeout(logout, remaining);
//   };

//   // Update token & session
//   const updateToken = (newToken) => {
//     setToken(newToken);
//     setAxiosAuthToken(newToken);

//     if (newToken) {
//       if (!localStorage.getItem("loginStartTime")) {
//         localStorage.setItem("loginStartTime", Date.now().toString());
//       }
//       startSessionTimer();
//     } else {
//       if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
//       localStorage.removeItem("loginStartTime");
//     }
//   };

//   // Fetch published tours
//   const fetchTours = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get("/addtour/all");
//       // const { data } = await axios.get(`${BACKEND_URL}/addtour/all`);
//       if (data.success) {
//         const publishedTours = data.tour.filter((t) => t.isPublished);
//         setTours(publishedTours);
//       } else {
//         toast.error(data.message || "Failed to fetch tours");
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to fetch tours");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch published discovers
//   const fetchDiscovers = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get("/adddiscover/all");
//       // const { data } = await axios.get(`${BACKEND_URL}/adddiscover/all`);
//       if (data.success) {
//         const publishedDiscovers = data.discover.filter((t) => t.isPublished);
//         setDiscovers(publishedDiscovers);
//       } else {
//         toast.error(data.message || "Failed to fetch discovers");
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || "Failed to fetch discovers"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch published packages
//   const fetchPackages = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get("/addpackages/all");
//       // const { data } = await axios.get(`${BACKEND_URL}/addpackages/all`);
//       if (data.success) {
//         const publishedPackages = data.packages.filter((p) => p.isPublished);
//         setPackages(publishedPackages);
//       } else {
//         toast.error(data.message || "Failed to fetch packages");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch published blogs
//   const fetchBlogs = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get("/addblog/all");
//       if (data.success) {
//         const publishedBlogs = data.blogs.filter((b) => b.isPublished);
//         setBlogs(publishedBlogs);
//       } else {
//         toast.error(data.message || "Failed to fetch blogs");
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || "Failed to fetch blogs"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // On mount: load token, cart, setup timer, and fetch data
//   useEffect(() => {
//     const localToken = localStorage.getItem("token");
//     if (localToken) {
//       setToken(localToken);
//       setAxiosAuthToken(localToken);
//       startSessionTimer();
//     }

//     const savedCartDataString = localStorage.getItem("bookingCart");
//     if (savedCartDataString) {
//       const savedCartData = JSON.parse(savedCartDataString);
//       if (savedCartData && new Date().getTime() < savedCartData.expiry) {
//         const savedCartIds = savedCartData.items || [];
//         if (savedCartIds.length > 0) {
//           const fetchAndSetCart = async () => {
//             try {
//               const promises = savedCartIds.map((item) =>
//                 axios
//                   .get(`/addbooking/${item._id}`)
//                   .then(
//                     (res) => ({
//                       status: "fulfilled",
//                       data: res.data.bookingPlace,
//                     }),
//                     () => ({ status: "rejected" })
//                   )
//               );

//               const results = await Promise.all(promises);
//               const validItems = results
//                 .filter((res) => res.status === "fulfilled" && res.data)
//                 .map((res) => res.data);

//               if (validItems.length !== savedCartIds.length) {
//                 toast("Some cart items were removed/unpublished", { icon: "⚠️" });
//               }

//               const formattedData = validItems.map((item) => ({
//                 ...item,
//                 coordinates: {
//                   lat: item.lat,
//                   lng: item.lng,
//                 },
//               }));

//               setCart(formattedData);
//             } catch (err) {
//               toast.error("Failed to hydrate cart");
//               setCart([]);
//             } finally {
//               setCartHydrated(true);
//             }
//           };
//           fetchAndSetCart();
//         } else {
//           setCartHydrated(true);
//         }
//       } else {
//         localStorage.removeItem("bookingCart");
//         setCartHydrated(true);
//       }
//     } else {
//       setCartHydrated(true);
//     }

//     fetchTours();
//     fetchDiscovers();
//     fetchPackages();
//     fetchBlogs();

//     return () => {
//       if (logoutTimerRef.current) {
//         clearTimeout(logoutTimerRef.current);
//       }
//     };
//   }, []);

//   // Keep axios header updated with token
//   useEffect(() => {
//     setAxiosAuthToken(token);
//   }, [token]);

//   const value = {
//     axios,
//     token,
//     setToken: updateToken,
//     loading,
//     tours,
//     discovers,
//     packages,
//     blogs,
//     setTours,
//     setDiscovers,
//     setPackages,
//     fetchTours,
//     fetchDiscovers,
//     fetchPackages,
//     fetchBlogs,
//     logout,
//     cart,
//     addToCart,
//     removeFromCart,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => useContext(AppContext);



// src/context/AppContext.jsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import axios from "../utils/api";
import toast from "react-hot-toast";

const AppContext = createContext();


// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [discovers, setDiscovers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [ourTravelers, setOurTravelers] = useState([]);
  // const [cart, setCart] = useState([]); 
  // const [cartHydrated, setCartHydrated] = useState(false);

  const logoutTimerRef = useRef(null);

  // Session duration in milliseconds (5 hours)
  const SESSION_DURATION = 5 * 60 * 60 * 1000;

  // Sync cart to localStorage with a 2-day expiry
  // useEffect(() => {
  //   if (!cartHydrated) return;
  //   const now = new Date();
  //   const cartData = {
  //     items: cart.map((item) => ({ _id: item._id })),
  //     expiry: now.getTime() + 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
  //   };
  //   localStorage.setItem("bookingCart", JSON.stringify(cartData));
  // }, [cart, cartHydrated]);

  // const addToCart = async (item) => {
  //   try {
  //     const res = await axios.get(`/addbooking/${item._id}`);
  //     const fullItem = {
  //       ...res.data.bookingPlace,
  //       coordinates: {
  //         lat: res.data.bookingPlace.lat,
  //         lng: res.data.bookingPlace.lng,
  //       },
  //     };

  //     setCart((prevCart) => {
  //       const isAdded = prevCart.find(
  //         (cartItem) => cartItem._id === fullItem._id
  //       );
  //       if (isAdded) {
  //         toast.error("Already in cart!");
  //         return prevCart;
  //       }
  //       toast.success("Added to cart!");
  //       return [...prevCart, fullItem];
  //     });
  //   } catch (error) {
  //     toast.error("Failed to fetch full item info.");
  //   }
  // };

  // const removeFromCart = (itemId) => {
  //   setCart((prevCart) => {
  //     const updatedCart = prevCart.filter((item) => item._id !== itemId);
  //     toast.success("Removed from cart!");
  //     return updatedCart;
  //   });
  // };

  

  const setAxiosAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("loginStartTime");
    delete axios.defaults.headers.common["Authorization"];
    toast("Session expired. Logged out.", { icon: "🔒" });
    window.location.href = "/admin/login";
  };

  // Start or reset session timer
  const startSessionTimer = () => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);

    const loginStartTime = localStorage.getItem("loginStartTime");
    if (!loginStartTime) return;

    const elapsed = Date.now() - parseInt(loginStartTime, 10);
    const remaining = SESSION_DURATION - elapsed;

    if (remaining <= 0) {
      logout();
      return;
    }

    logoutTimerRef.current = setTimeout(logout, remaining);
  };

  // Update token & session
  const updateToken = (newToken) => {
    setToken(newToken);
    setAxiosAuthToken(newToken);

    if (newToken) {
      if (!localStorage.getItem("loginStartTime")) {
        localStorage.setItem("loginStartTime", Date.now().toString());
      }
      startSessionTimer();
    } else {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      localStorage.removeItem("loginStartTime");
    }
  };

  // Fetch published tours
  const fetchTours = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/addtour/all");
      // const { data } = await axios.get(`${BACKEND_URL}/addtour/all`);
      if (data.success) {
        const publishedTours = data.tour.filter((t) => t.isPublished);
        setTours(publishedTours);
      } else {
        toast.error(data.message || "Failed to fetch tours");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch tours");
    } finally {
      setLoading(false);
    }
  };

  // Fetch published discovers
  const fetchDiscovers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/adddiscover/all");
      // const { data } = await axios.get(`${BACKEND_URL}/adddiscover/all`);
      if (data.success) {
        const publishedDiscovers = data.discover.filter((t) => t.isPublished);
        setDiscovers(publishedDiscovers);
      } else {
        toast.error(data.message || "Failed to fetch discovers");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch discovers"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch published packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/addpackages/all");
      // const { data } = await axios.get(`${BACKEND_URL}/addpackages/all`);
      if (data.success) {
        const publishedPackages = data.packages.filter((p) => p.isPublished);
        setPackages(publishedPackages);
      } else {
        toast.error(data.message || "Failed to fetch packages");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch published blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/addblog/all");
      if (data.success) {
        const publishedBlogs = data.blogs.filter((b) => b.isPublished);
        setBlogs(publishedBlogs);
      } else {
        toast.error(data.message || "Failed to fetch blogs");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch blogs"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch published about members
  const fetchOurTravelers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/addourtravelers/all");
      if (data.success) {
        const publishedOurTravelers = data.ourTraveler.filter((m) => m.isPublished);
        setOurTravelers(publishedOurTravelers);
      } else {
        toast.error(data.message || "Failed to fetch about members");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch about members");
    } finally {
      setLoading(false);
    }
  };

  // On mount: load token, cart, setup timer, and fetch data
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
      setAxiosAuthToken(localToken);
      startSessionTimer();
    }

    // const savedCartDataString = localStorage.getItem("bookingCart");
    // if (savedCartDataString) {
    //   const savedCartData = JSON.parse(savedCartDataString);
    //   if (savedCartData && new Date().getTime() < savedCartData.expiry) {
    //     const savedCartIds = savedCartData.items || [];
    //     if (savedCartIds.length > 0) {
    //       const fetchAndSetCart = async () => {
    //         try {
    //           const promises = savedCartIds.map((item) =>
    //             axios
    //               .get(`/addbooking/${item._id}`)
    //               .then(
    //                 (res) => ({
    //                   status: "fulfilled",
    //                   data: res.data.bookingPlace,
    //                 }),
    //                 () => ({ status: "rejected" })
    //               )
    //           );

    //           const results = await Promise.all(promises);
    //           const validItems = results
    //             .filter((res) => res.status === "fulfilled" && res.data)
    //             .map((res) => res.data);

    //           if (validItems.length !== savedCartIds.length) {
    //             toast("Some cart items were removed/unpublished", { icon: "⚠️" });
    //           }

    //           const formattedData = validItems.map((item) => ({
    //             ...item,
    //             coordinates: {
    //               lat: item.lat,
    //               lng: item.lng,
    //             },
    //           }));

    //           setCart(formattedData);
    //         } catch (err) {
    //           toast.error("Failed to hydrate cart");
    //           setCart([]);
    //         } finally {
    //           setCartHydrated(true);
    //         }
    //       };
    //       fetchAndSetCart();
    //     } else {
    //       setCartHydrated(true);
    //     }
    //   } else {
    //     localStorage.removeItem("bookingCart");
    //     setCartHydrated(true);
    //   }
    // } else {
    //   setCartHydrated(true);
    // }

    fetchTours();
    fetchDiscovers();
    fetchPackages();
    fetchBlogs();
    fetchOurTravelers();

    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  // Keep axios header updated with token
  useEffect(() => {
    setAxiosAuthToken(token);
  }, [token]);

  const value = {
    axios,
    token,
    setToken: updateToken,
    loading,
    tours,
    discovers,
    packages,
    blogs,
    ourTravelers,
    setTours,
    setDiscovers,
    setPackages,
    fetchTours,
    fetchDiscovers,
    fetchPackages,
    fetchBlogs,
    fetchOurTravelers,
    logout,
    // cart,
    // addToCart,
    // removeFromCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
