
// // // src/utils/ProtectedRoute.jsx
// // import React, { useContext } from "react";
// // import { Navigate } from "react-router-dom";
// // import { AuthContext } from "../context/AuthContext";

// // const ProtectedRoute = ({ children, allowedtype }) => {
// //   const { user, userToken, isLoading } = useContext(AuthContext);

// //   // Still loading user → don’t render yet
// //   if (isLoading) return null;

// //   // If no token → force login
// //   if (!userToken) return <Navigate to="/login" replace />;

// //   // If not verified → force email verification
// //   if (!user?.isVerified) return <Navigate to="/emailverification" replace />;

// //   // If role mismatch → unauthorized
// //   if (allowedtype && !allowedtype.includes(user?.usertype)) {
// //     return <Navigate to="/unauthorized" replace />;
// //   }

// //   return children;
// // };

// // export default ProtectedRoute;




// src/utils/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedtype }) => {
  const { user, userToken, isLoading } = useContext(AuthContext);
  const location = useLocation();

  // Public routes that don't need login
  const publicRoutes = [
    "/reset-password",
    "/forgot-password",
    "/register",
    "/signup"
  ];

  // Still loading user → show nothing or loader
  if (isLoading) return null;

  // ✅ If path is public → allow directly
  if (publicRoutes.includes(location.pathname)) {
    return children;
  }

  // If no token → force login
  if (!userToken) {
    return <Navigate to="/" replace />;
  }

  // If not verified → force email verification
  if (!user?.isVerified) {
    return <Navigate to="/emailverification" replace />;
  }

  // If role mismatch → unauthorized
  if (allowedtype && !allowedtype.includes(user?.usertype)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
