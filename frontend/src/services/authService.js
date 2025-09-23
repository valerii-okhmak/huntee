import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND}/api/auth`;

export const register = async (data) => axios.post(`${API_URL}/register`, data);
export const verifyEmail = async (data) => axios.post(`${API_URL}/verify-email`, data);
export const login = async (data) => axios.post(`${API_URL}/login`, data);
export const refreshToken = async (refreshToken) =>
  axios.post(`${API_URL}/refresh-token`, { refreshToken });