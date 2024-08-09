import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';

const RBBotAccountForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    passwordType: '',
    gmailPassword: '',
    eaPassword: '',
    sonyPassword: '',
    codes: '',
    googleAuthEA: '',
    googleAuthSony: '',
    deviceNumber: '',
    proxy: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData._id) {
        // Update existing account
        await axios.put(`${API_BASE_URL}/rbbotaccounts/${initialData._id}`, formData);
        toast.success('Account updated successfully!');
      } else {
        // Create new account
        await axios.post(`${API_BASE_URL}/rbbotaccounts`, formData);
        toast.success('Account created successfully!');
      }
      onSubmit(); // Call the onSubmit prop function if provided
      navigate('/rbbotaccounts'); // Redirect to RBBotAccountsPage
    } catch (error) {
      toast.error('Operation failed. Please try again.');
      console.error('Failed to save account:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {initialData._id ? 'Update RBBot Account' : 'Create RBBot Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="passwordType" className="block text-sm font-medium text-gray-700">Password Type</label>
            <select
              id="passwordType"
              name="passwordType"
              value={formData.passwordType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            >
              <option value="">Select Password Type</option>
              <option value="gmail">Gmail</option>
              <option value="ea">EA</option>
              <option value="sony">Sony</option>
            </select>
          </div>

          {formData.passwordType === 'gmail' && (
            <div>
              <label htmlFor="gmailPassword" className="block text-sm font-medium text-gray-700">Gmail Password</label>
              <input
                type="password"
                id="gmailPassword"
                name="gmailPassword"
                value={formData.gmailPassword}
                onChange={handleChange}
                placeholder="Gmail Password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          )}

          {formData.passwordType === 'ea' && (
            <div>
              <label htmlFor="eaPassword" className="block text-sm font-medium text-gray-700">EA Password</label>
              <input
                type="password"
                id="eaPassword"
                name="eaPassword"
                value={formData.eaPassword}
                onChange={handleChange}
                placeholder="EA Password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          )}

          {formData.passwordType === 'sony' && (
            <div>
              <label htmlFor="sonyPassword" className="block text-sm font-medium text-gray-700">Sony Password</label>
              <input
                type="password"
                id="sonyPassword"
                name="sonyPassword"
                value={formData.sonyPassword}
                onChange={handleChange}
                placeholder="Sony Password"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          )}

          <div>
            <label htmlFor="codes" className="block text-sm font-medium text-gray-700">Codes</label>
            <input
              type="text"
              id="codes"
              name="codes"
              value={formData.codes}
              onChange={handleChange}
              placeholder="Codes"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="googleAuthEA" className="block text-sm font-medium text-gray-700">Google Auth EA</label>
            <input
              type="text"
              id="googleAuthEA"
              name="googleAuthEA"
              value={formData.googleAuthEA}
              onChange={handleChange}
              placeholder="Google Auth EA"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="googleAuthSony" className="block text-sm font-medium text-gray-700">Google Auth Sony</label>
            <input
              type="text"
              id="googleAuthSony"
              name="googleAuthSony"
              value={formData.googleAuthSony}
              onChange={handleChange}
              placeholder="Google Auth Sony"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="deviceNumber" className="block text-sm font-medium text-gray-700">Device Number</label>
            <input
              type="text"
              id="deviceNumber"
              name="deviceNumber"
              value={formData.deviceNumber}
              onChange={handleChange}
              placeholder="Device Number"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="proxy" className="block text-sm font-medium text-gray-700">Proxy</label>
            <input
              type="text"
              id="proxy"
              name="proxy"
              value={formData.proxy}
              onChange={handleChange}
              placeholder="Proxy"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {initialData._id ? 'Update RBBot Account' : 'Create RBBot Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RBBotAccountForm;
