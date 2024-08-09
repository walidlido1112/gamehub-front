import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // إضافة Modal

const API_BASE_URL = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';

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
    <div>
      <input
        type="text"
        placeholder="Search by email"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <input
        type="text"
        placeholder="Search by device number"
        value={deviceSearchQuery}
        onChange={handleDeviceSearchChange}
      />
      <button onClick={handleDeleteSelected} disabled={selectedAccounts.length === 0}>
        Delete Selected
      </button>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((account) => (
            <tr key={account._id} onClick={() => handleRowClick(account)}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedAccounts.includes(account._id)}
                  onChange={() => handleCheckboxChange(account._id)}
                />
              </td>
              <td>{account.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedAccount && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Account Details"
        >
          <h2>Account Details</h2>
          <RBBotAccountForm
            initialData={selectedAccount}
            onSubmit={handleFormSubmit}
          />
          <button onClick={() => setIsModalOpen(false)}>Close</button>
        </Modal>
      )}
    </div>
  );
};

export default RBBotAccountTable;
