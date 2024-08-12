import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

const EditAccountModal = ({ account, onClose, onSave }) => {
  const [email, setEmail] = useState(account.email);
  const [rdp, setRdp] = useState(account.rdp);
  const [searches, setSearches] = useState(account.searches);

  const handleSave = () => {
    const updatedAccount = {
      ...account,
      email,
      rdp,
      searches
    };
    // Send the updated data to the server
    axios.put(`${apiUrl}/snipeaccounts/${account._id}`, updatedAccount)
      .then(() => {
        onSave(updatedAccount); // Notify parent component of the update
      })
      .catch(error => {
        console.error('Error updating account:', error);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Account</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="rdp" className="block text-sm font-medium text-gray-700">RDP</label>
          <select
            id="rdp"
            value={rdp}
            onChange={(e) => setRdp(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            {[...Array(10).keys()].map(num => (
              <option key={num + 1} value={`rdp-0${num + 1}`}>{`rdp-0${num + 1}`}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="searches" className="block text-sm font-medium text-gray-700">Searches</label>
          <input
            type="number"
            id="searches"
            value={searches}
            onChange={(e) => setSearches(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
          >
            <FontAwesomeIcon icon={faSave} className="mr-1" />
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center"
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
