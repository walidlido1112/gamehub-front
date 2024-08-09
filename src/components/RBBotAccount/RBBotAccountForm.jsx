import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RBBotAccountForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: 'gmail',
    codes: '',
    googleAuthEA: '',
    googleAuthSony: '',
    deviceNumber: '',
    proxy: '',
    ...initialData
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <select
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        >
          <option value="gmail">Gmail</option>
          <option value="ea">EA</option>
          <option value="sony">Sony</option>
        </select>
      </div>
      <div>
        <label>Codes:</label>
        <input
          type="text"
          name="codes"
          value={formData.codes}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Google Auth EA:</label>
        <input
          type="text"
          name="googleAuthEA"
          value={formData.googleAuthEA}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Google Auth Sony:</label>
        <input
          type="text"
          name="googleAuthSony"
          value={formData.googleAuthSony}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Device Number:</label>
        <input
          type="text"
          name="deviceNumber"
          value={formData.deviceNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Proxy:</label>
        <input
          type="text"
          name="proxy"
          value={formData.proxy}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RBBotAccountForm;
