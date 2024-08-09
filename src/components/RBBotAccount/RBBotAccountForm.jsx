import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
  const [showPasswords, setShowPasswords] = useState(false);

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
      } else {
        // Create new account
        await axios.post(`${API_BASE_URL}/rbbotaccounts`, formData);
      }
      onSubmit(); // Callback to refresh data or handle post-submit actions
      toast.success('Account saved successfully!');
    } catch (error) {
      toast.error('Failed to save account. Please try again.');
      console.error('Failed to save account:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1">Password Type</label>
        <select
          name="passwordType"
          value={formData.passwordType}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Password Type</option>
          <option value="gmail">Gmail</option>
          <option value="ea">EA</option>
          <option value="sony">Sony</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
        {formData.passwordType && (
          <div className="relative">
            <input
              type={showPasswords ? 'text' : 'password'}
              id={`${formData.passwordType}Password`}
              name={`${formData.passwordType}Password`}
              value={formData[`${formData.passwordType}Password`]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder={`${formData.passwordType.charAt(0).toUpperCase() + formData.passwordType.slice(1)} Password`}
            />
            <span
              onClick={() => setShowPasswords(!showPasswords)}
              className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
            >
              <FontAwesomeIcon icon={showPasswords ? faEyeSlash : faEye} />
            </span>
          </div>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="codes">Codes</label>
        <input
          type="text"
          id="codes"
          name="codes"
          value={formData.codes}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="googleAuthEA">Google Auth EA</label>
        <input
          type="text"
          id="googleAuthEA"
          name="googleAuthEA"
          value={formData.googleAuthEA}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="googleAuthSony">Google Auth Sony</label>
        <input
          type="text"
          id="googleAuthSony"
          name="googleAuthSony"
          value={formData.googleAuthSony}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="deviceNumber">Device Number</label>
        <input
          type="text"
          id="deviceNumber"
          name="deviceNumber"
          value={formData.deviceNumber}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-1" htmlFor="proxy">Proxy</label>
        <input
          type="text"
          id="proxy"
          name="proxy"
          value={formData.proxy}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData._id ? 'Update Account' : 'Create Account'}
        </button>
      </div>
    </form>
  );
};

export default RBBotAccountForm;
