// src/services/employeeService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/employees';

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error('فشل في جلب الموظفين');
  }
};
