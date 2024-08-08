import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// قراءة apiurl من متغيرات البيئة
const apiurl = process.env.REACT_APP_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${apiurl}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data); // تحديث حالة المستخدم
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // تحديث التوكن في إعدادات axios
        } catch (error) {
          console.error('User validation error:', error.response?.data || error.message);
          localStorage.removeItem('token'); // إزالة التوكن إذا كان غير صالح
          setUser(null);
        }
      } else {
        setUser(null); // إذا لم يكن هناك توكن، تعيين حالة المستخدم كـ null
      }
      setLoading(false); // تعيين حالة التحميل كـ false بعد الانتهاء
    };

    checkUserLoggedIn();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${apiurl}/auth/login`, credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token); // حفظ التوكن في localStorage
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // تحديث إعدادات axios
      setUser(user); // تحديث حالة المستخدم
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token'); // إزالة التوكن من localStorage
    delete axios.defaults.headers.common['Authorization']; // إزالة التوكن من إعدادات axios
    setUser(null); // تحديث حالة المستخدم
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// هوك لاستخدام سياق التوثيق
export const useAuth = () => useContext(AuthContext);
