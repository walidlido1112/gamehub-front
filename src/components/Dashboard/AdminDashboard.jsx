import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import { toast } from 'react-toastify';
import UserTable from '../Tables/UserTable';
import OrderTotals from '../Orders/OrderTotals'; // استيراد OrderTotals
import AccountTotals from '../Accounts/AccountTotals'; // استيراد AccountTotals
import { Link } from 'react-router-dom'; // استيراد Link
import './AdminDashboard.css'; // استيراد ملف CSS

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState('');
  const [showUsers, setShowUsers] = useState(true);
  const [showOrderTotals, setShowOrderTotals] = useState(true);
  const [showAccountTotals, setShowAccountTotals] = useState(true);

  const toggleUsers = () => setShowUsers(!showUsers);
  const toggleOrderTotals = () => setShowOrderTotals(!showOrderTotals);
  const toggleAccountTotals = () => setShowAccountTotals(!showAccountTotals);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('فشل في جلب المستخدمين');
      setUserError('فشل في جلب المستخدمين');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-dashboard">
      <Sidebar className="sidebar" />
      <div className="main-content">
        <Navbar />
        <div className="p-6 min-h-screen">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Control</h1>

          <div className="mb-6">
            <Link to="/assign-role" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600">
              Assign Roles
            </Link>
          </div>

          {userError && <p className="text-red-500 mb-4">{userError}</p>}

          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2>Users</h2>
                <button onClick={toggleUsers} className="toggle-button">
                  {showUsers ? '▲' : '▼'}
                </button>
              </div>
              <div className={showUsers ? 'visible-content' : 'hidden-content'}>
                <UserTable users={users} />
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Order Totals</h2>
                <button onClick={toggleOrderTotals} className="toggle-button">
                  {showOrderTotals ? '▲' : '▼'}
                </button>
              </div>
              <div className={showOrderTotals ? 'visible-content' : 'hidden-content'}>
                <OrderTotals />
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Account Totals</h2>
                <button onClick={toggleAccountTotals} className="toggle-button">
                  {showAccountTotals ? '▲' : '▼'}
                </button>
              </div>
              <div className={showAccountTotals ? 'visible-content' : 'hidden-content'}>
                <AccountTotals />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
