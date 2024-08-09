import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api'; // أضف هذا السطر

const RBBotAccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/rbbotaccounts`); // استخدم API_BASE_URL هنا
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

  const handleRowClick = (account) => {
    setSelectedAccount(account);
  };

  const filteredAccounts = accounts.filter((account) =>
    account.email.includes(searchQuery) || account.deviceNumber.includes(searchQuery)
  );

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedAccount) {
        await axios.put(`${API_BASE_URL}/rbbotaccounts/${selectedAccount._id}`, formData); // استخدم API_BASE_URL هنا
      } else {
        await axios.post(`${API_BASE_URL}/rbbotaccounts`, formData); // استخدم API_BASE_URL هنا
      }
      setSelectedAccount(null);
      setSearchQuery('');
      const { data } = await axios.get(`${API_BASE_URL}/rbbotaccounts`); // استخدم API_BASE_URL هنا
      setAccounts(data);
    } catch (error) {
      console.error('Failed to save account:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by email or device number"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((account) => (
            <tr key={account._id} onClick={() => handleRowClick(account)}>
              <td>{account.email}</td>
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
  );
};

export default RBBotAccountTable;
