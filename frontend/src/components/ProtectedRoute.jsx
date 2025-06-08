import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken, getRefreshToken, saveAccessToken } from '../utils/auth';
import { jwtDecode } from 'jwt-decode'; 
import { refreshToken as requestNewAccessToken } from '../services/authService';

const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    const expirationDate = new Date(exp * 1000);
    const currentDate = new Date();
    const daysUntilExpiration = (expirationDate - currentDate) / (1000 * 60 * 60 * 24);
    console.log('Days until token expires:', daysUntilExpiration.toFixed(2));
    return exp * 1000 > Date.now(); // exp в секундах → мілісекунди
  } catch (e) {
    return false;
  }
};

const ProtectedRoute = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      const accessValid = isTokenValid(accessToken);

      console.log('Access Token Valid:', accessValid);
      console.log('Refresh Token Valid:', isTokenValid(refreshToken));
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
    return <div>Завантаження...</div>; 
  }

  return authorized ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
