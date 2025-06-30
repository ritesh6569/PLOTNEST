import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
} 