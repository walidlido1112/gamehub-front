import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';

// Configure the modal
Modal.setAppElement('#root');

const RBBotAccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceSearchQuery, setDeviceSearchQuery] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/rbbotaccounts`);
        setAccounts(data);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeviceSearchChange = (e) => {
    setDeviceSearchQuery(e.target.value);
  };

  const handleRowClick = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const filteredAccounts = accounts.filter((account) =>
    (account.email.includes(searchQuery) || account.deviceNumber.includes(searchQuery)) &&
    (account.deviceNumber.includes(deviceSearchQuery))
  );

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedAccount) {
        await axios.put(`${API_BASE_URL}/rbbotaccounts/${selectedAccount._id}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/rbbotaccounts`, formData);
      }
      setSelectedAccount(null);
      setSearchQuery('');
      setDeviceSearchQuery('');
      const { data } = await axios.get(`${API_BASE_URL}/rbbotaccounts`);
      setAccounts(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedAccounts.map(accountId =>
        axios.delete(`${API_BASE_URL}/rbbotaccounts/${accountId}`)
      ));
      setSelectedAccounts([]);
      const { data } = await axios.get(`${API_BASE_URL}/rbbotaccounts`);
      setAccounts(data);
    } catch (error) {
      console.error('Failed to delete accounts:', error);
    }
  };

  const handleCheckboxChange = (accountId) => {
    setSelectedAccounts(prevSelected => {
      if (prevSelected.includes(accountId)) {
        return prevSelected.filter(id => id !== accountId);
      } else {
        return [...prevSelected, accountId];
      }
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Search by device number"
          value={deviceSearchQuery}
          onChange={handleDeviceSearchChange}
          className="ml-4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleDeleteSelected}
          disabled={selectedAccounts.length === 0}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          <FontAwesomeIcon icon={faTrash} />
          <span className="ml-2">Delete Selected</span>
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">
              <input
                type="checkbox"
                checked={selectedAccounts.length === accounts.length}
                onChange={() => {
                  if (selectedAccounts.length === accounts.length) {
                    setSelectedAccounts([]);
                  } else {
                    setSelectedAccounts(accounts.map(account => account._id));
                  }
                }}
              />
            </th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((account) => (
            <tr
              key={account._id}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => handleRowClick(account)}
            >
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(account._id)}
                  onChange={() => handleCheckboxChange(account._id)}
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{account.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedAccount && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Account Details"
          className="modal"
          overlayClassName="overlay"
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Account Details</h2>
            <RBBotAccountForm
              initialData={selectedAccount}
              onSubmit={handleFormSubmit}
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <FontAwesomeIcon icon={faTimes} />
              <span className="ml-2">Close</span>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RBBotAccountTable;
