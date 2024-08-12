// src/components/SnipeAccounts/AccountForm.jsx
import React, { useState } from 'react';
import { apiUrl } from '../../../config';

const AccountForm = () => {
  const [email, setEmail] = useState('');
  const [rdp, setRdp] = useState('rdp-01');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [checkingEmail, setCheckingEmail] = useState(false); // State to handle email checking

  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`${apiUrl}/snipeaccounts/check-email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCheckingEmail(true);

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setErrorMessage('Email is already registered.');
      setSuccessMessage(''); // Clear any previous success messages
      setCheckingEmail(false);
      return;
    }

    fetch(`${apiUrl}/snipeaccounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, rdp }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setSuccessMessage('Account added successfully!');
        setErrorMessage(''); // Clear any previous error messages
        setEmail('');
        setRdp('rdp-01');
        setCheckingEmail(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('Failed to add account. Please try again.');
        setSuccessMessage(''); // Clear any previous success messages
        setCheckingEmail(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rdp">
          RDP
        </label>
        <select
          id="rdp"
          value={rdp}
          onChange={(e) => setRdp(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {[...Array(10).keys()].map((i) => (
            <option key={i} value={`rdp-0${i + 1}`}>
              {`rdp-0${i + 1}`}
            </option>
          ))}
        </select>
      </div>
      <button 
        type="submit" 
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${checkingEmail ? 'cursor-not-allowed opacity-50' : ''}`} 
        disabled={checkingEmail}
      >
        Submit
      </button>
      {successMessage && (
        <p className="mt-4 text-green-500">{successMessage}</p>
      )}
      {errorMessage && (
        <p className="mt-4 text-red-500">{errorMessage}</p>
      )}
    </form>
  );
};

export default AccountForm;
