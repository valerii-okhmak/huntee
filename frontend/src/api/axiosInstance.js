import axios from 'axios';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from '../utils/auth';
import { refreshToken } from '../services/authService';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, 
});

instance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await refreshToken(getRefreshToken());
        saveTokens(res.data);
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return instance(originalRequest);
      } catch (e) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
