import React, { useState } from 'react';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import RBBotAccountTable from './RBBotAccountTable';
import RBBotAccountForm from './RBBotAccountForm';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import './RBBotAccountsPage.css';

const RBBotAccountsPage = () => {
  const [showForm, setShowForm] = useState(true);
  const [showTable, setShowTable] = useState(true);

  const toggleForm = () => setShowForm(!showForm);
  const toggleTable = () => setShowTable(!showTable);

  return (
    <div className="rbbot-accounts-page flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="w-64" />

      <div className="main-content flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        
        <main className="content p-6 flex-1 overflow-y-auto">
          <div className="container mx-auto">
            <h1 className="header text-4xl font-bold mb-8 text-center text-gray-800">
              RBBot Accounts Management
            </h1>

            <div className="card bg-white shadow-lg rounded-lg p-6 mb-8 max-w-3xl mx-auto">
              <div className="card-header flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-gray-800">Add New RBBot Account</h2>
                <button onClick={toggleForm} className="text-gray-600 hover:text-gray-900 focus:outline-none">
                  {showForm ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
              {showForm && (
                <div className="card-content mt-4">
                  <RBBotAccountForm />
                </div>
              )}
            </div>

            <div className="card bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
              <div className="card-header flex justify-between items-center">
                <h2 className="text-3xl font-semibold text-gray-800">Account List</h2>
                <button onClick={toggleTable} className="text-gray-600 hover:text-gray-900 focus:outline-none">
                  {showTable ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>
              {showTable && (
                <div className="card-content mt-4">
                  <RBBotAccountTable />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RBBotAccountsPage;
