import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './AddAccountModal.css'; // Ensure this path is correct

// Function to generate device options with proper formatting
const generateDeviceOptions = () => {
  const ps4Options = Array.from({ length: 25 }, (_, i) => `ps4-${String(i + 1).padStart(2, '0')}`);
  const ps5Options = Array.from({ length: 5 }, (_, i) => `ps5-${String(i + 1).padStart(2, '0')}`);
  const pcOptions = Array.from({ length: 6 }, (_, i) => `pc-${String(i + 1).padStart(2, '0')}`);
  return {
    ps4: ps4Options,
    ps5: ps5Options,
    pc: pcOptions,
  };
};

const AddAccountModal = ({ isOpen, onRequestClose }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [deviceCategory, setDeviceCategory] = useState('');
  const [deviceNumber, setDeviceNumber] = useState('');
  const [deviceOptions] = useState(generateDeviceOptions());

  // Update device numbers based on selected category
  const handleCategoryChange = (e) => {
    setDeviceCategory(e.target.value);
    setDeviceNumber(''); // Reset device number when category changes
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/plays/add', {
        email,
        code,
        deviceNumber,
      });

      alert('Account added successfully');
      onRequestClose(); // Close the modal
    } catch (error) {
      console.error('Failed to add account:', error.response?.data || error.message);
      alert(`Failed to add account: ${error.response?.data?.error || 'An error occurred'}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      shouldCloseOnOverlayClick={true}
    >
      <h2 className="modal-header">Add New Account</h2>
      <form onSubmit={handleAddAccount} className="modal-form">
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Device Category:</label>
          <select
            value={deviceCategory}
            onChange={handleCategoryChange}
            className="form-select"
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="ps4">PS4</option>
            <option value="ps5">PS5</option>
            <option value="pc">PC</option>
          </select>
        </div>
        {deviceCategory && (
          <div className="form-group">
            <label className="form-label">Device Number:</label>
            <select
              value={deviceNumber}
              onChange={(e) => setDeviceNumber(e.target.value)}
              className="form-select"
              required
            >
              <option value="" disabled>Select a device</option>
              {deviceOptions[deviceCategory].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="modal-actions">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Add
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountModal;
