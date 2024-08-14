import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AccountForm from '../Forms/AccountForm';
import AccountTable from '../Tables/AccountTable';
import AccountTotals from './AccountTotals';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import './AccountsPage.css';
import { apiUrl } from '../../config';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const buttonVariants = {
  hover: { scale: 1.1, color: '#005bb5', transition: { duration: 0.3 } },
};

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
    <div 
      style={{ 
        backgroundImage: 'url("https://example.com/path/to/your/background.jpg")', // Replace with your background image URL
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <motion.div 
          className="content p-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h1 className="header">Accounts</h1>
          {error && <p className="error-message">{error}</p>}
          <motion.div 
            className="card"
            variants={cardVariants}
          >
            <div className="card-header">
              <h2>Account Form</h2>
              <motion.button
                onClick={() => setShowForm(!showForm)}
                className="toggle-button"
                variants={buttonVariants}
                whileHover="hover"
              >
                {showForm ? (
                  <FaArrowUp className="mr-2" />
                ) : (
                  <FaArrowDown className="mr-2" />
                )}
              </motion.button>
            </div>
            {showForm && <AccountForm account={selectedAccount} />}
          </motion.div>
          <motion.div 
            className="card mt-6"
            variants={cardVariants}
          >
            <div className="card-header">
              <h2>Accounts List</h2>
              <motion.button
                onClick={() => setShowTable(!showTable)}
                className="toggle-button"
                variants={buttonVariants}
                whileHover="hover"
              >
                {showTable ? (
                  <FaArrowUp className="mr-2" />
                ) : (
                  <FaArrowDown className="mr-2" />
                )}
              </motion.button>
            </div>
            {showTable && <AccountTable accounts={accounts} onAccountSelect={handleAccountSelect} />}
          </motion.div>
          <motion.div 
            className="mt-6"
            variants={cardVariants}
          >
            <AccountTotals accountsData={{ accounts }} employees={employees} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountsPage;
