import React from 'react';
import Navbar from '../Shared/Navbar'; // استيراد الـ Navbar
import Sidebar from '../Shared/Sidebar'; // استيراد الـ Sidebar
import RBBotAccountTable from './RBBotAccountTable'; // استيراد جدول RBBotAccount
import RBBotAccountForm from './RBBotAccountForm'; // استيراد نموذج RBBotAccount

const RBBotAccountsPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="w-64" />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        <main className="p-6 flex-1 overflow-y-auto">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">RBBot Accounts</h1>

            <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New RBBot Account</h2>
              <RBBotAccountForm />
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Account List</h2>
              <RBBotAccountTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RBBotAccountsPage;
