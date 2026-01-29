import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

export const saveTokens = ({ accessToken, refreshToken }) => {
  Cookies.set('accessToken', accessToken, { expires: 1 });
  Cookies.set('refreshToken', refreshToken, { expires: 7 });
};

export const saveAccessToken = (accessToken) => {
  Cookies.set('accessToken', accessToken, { expires: 1 });
};
export const saveRefreshToken = (refreshToken) => {
  Cookies.set('refreshToken', refreshToken, { expires: 7 });
};

export const getAccessToken = () => Cookies.get('accessToken');
export const getRefreshToken = () => Cookies.get('refreshToken');

export const clearTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
};

export const logout = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  return <Navigate to="/login" replace />;
};

export const getUserEmailFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const payload = JSON.parse(jsonPayload);

    return payload.sub || payload.email || null;
  } catch (e) {
    console.error("Помилка декодування токена:", e);
    return null;
  }
};
