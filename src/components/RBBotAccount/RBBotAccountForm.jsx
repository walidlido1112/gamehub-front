import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faCode, faMobileAlt, faGlobe, faUser } from '@fortawesome/free-solid-svg-icons';

const RBBotAccountForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: '',
    passwordGmail: '',
    passwordEA: '',
    passwordSony: '',
    codes: '',
    googleAuthEA: '',
    googleAuthSony: '',
    deviceNumber: '',
    proxy: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || '',
        passwordGmail: initialData.passwordGmail || '',
        passwordEA: initialData.passwordEA || '',
        passwordSony: initialData.passwordSony || '',
        codes: initialData.codes || '',
        googleAuthEA: initialData.googleAuthEA || '',
        googleAuthSony: initialData.googleAuthSony || '',
        deviceNumber: initialData.deviceNumber || '',
        proxy: initialData.proxy || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData._id) {
        // Update existing account
        await axios.put(`${process.env.REACT_APP_API_URL}/rb-bot-accounts/${initialData._id}`, formData);
      } else {
        // Create new account
        await axios.post(`${process.env.REACT_APP_API_URL}/rb-bot-accounts`, formData);
      }
      onSubmit(); // Pass form data to parent component or API
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faLock} className="text-gray-500" />
        <input
          type="text"
          id="passwordGmail"
          name="passwordGmail"
          value={formData.passwordGmail}
          onChange={handleChange}
          placeholder="Gmail Password"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faLock} className="text-gray-500" />
        <input
          type="text"
          id="passwordEA"
          name="passwordEA"
          value={formData.passwordEA}
          onChange={handleChange}
          placeholder="EA Password"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faLock} className="text-gray-500" />
        <input
          type="text"
          id="passwordSony"
          name="passwordSony"
          value={formData.passwordSony}
          onChange={handleChange}
          placeholder="Sony Password"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faCode} className="text-gray-500" />
        <input
          type="text"
          id="codes"
          name="codes"
          value={formData.codes}
          onChange={handleChange}
          placeholder="Codes"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faGlobe} className="text-gray-500" />
        <input
          type="text"
          id="googleAuthEA"
          name="googleAuthEA"
          value={formData.googleAuthEA}
          onChange={handleChange}
          placeholder="Google Auth EA"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faGlobe} className="text-gray-500" />
        <input
          type="text"
          id="googleAuthSony"
          name="googleAuthSony"
          value={formData.googleAuthSony}
          onChange={handleChange}
          placeholder="Google Auth Sony"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faMobileAlt} className="text-gray-500" />
        <input
          type="text"
          id="deviceNumber"
          name="deviceNumber"
          value={formData.deviceNumber}
          onChange={handleChange}
          placeholder="Device Number"
          className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={faUser} className="text-gray-500" />
        <input
          type="text"
          id="proxy"
          name="proxy"
          value={formData.proxy}
          onChange={handleChange}
          placeholder="Proxy"
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
