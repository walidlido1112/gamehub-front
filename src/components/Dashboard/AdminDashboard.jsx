import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AccountTotals from '../Accounts/AccountTotals';
import OrdersTotal from '../Orders/OrderTotals';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import FinishedTables from '../../pages/FinishedTables';
import './AdminDashboard.css';
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

const AdminDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [finishedTables, setFinishedTables] = useState([]);
  const [error, setError] = useState('');
  const [showAccounts, setShowAccounts] = useState(true);
  const [showOrders, setShowOrders] = useState(true);
  const [showFinishedTables, setShowFinishedTables] = useState(true);

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

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/orders`);
        console.log('Fetched orders:', data);
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('Orders data is not an array:', data);
          setError('Orders data format is incorrect.');
        }
      } catch (error) {
        setError('Failed to fetch orders.');
        console.error('Failed to fetch orders:', error);
      }
    };

    const fetchEmployees = async () => {
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

    const fetchFinishedTables = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/tables`);
        if (Array.isArray(data)) {
          setFinishedTables(data);
        } else {
          console.error('Finished tables data is not an array:', data);
          setError('Finished tables data format is incorrect.');
        }
      } catch (error) {
        setError('Failed to fetch finished tables.');
        console.error('Failed to fetch finished tables:', error);
      }
    };

    fetchAccounts();
    fetchOrders();
    fetchEmployees();
    fetchFinishedTables();
  }, []);

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
          <h1 className="header">Admin Dashboard</h1>
          {error && <p className="error-message">{error}</p>}

          <motion.div 
            className="card"
            variants={cardVariants}
          >
            <div className="card-header">
              <h2>Accounts</h2>
              <motion.button
                onClick={() => setShowAccounts(!showAccounts)}
                className="toggle-button"
                variants={buttonVariants}
                whileHover="hover"
              >
                {showAccounts ? (
                  <FaArrowUp className="mr-2" />
                ) : (
                  <FaArrowDown className="mr-2" />
                )}
              </motion.button>
            </div>
            {showAccounts && (
              <div className="mt-6">
                <AccountTotals accountsData={{ accounts }} employees={employees} />
              </div>
            )}
          </motion.div>

          <motion.div 
            className="card mt-6"
            variants={cardVariants}
          >
            <div className="card-header">
              <h2>Orders</h2>
              <motion.button
                onClick={() => setShowOrders(!showOrders)}
                className="toggle-button"
                variants={buttonVariants}
                whileHover="hover"
              >
                {showOrders ? (
                  <FaArrowUp className="mr-2" />
                ) : (
                  <FaArrowDown className="mr-2" />
                )}
              </motion.button>
            </div>
            {showOrders && (
              <div className="mt-6">
                <OrdersTotal orders={orders} />
                <div className="orders-list mt-4">
                  {/* Add additional content here if needed */}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div 
            className="card mt-6"
            variants={cardVariants}
          >
            <div className="card-header">
              <h2>Finished Tables</h2>
              <motion.button
                onClick={() => setShowFinishedTables(!showFinishedTables)}
                className="toggle-button"
                variants={buttonVariants}
                whileHover="hover"
              >
                {showFinishedTables ? (
                  <FaArrowUp className="mr-2" />
                ) : (
                  <FaArrowDown className="mr-2" />
                )}
              </motion.button>
            </div>
            {showFinishedTables && (
              <div className="mt-6">
                <FinishedTables tables={finishedTables} onDeleteTable={() => { /* Add delete handler if needed */ }} />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
