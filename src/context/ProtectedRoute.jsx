// src/utils/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";


const ProtectedRoute = ({ children, allowedtype }) => {
  const token = Cookies.get("userToken");
  const usertype = Cookies.get("usertype");

  if (!token || !allowedtype.includes(usertype)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;