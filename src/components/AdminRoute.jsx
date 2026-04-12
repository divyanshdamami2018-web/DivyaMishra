import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh-gradient">
        <Loader className="w-12 h-12 text-primary" />
      </div>
    );
  }

  // Strict check: must be admin AND have the specific email
  const ADMIN_EMAIL = "dpsychologist01@gmail.com";

  if (!user || user.role !== "admin" || user.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
