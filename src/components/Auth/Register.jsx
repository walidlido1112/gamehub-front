import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Component for text input fields
const TextField = ({ id, name, type = 'text', value, onChange, placeholder, required }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{placeholder}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
    />
  </div>
);

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '', // Adjusted to match backend field name
    cardNumber: '',
    role: 'employee',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure `formData` contains all required fields
      console.log('Form data being sent:', formData); // Debugging line
      await axios.post('http://localhost:5000/api/auth/register', formData); // يجب أن يتطابق مع المسار في الخادم
      toast.success('Registered successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data); // Debugging line
      toast.error('Registration failed.');
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
          <TextField id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <TextField id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          <TextField id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
          <TextField id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleChange} placeholder="Card Number" required />
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
