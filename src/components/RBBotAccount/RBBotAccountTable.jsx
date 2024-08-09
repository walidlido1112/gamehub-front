import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RBBotAccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/rb-bot-accounts`);
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
        await axios.put(`${process.env.REACT_APP_API_URL}/rb-bot-accounts/${selectedAccount._id}`, formData);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/rb-bot-accounts`, formData);
      }
      setSelectedAccount(null);
      setSearchQuery('');
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/rb-bot-accounts`);
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
