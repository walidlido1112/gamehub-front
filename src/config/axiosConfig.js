import axios from 'axios';

// ضبط التوكن بشكل افتراضي إذا كان موجودًا في التخزين المحلي
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Create a base axios instance with your API base URL
const api = axios.create({
  baseURL: 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api',
});

export default api;
