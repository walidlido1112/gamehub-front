import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import { toast } from 'react-toastify';
import AccountTotals from '../Accounts/AccountTotals'; // Import AccountTotals
import OrderTotals from '../Orders/OrderTotals'; // Import OrderTotals
import './AdminDashboard.css'; // Ensure the CSS file exists
import { apiUrl } from '../../config'; // Import apiUrl

const AdminDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [accountError, setAccountError] = useState('');
  const [orderError, setOrderError] = useState('');

  // Function to fetch accounts
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/accounts`);
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to fetch accounts');
      setAccountError('Failed to fetch accounts');
    }
  };

  // Function to fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/orders`);
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to fetch orders');
      setOrderError('Failed to fetch orders');
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchOrders();
  }, []);

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="flex">
        <Sidebar className="sidebar" />
        <div className="main-content">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Control</h1>

          {/* Display error messages if any */}
          {accountError && <p className="text-red-500 mb-4">{accountError}</p>}
          {orderError && <p className="text-red-500 mb-4">{orderError}</p>}

          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold">Account Totals</h2>
              </div>
              <div className="card-content">
                <AccountTotals accounts={accounts} />
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="text-xl font-semibold">Order Totals</h2>
              </div>
              <div className="card-content">
                <OrderTotals orders={orders} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
