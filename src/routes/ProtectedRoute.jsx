import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a different loading indicator
  }

  if (!user) {
    // Redirect to login page if no user is authenticated
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Redirect to home page if user role does not match
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
