import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import { toast } from 'react-toastify';
import UserTable from '../Tables/UserTable';
import AccountTable from '../Tables/AccountTable';
import './AdminDashboard.css'; // Ensure the CSS file exists

const API_URL = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [userError, setUserError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [showUsers, setShowUsers] = useState(true);
  const [showAccounts, setShowAccounts] = useState(true);

  const toggleUsers = () => setShowUsers(!showUsers);
  const toggleAccounts = () => setShowAccounts(!showAccounts);

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      setUserError('Failed to fetch users');
    }
  };

  // Function to fetch accounts
  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_URL}/accounts`);
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to fetch accounts');
      setAccountError('Failed to fetch accounts');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAccounts();
  }, []);

  return (
    <div className="admin-dashboard flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar className="sidebar w-64 bg-gray-800 text-white" />
        <div className="main-content flex-1 p-6 bg-gray-100">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Control</h1>

          {/* Display error messages if any */}
          {userError && <p className="text-red-500 mb-4">{userError}</p>}
          {accountError && <p className="text-red-500 mb-4">{accountError}</p>}

          <div className="space-y-6">
            <div className="card bg-white p-4 rounded-lg shadow-lg">
              <div className="card-header flex justify-between items-center">
                <h2 className="text-xl font-semibold">Users</h2>
                <button onClick={toggleUsers} className="toggle-button text-lg">
                  {showUsers ? '▲' : '▼'}
                </button>
              </div>
              <div className={showUsers ? 'visible-content' : 'hidden-content'}>
                <UserTable users={users} />
              </div>
            </div>

            <div className="card bg-white p-4 rounded-lg shadow-lg">
              <div className="card-header flex justify-between items-center">
                <h2 className="text-xl font-semibold">Accounts</h2>
                <button onClick={toggleAccounts} className="toggle-button text-lg">
                  {showAccounts ? '▲' : '▼'}
                </button>
              </div>
              <div className={showAccounts ? 'visible-content' : 'hidden-content'}>
                <AccountTable accounts={accounts} setAccounts={setAccounts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
