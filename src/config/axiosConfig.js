import axios from 'axios';

// ضبط التوكن بشكل افتراضي إذا كان موجودًا في التخزين المحلي
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios;
