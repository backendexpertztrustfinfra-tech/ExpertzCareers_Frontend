
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedtype }) => {
  const { user, userToken, isLoading } = useContext(AuthContext);

  // Still loading user → don’t render yet
  if (isLoading) return null;

  // If no token → force login
  if (!userToken) return <Navigate to="/login" replace />;

  // If not verified → force email verification
  if (!user?.isVerified) return <Navigate to="/emailverification" replace />;

  // If role mismatch → unauthorized
  if (allowedtype && !allowedtype.includes(user?.usertype)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
