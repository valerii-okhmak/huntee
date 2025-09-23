import axios from 'axios';

const API_URL = 'https://java-application-latest-mlfc.onrender.com/api';

export const register = async (data) => axios.post(`${API_URL}/register`, data);
