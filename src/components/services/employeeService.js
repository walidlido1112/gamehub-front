// src/services/employeeService.js
import axios from 'axios';

import { apiUrl } from '../../config'; // استيراد apiUrl

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    throw new Error('فشل في جلب الموظفين');
  }
};
