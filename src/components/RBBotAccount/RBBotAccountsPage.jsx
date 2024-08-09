import React from 'react';
import RBBotAccountTable from './RBBotAccountTable';
import RBBotAccountForm from './RBBotAccountForm'; // Import the new form component

const RBBotAccountsPage = () => {
  return (
    <div>
      <h1>RBBot Accounts</h1>
      <RBBotAccountForm /> {/* Add the form component here */}
      <RBBotAccountTable />
    </div>
  );
};

export default RBBotAccountsPage;
