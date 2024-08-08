// src/services/employeeService.js
import axios from 'axios';

const API_URL = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('فشل في جلب الموظفين');
  }
};
