import React, { useState } from 'react';
import axios from 'axios';

const RBBotAccountForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    passwordType: '', // Changed from `password` to `passwordType`
    gmailPassword: '',
    eaPassword: '',
    sonyPassword: '',
    codes: '',
    googleAuthEA: '',
    googleAuthSony: '',
    deviceNumber: '',
    proxy: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_API_URL}/rb-bot-accounts`;
      if (formData._id) {
        // Update existing account
        await axios.put(`${url}/${formData._id}`, formData);
      } else {
        // Create new account
        await axios.post(url, formData);
      }
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <div>
        <label htmlFor="email" className="block">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor="passwordType" className="block">Password Type:</label>
        <select
          id="passwordType"
          name="passwordType"
          value={formData.passwordType}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label htmlFor="gmailPassword" className="block">Gmail Password:</label>
          <input
            type="password"
            id="gmailPassword"
            name="gmailPassword"
            value={formData.gmailPassword}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      {formData.passwordType === 'ea' && (
        <div>
          <label htmlFor="eaPassword" className="block">EA Password:</label>
          <input
            type="password"
            id="eaPassword"
            name="eaPassword"
            value={formData.eaPassword}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      {formData.passwordType === 'sony' && (
        <div>
          <label htmlFor="sonyPassword" className="block">Sony Password:</label>
          <input
            type="password"
            id="sonyPassword"
            name="sonyPassword"
            value={formData.sonyPassword}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
      <div>
        <label htmlFor="codes" className="block">Codes:</label>
        <input
          type="text"
          id="codes"
          name="codes"
          value={formData.codes}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="googleAuthEA" className="block">Google Auth EA:</label>
        <input
          type="text"
          id="googleAuthEA"
          name="googleAuthEA"
          value={formData.googleAuthEA}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="googleAuthSony" className="block">Google Auth Sony:</label>
        <input
          type="text"
          id="googleAuthSony"
          name="googleAuthSony"
          value={formData.googleAuthSony}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="deviceNumber" className="block">Device Number:</label>
        <input
          type="text"
          id="deviceNumber"
          name="deviceNumber"
          value={formData.deviceNumber}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label htmlFor="proxy" className="block">Proxy:</label>
        <input
          type="text"
          id="proxy"
          name="proxy"
          value={formData.proxy}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Submit
      </button>
    </form>
  );
};

export default RBBotAccountForm;
