import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import RBBotAccountForm from './RBBotAccountForm';

const RBBotAccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const apiUrl = `${process.env.REACT_APP_API_URL}/rbbotaccounts`;
        console.log('Fetching from URL:', apiUrl); // Debug URL here
        const { data } = await axios.get(apiUrl);
        setAccounts(data);
      } catch (error) {
        toast.error('Failed to fetch accounts.');
        console.error('Failed to fetch accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRowClick = (account) => {
    setSelectedAccount(account);
  };

  const filteredAccounts = accounts.filter((account) =>
    account.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.deviceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = async (formData) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/rbbotaccounts`;
      if (selectedAccount) {
        await axios.put(`${apiUrl}/${selectedAccount._id}`, formData);
        toast.success('Account updated successfully!');
      } else {
        await axios.post(apiUrl, formData);
        toast.success('Account created successfully!');
      }
      setSelectedAccount(null);
      setSearchQuery('');
      const { data } = await axios.get(apiUrl);
      setAccounts(data);
    } catch (error) {
      toast.error('Failed to save account.');
      console.error('Failed to save account:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">RBBot Accounts</h2>
        <input
          type="text"
          placeholder="Search by email or device number"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
        />
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Device Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account._id} className="cursor-pointer hover:bg-gray-100" onClick={() => handleRowClick(account)}>
                <td className="border border-gray-300 p-2">{account.email}</td>
                <td className="border border-gray-300 p-2">{account.deviceNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedAccount && (
          <RBBotAccountForm
            initialData={selectedAccount}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default RBBotAccountTable;
