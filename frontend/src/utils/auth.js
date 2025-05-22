import Cookies from 'js-cookie';

export const saveTokens = ({ accessToken, refreshToken }) => {
  Cookies.set('accessToken', accessToken, { expires: 7 });
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
