import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import { toast } from 'react-toastify';
import UserTable from '../Tables/UserTable';
import OrderTotals from '../Orders/OrderTotals';
import AccountTotals from '../Accounts/AccountTotals';import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState('');
  const [showUsers, setShowUsers] = useState(true);
  const [showOrderTotals, setShowOrderTotals] = useState(true);
  const [showAccountTotals, setShowAccountTotals] = useState(true);

  const toggleUsers = () => setShowUsers(!showUsers);
  const toggleOrderTotals = () => setShowOrderTotals(!showOrderTotals);
  const toggleAccountTotals = () => setShowAccountTotals(!showAccountTotals);

  const apiUrl = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      setUsers(response.data || []);
    } catch (error) {
      toast.error('فشل في جلب المستخدمين');
      setUserError('فشل في جلب المستخدمين');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1 justify-center"> {/* هذا السطر لوضع المحتوى في المنتصف */}
        <Sidebar />
        <main className="flex-1 p-6 bg-white shadow-md rounded-lg ml-64">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Control</h1>

          <div className="mb-6">
            <Link to="/assign-role" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600">
              Assign Roles
            </Link>
          </div>

          {userError && <p className="text-red-500 mb-4">{userError}</p>}

          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-700">Users</h2>
                <button onClick={toggleUsers} className="text-blue-600 hover:text-blue-800 focus:outline-none">
                  {showUsers ? 'Hide ▲' : 'Show ▼'}
                </button>
              </div>
              {showUsers && <UserTable users={users} />}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-700">Order Totals</h2>
                <button onClick={toggleOrderTotals} className="text-blue-600 hover:text-blue-800 focus:outline-none">
                  {showOrderTotals ? 'Hide ▲' : 'Show ▼'}
                </button>
              </div>
              {showOrderTotals && <OrderTotals />}
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-700">Account Totals</h2>
                <button onClick={toggleAccountTotals} className="text-blue-600 hover:text-blue-800 focus:outline-none">
                  {showAccountTotals ? 'Hide ▲' : 'Show ▼'}
                </button>
              </div>
              {showAccountTotals && <AccountTotals />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
