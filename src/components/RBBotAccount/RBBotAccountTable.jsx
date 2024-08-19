import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import RBBotAccountForm from './RBBotAccountForm'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config'; // Import apiUrl

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
  const [deviceList, setDeviceList] = useState([]); // List of devices
  const [selectedDevice, setSelectedDevice] = useState(''); // Currently selected device
  const [currentPage, setCurrentPage] = useState(1);
  const [accountsPerPage] = useState(10); // Number of accounts per page
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/rbbotaccounts`);
        setAccounts(data);
        // Extract unique device numbers
        const devices = [...new Set(data.map(account => account.deviceNumber))];
        setDeviceList(devices);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleDeviceSearchChange = (e) => {
    setDeviceSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on device search
  };

  const handleDeviceChange = (e) => {
    setSelectedDevice(e.target.value);
    setCurrentPage(1); // Reset to first page on device selection
  };

  const handleEmailClick = (account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const filteredAccounts = accounts.filter((account) =>
    (account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     account.deviceNumber.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedDevice ? account.deviceNumber === selectedDevice : true) &&
    account.deviceNumber.toLowerCase().includes(deviceSearchQuery.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastAccount = currentPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedAccount) {
        await axios.put(`${apiUrl}/rbbotaccounts/${selectedAccount._id}`, formData);
      } else {
        await axios.post(`${apiUrl}/rbbotaccounts`, formData);
      }
      setSelectedAccount(null);
      setSearchQuery('');
      setDeviceSearchQuery('');
      const { data } = await axios.get(`${apiUrl}/rbbotaccounts`);
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
        axios.delete(`${apiUrl}/rbbotaccounts/${accountId}`)
      ));
      setSelectedAccounts([]);
      const { data } = await axios.get(`${apiUrl}/rbbotaccounts`);
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

  const accountCount = accounts.length;
  const deviceCount = new Set(accounts.map(account => account.deviceNumber)).size;
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);

  return (
    <div className="p-6 bg-gray-50">
      <div className="mb-6">
        <p className="text-lg font-semibold text-gray-800">
          Total Accounts: {accountCount}
        </p>
        <p className="text-lg font-semibold text-gray-800">
          Unique Devices: {deviceCount}
        </p>
      </div>
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="text"
          id="search-query"
          name="searchQuery"
          placeholder="Search by email or device number"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          id="device-search-query"
          name="deviceSearchQuery"
          placeholder="Search by device number"
          value={deviceSearchQuery}
          onChange={handleDeviceSearchChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          id="device-select"
          name="deviceSelect"
          value={selectedDevice}
          onChange={handleDeviceChange}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Device</option>
          {deviceList.map(device => (
            <option key={device} value={device}>{device}</option>
          ))}
        </select>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedAccounts.length === 0}
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 flex items-center"
        >
          <FontAwesomeIcon icon={faTrash} />
          <span className="ml-2">Delete Selected</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Device</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.map((account, index) => (
              <tr
                key={account._id}
                className={`border-b border-gray-300 ${selectedAccounts.includes(account._id) ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <td className="p-3">{indexOfFirstAccount + index + 1}</td>
                <td className="p-3">{account.email}</td>
                <td className="p-3">{account.deviceNumber}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEmailClick(account)}
                    className="text-blue-600 hover:underline"
                    aria-label={`View details for ${account.email}`}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account._id)}
                    onChange={() => handleCheckboxChange(account._id)}
                    className="ml-2"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg font-semibold text-gray-800">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Account Details"
        className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-70"
      >
        <div
          className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
          aria-hidden={!isModalOpen}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-2 right-2 p-2 bg-gray-300 rounded-full hover:bg-gray-400"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Account Details</h2>
          <button
            onClick={togglePasswordVisibility}
            className="mb-4 text-blue-600 hover:underline"
            aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}
          >
            <FontAwesomeIcon icon={showPasswords ? faEyeSlash : faEye} />
            <span className="ml-2">{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
          </button>
          {selectedAccount && (
            <RBBotAccountForm
              initialData={selectedAccount}
              onSubmit={handleFormSubmit}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default RBBotAccountTable;
