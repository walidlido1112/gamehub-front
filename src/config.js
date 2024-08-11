// src/config.js
const isDevelopment = window.location.hostname === 'localhost';

export const apiUrl = isDevelopment
  ? 'http://localhost:5000/api'
  : 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';
