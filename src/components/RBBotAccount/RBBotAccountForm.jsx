import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { apiUrl } from '../../config'; // استيراد apiUrl

const RBBotAccountForm = memo(({ initialData = {}, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    passwordType: '',
    gmailPassword: '',
    eaPassword: '',
    sonyPassword: '',
    eaCodes: '',
    sonyCodes: '',
    googleAuthEA: '',
    googleAuthSony: '',
    deviceNumber: '',
    proxy: ''
  });
  const [showPassword, setShowPassword] = useState({
    gmail: false,
    ea: false,
    sony: false
  });
  const [emailError, setEmailError] = useState('');

  // قائمة الأجهزة
  const deviceOptions = [
    ...Array.from({ length: 30 }, (_, i) => `ps4-${String(i + 1).padStart(2, '0')}`),
    'Plus Account',
    'Game Account',
    'Pc account',
    'ultimate account',
    'walid account',
    'New account'
  ];

  useEffect(() => {
    if (initialData && initialData._id) {
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
    if (name === 'email') {
      setEmailError('');
    }
  };

  const handlePasswordToggle = (type) => {
    setShowPassword(prevState => ({
      ...prevState,
      [type]: !prevState[type]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!initialData._id) {
        const { data } = await axios.get(`${apiUrl}/rbbotaccounts/check-email/${formData.email}`);
        if (data.exists) {
          setEmailError('Email already exists.');
          return;
        }
      }

      if (initialData._id) {
        await axios.put(`${apiUrl}/rbbotaccounts/${initialData._id}`, formData);
        toast.success('Account updated successfully!');
      } else {
        await axios.post(`${apiUrl}/rbbotaccounts`, formData);
        toast.success('Account created successfully!');
      }

      if (onSubmit) {
        onSubmit(); // Call onSubmit if provided
      }

      if (onClose) {
        onClose(); // Close modal after submit if onClose is provided
      }

    } catch (error) {
      toast.error('Failed to save account.');
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
              aria-describedby="email-error"
              className={`mt-1 block w-full border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
            />
            {emailError && <p id="email-error" className="text-red-500 text-sm mt-2">{emailError}</p>}
          </div>

          <div>
            <label htmlFor="passwordType" className="block text-sm font-medium text-gray-700">Password & Codes</label>
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
              <div className="relative">
                <input
                  type={showPassword.gmail ? 'text' : 'password'}
                  id="gmailPassword"
                  name="gmailPassword"
                  value={formData.gmailPassword}
                  onChange={handleChange}
                  placeholder="Gmail Password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={() => handlePasswordToggle('gmail')}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  aria-label={showPassword.gmail ? 'Hide password' : 'Show password'}
                >
                  <FontAwesomeIcon icon={showPassword.gmail ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          )}

          {formData.passwordType === 'ea' && (
            <div>
              <label htmlFor="eaPassword" className="block text-sm font-medium text-gray-700">EA Password</label>
              <div className="relative">
                <input
                  type={showPassword.ea ? 'text' : 'password'}
                  id="eaPassword"
                  name="eaPassword"
                  value={formData.eaPassword}
                  onChange={handleChange}
                  placeholder="EA Password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={() => handlePasswordToggle('ea')}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  aria-label={showPassword.ea ? 'Hide password' : 'Show password'}
                >
                  <FontAwesomeIcon icon={showPassword.ea ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          )}

          {formData.passwordType === 'sony' && (
            <div>
              <label htmlFor="sonyPassword" className="block text-sm font-medium text-gray-700">Sony Password</label>
              <div className="relative">
                <input
                  type={showPassword.sony ? 'text' : 'password'}
                  id="sonyPassword"
                  name="sonyPassword"
                  value={formData.sonyPassword}
                  onChange={handleChange}
                  placeholder="Sony Password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
                <button
                  type="button"
                  onClick={() => handlePasswordToggle('sony')}
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  aria-label={showPassword.sony ? 'Hide password' : 'Show password'}
                >
                  <FontAwesomeIcon icon={showPassword.sony ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          )}

          {formData.passwordType === 'ea' && (
            <div>
              <label htmlFor="eaCodes" className="block text-sm font-medium text-gray-700">EA Codes</label>
              <input
                type="text"
                id="eaCodes"
                name="eaCodes"
                value={formData.eaCodes}
                onChange={handleChange}
                placeholder="EA Codes (comma-separated)"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          )}

          {formData.passwordType === 'sony' && (
            <div>
              <label htmlFor="sonyCodes" className="block text-sm font-medium text-gray-700">Sony Codes</label>
              <input
                type="text"
                id="sonyCodes"
                name="sonyCodes"
                value={formData.sonyCodes}
                onChange={handleChange}
                placeholder="Sony Codes (comma-separated)"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          )}

          {formData.passwordType === 'ea' && (
            <div>
              <label htmlFor="googleAuthEA" className="block text-sm font-medium text-gray-700">Google Authenticator EA</label>
              <input
                type="text"
                id="googleAuthEA"
                name="googleAuthEA"
                value={formData.googleAuthEA}
                onChange={handleChange}
                placeholder="Google Authenticator EA"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          )}

          {formData.passwordType === 'sony' && (
            <div>
              <label htmlFor="googleAuthSony" className="block text-sm font-medium text-gray-700">Google Authenticator Sony</label>
              <input
                type="text"
                id="googleAuthSony"
                name="googleAuthSony"
                value={formData.googleAuthSony}
                onChange={handleChange}
                placeholder="Google Authenticator Sony"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
          )}

          <div>
            <label htmlFor="deviceNumber" className="block text-sm font-medium text-gray-700">Device Number</label>
            <select
              id="deviceNumber"
              name="deviceNumber"
              value={formData.deviceNumber}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              required
            >
              <option value="">Select Device</option>
              {deviceOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="proxy" className="block text-sm font-medium text-gray-700">Proxy</label>
            <input
              type="text"
              id="proxy"
              name="proxy"
              value={formData.proxy}
              onChange={handleChange}
              placeholder="Proxy (if any)"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {initialData._id ? 'Update Account' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default RBBotAccountForm;
