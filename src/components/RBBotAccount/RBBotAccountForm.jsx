import React, { useState } from 'react';

const RBBotAccountForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to API
    console.log('Form submitted:', formData);
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
        <label htmlFor="password" className="block">Password:</label>
        <select
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Password Type</option>
          <option value="gmail">Gmail</option>
          <option value="ea">EA</option>
          <option value="sony">Sony</option>
        </select>
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
