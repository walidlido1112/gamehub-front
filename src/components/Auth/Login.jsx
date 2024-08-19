import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiUrl } from '../../config';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const formVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
};

const buttonVariants = {
  hover: { scale: 1.1, backgroundColor: '#005bb5', transition: { duration: 0.3 } },
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // تحقق من صحة البيانات
    if (!formData.email || !formData.password) {
      toast.error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    
    console.log('Form data being sent:', formData);
    
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, formData);
      const { token, user } = response.data;
  
      // تخزين الرمز المميز في التخزين المحلي
      localStorage.setItem('token', token);
  
      // تعيين الرمز المميز في ترويسة الطلبات التالية
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
      // تعيين حالة المستخدم
      setUser(user);
  
      // توجيه المستخدم بناءً على الدور
      if (user.role === 'admin') {
        navigate('/dashboard');
      } else if (user.role === 'employee') {
        navigate('/employee-dashboard');
      } else {
        toast.error('Access denied');
      }
    } catch (error) {
      console.error('Login error:', error);
  
      // تحسين عرض رسائل الأخطاء
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    }
  };
    
  return (
    <div 
      style={{ 
        backgroundImage: 'url("https://images7.alphacoders.com/599/599379.jpg")', // Replace with your background image URL
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
        className="w-full max-w-md bg-white shadow-lg rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <motion.div 
          variants={formVariants} 
          initial="hidden" 
          animate="visible"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <motion.button 
              type="submit"
              variants={buttonVariants} 
              whileHover="hover"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Login
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
