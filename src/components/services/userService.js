// src/services/userService.js
import axios from 'axios';

const API_URL = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('فشل في جلب المستخدمين');
  }
};
