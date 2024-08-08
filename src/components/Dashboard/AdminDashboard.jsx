import React, { useEffect, useState } from 'react';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import { Link } from 'react-router-dom'; 
import './AdminDashboard.css';
import OrderTotals from '../Orders/OrderTotals';
import AccountTotals from '../Accounts/AccountTotals';

const AdminDashboard = () => {
  const [showOrderTotals, setShowOrderTotals] = useState(true);
  const [showAccountTotals, setShowAccountTotals] = useState(true);

  const toggleOrderTotals = () => setShowOrderTotals(!showOrderTotals);
  const toggleAccountTotals = () => setShowAccountTotals(!showAccountTotals);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1 justify-center items-center">
        <Sidebar />
        <main className="flex-1 p-6 bg-white shadow-md rounded-lg mx-64">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Admin Control</h1>

          <div className="mb-6 text-center">
            <Link to="/assign-role" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600">
              Assign Roles
            </Link>
          </div>

          <div className="space-y-6">
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
