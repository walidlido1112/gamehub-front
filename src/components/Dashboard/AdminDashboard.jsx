import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import AccountTotals from '../Accounts/AccountTotals';
import OrdersTotal from '../Orders/OrderTotals'; // Import OrdersTotal
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import './AdminDashboard.css';
import { apiUrl } from '../../config';

const AdminDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [showAccounts, setShowAccounts] = useState(true);
  const [showOrders, setShowOrders] = useState(true);

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

    fetchAccounts();
    fetchOrders();
    fetchEmployees();
  }, []);

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content p-6">
          <h1 className="header">Admin Dashboard</h1>
          {error && <p className="error-message">{error}</p>}

          <div className="card">
            <div className="card-header">
              <h2>Accounts</h2>
              <button
                onClick={() => setShowAccounts(!showAccounts)}
                className="toggle-button"
              >
                {showAccounts ? (
                  <>
                    <FaArrowUp className="mr-2" /> Hide Accounts
                  </>
                ) : (
                  <>
                    <FaArrowDown className="mr-2" /> Show Accounts
                  </>
                )}
              </button>
            </div>
            {showAccounts && (
              <div className="mt-6">
                <AccountTotals accountsData={{ accounts }} employees={employees} />
              </div>
            )}
          </div>

          <div className="card mt-6">
            <div className="card-header">
              <h2>Orders</h2>
              <button
                onClick={() => setShowOrders(!showOrders)}
                className="toggle-button"
              >
                {showOrders ? (
                  <>
                    <FaArrowUp className="mr-2" /> Hide Orders
                  </>
                ) : (
                  <>
                    <FaArrowDown className="mr-2" /> Show Orders
                  </>
                )}
              </button>
            </div>
            {showOrders && (
              <div className="mt-6">
                <OrdersTotal orders={orders} /> {/* Add OrdersTotal here */}
                <div className="orders-list mt-4">
                  
                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
