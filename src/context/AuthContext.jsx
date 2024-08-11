import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../config'; // Ensure this path is correct

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and get user details
          const response = await axios.get(`${apiUrl}/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user); // Set the user from the response
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set default token for axios
        } catch (error) {
          console.error('User validation error:', error.response?.data || error.message);
          localStorage.removeItem('token'); // Remove invalid token
          setUser(null);
        }
      } else {
        setUser(null); // No token present
      }
      setLoading(false); // Stop loading after verification
    };

    checkUserLoggedIn();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token); // Save token to local storage
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set default token for axios
      setUser(user); // Set user state
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    delete axios.defaults.headers.common['Authorization']; // Remove token from axios headers
    setUser(null); // Clear user state
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
