//components/PriveteRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAppContext();

  if (loading) {
    return <div className="private-loading">Loading...</div>;
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
