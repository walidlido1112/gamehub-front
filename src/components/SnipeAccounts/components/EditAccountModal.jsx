// EditAccountModal.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditAccountModal = ({ account, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...account });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    axios.put(`${apiUrl}/snipeaccounts/${account._id}`, formData)
      .then(() => {
        onUpdate();
      })
      .catch(error => {
        console.error('Error updating account:', error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Account</h2>
        <label className="block mb-2">
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="ml-2 p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          RDP:
          <input
            type="text"
            name="rdp"
            value={formData.rdp}
            onChange={handleChange}
            className="ml-2 p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Searches:
          <input
            type="number"
            name="searches"
            value={formData.searches}
            onChange={handleChange}
            className="ml-2 p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Coins:
          <input
            type="number"
            name="coins"
            value={formData.coins}
            onChange={handleChange}
            className="ml-2 p-2 border rounded"
          />
        </label>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded mr-2 flex items-center"
          >
            <FontAwesomeIcon icon={faSave} className="mr-1" />
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded flex items-center"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-1" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAccountModal;
