import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken } from '../utils/auth';

const ProtectedRoute = () => {
  return getAccessToken() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;