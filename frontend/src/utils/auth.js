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
};
