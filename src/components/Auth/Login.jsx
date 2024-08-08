import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // تأكد من صحة المسار

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const { setUser } = useAuth(); // تأكد من وجود دالة setUser في AuthContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData); // تسجيل بيانات النموذج
    try {
      const response = await axios.post('https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api/auth/login', formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token); // تخزين التوكن في التخزين المحلي
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // تحديث التوكن في إعدادات axios

      setUser(user); // حفظ بيانات المستخدم في السياق

      // التوجيه بناءً على الدور
      if (user.role === 'admin') {
        navigate('/dashboard'); // الانتقال إلى لوحة التحكم
      } else if (user.role === 'employee') {
        navigate('/employee-dashboard'); // الانتقال إلى لوحة تحكم الموظف
      } else {
        toast.error('Access denied');
      }
    } catch (error) {
      console.error('Login error:', error); // تسجيل الخطأ بشكل أعمق
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
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
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
