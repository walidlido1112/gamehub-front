import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import AccountForm from '../Forms/AccountForm';
import AccountTable from '../Tables/AccountTable';
import AccountTotals from './AccountTotals';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import './AccountsPage.css';
import { apiUrl } from '../../config';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/accounts`);
        if (data && Array.isArray(data.accounts)) {
          setAccounts(data.accounts);
        } else {
          console.error('Accounts data is not an array:', data);
          setError('Accounts data format is incorrect.');
        }
      } catch (error) {
        setError('Failed to fetch accounts.');
        console.error('Failed to fetch accounts:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/users`);
        if (Array.isArray(data)) {
          const filteredEmployees = data.filter(user => user.role === 'EMPLOYEEROLE');
          setEmployees(filteredEmployees);
        } else {
          console.error('Users data is not an array:', data);
          setError('Users data format is incorrect.');
        }
      } catch (error) {
        setError('Failed to fetch users.');
        console.error('Failed to fetch users:', error);
      }
    };

    fetchAccounts();
    fetchUsers();
  }, []);

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  return (
    <div className="accounts-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content p-6">
          <h1 className="header">Accounts</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="card">
            <div className="card-header">
              <h2>Account Form</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="toggle-button"
              >
                {showForm ? (
                  <>
                    <FaArrowUp className="mr-2" /> Hide Form
                  </>
                ) : (
                  <>
                    <FaArrowDown className="mr-2" /> Show Form
                  </>
                )}
              </button>
            </div>
            {showForm && <AccountForm account={selectedAccount} />}
          </div>
          <div className="card mt-6">
            <div className="card-header">
              <h2>Accounts List</h2>
              <button
                onClick={() => setShowTable(!showTable)}
                className="toggle-button"
              >
                {showTable ? (
                  <>
                    <FaArrowUp className="mr-2" /> Hide Table
                  </>
                ) : (
                  <>
                    <FaArrowDown className="mr-2" /> Show Table
                  </>
                )}
              </button>
            </div>
            {showTable && <AccountTable accounts={accounts} onAccountSelect={handleAccountSelect} />}
          </div>
          <div className="mt-6">
            <AccountTotals accountsData={{ accounts }} employees={employees} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
