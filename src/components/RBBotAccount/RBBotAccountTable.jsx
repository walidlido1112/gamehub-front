import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import RBBotAccountForm from './RBBotAccountForm'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

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
  const [showPasswords, setShowPasswords] = useState(false); // To toggle password visibility
  const navigate = useNavigate(); // Initialize the navigate function

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

  const handleEmailClick = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const filteredAccounts = accounts.filter((account) =>
    (account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     account.deviceNumber.toLowerCase().includes(searchQuery.toLowerCase())) &&
    account.deviceNumber.toLowerCase().includes(deviceSearchQuery.toLowerCase())
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
      navigate('/rbbotaccounts'); // Redirect to RBBotAccountsPage
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
    setSelectedAccounts(prevSelected => 
      prevSelected.includes(accountId)
        ? prevSelected.filter(id => id !== accountId)
        : [...prevSelected, accountId]
    );
  };

  const togglePasswordVisibility = () => {
    setShowPasswords(prev => !prev);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by email or device number"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Search by device number"
          value={deviceSearchQuery}
          onChange={handleDeviceSearchChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleDeleteSelected}
          disabled={selectedAccounts.length === 0}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 flex items-center"
        >
          <FontAwesomeIcon icon={faTrash} />
          <span className="ml-2">Delete Selected</span>
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
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
                className="cursor-pointer"
              />
            </th>
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((account, index) => (
            <tr
              key={account._id}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(account._id)}
                  onChange={() => handleCheckboxChange(account._id)}
                  className="cursor-pointer"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td
                className="border border-gray-300 px-4 py-2 text-blue-600 hover:underline"
                onClick={() => handleEmailClick(account)}
              >
                {account.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedAccount && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Account Details"
          className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center"
          overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-70"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 p-2 bg-gray-300 rounded-full hover:bg-gray-400"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Account Details</h2>
            <button
              onClick={togglePasswordVisibility}
              className="mb-4 text-blue-600 hover:underline"
            >
              <FontAwesomeIcon icon={showPasswords ? faEyeSlash : faEye} />
              <span className="ml-2">{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
            </button>
            <RBBotAccountForm
              initialData={selectedAccount}
              onSubmit={handleFormSubmit}
              showPasswords={showPasswords} // Pass the state to the form
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RBBotAccountTable;
