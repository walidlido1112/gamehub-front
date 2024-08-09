import React from 'react';
import RBBotAccountTable from './RBBotAccountTable';
import RBBotAccountForm from './RBBotAccountForm'; // Import the new form component

const RBBotAccountsPage = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">RBBot Accounts</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Add New RBBot Account</h2>
        <RBBotAccountForm /> {/* Add the form component here */}
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Account List</h2>
        <RBBotAccountTable />
      </div>
    </div>
  );
};

export default RBBotAccountsPage;
