// src/services/loginService.js
import axios from 'axios';
import { apiUrl } from '../config'; // استيراد apiUrl

export const login = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
