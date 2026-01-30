import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; 
import { getAccessToken, getRefreshToken, saveAccessToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode'; 
import { refreshToken as requestNewAccessToken } from '../services/authService';
import Loader from './loader/Loader';

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now(); 
  } catch (e) {
    return false;
  }
};

const ProtectedRoute = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation(); 

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      const accessValid = isTokenValid(accessToken);

      if (accessValid) {
        setAuthorized(true);
        setAuthChecked(true);
        return;
      }

      const refreshValid = isTokenValid(refreshToken);

      if (refreshValid) {
        try {
          const newAccessTokenData = await requestNewAccessToken(refreshToken);
          const newAccessToken = newAccessTokenData.data.accessToken;
          saveAccessToken(newAccessToken); 
          setAuthorized(true);
        } catch (err) {
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }

      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return <Loader />; 
  }

  return authorized ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;