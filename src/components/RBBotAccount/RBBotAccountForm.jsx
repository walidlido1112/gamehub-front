import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>
      <div>
        <label htmlFor="passwordGmail" className="block">Gmail Password:</label>
        <input
          type="text"
          id="passwordGmail"
          name="passwordGmail"
          value={formData.passwordGmail}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="passwordEA" className="block">EA Password:</label>
        <input
          type="text"
          id="passwordEA"
          name="passwordEA"
          value={formData.passwordEA}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="passwordSony" className="block">Sony Password:</label>
        <input
          type="text"
          id="passwordSony"
          name="passwordSony"
          value={formData.passwordSony}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label htmlFor="codes" className="block">Codes:</label>
        <input
          type="text"
          id="codes"
          name="codes"
          value={formData.codes}
          onChange={handleChange}
          className="border p-2 w-full"
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
          className="border p-2 w-full"
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
          className="border p-2 w-full"
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
          className="border p-2 w-full"
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
          className="border p-2 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Submit
      </button>
    </form>
  );
};

export default RBBotAccountForm;
