import React from 'react';
import Navbar from '../Shared/Navbar'; // استيراد الـ Navbar
import Sidebar from '../Shared/Sidebar'; // استيراد الـ Sidebar
import RBBotAccountTable from './RBBotAccountTable';
import RBBotAccountForm from './RBBotAccountForm'; // استيراد نموذج RBBotAccount

const RBBotAccountsPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        
        <main className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-4">RBBot Accounts</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Add New RBBot Account</h2>
            <RBBotAccountForm /> {/* إضافة النموذج هنا */}
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Account List</h2>
            <RBBotAccountTable />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RBBotAccountsPage;
