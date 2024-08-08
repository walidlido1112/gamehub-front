import React from 'react';

const AccountTotals = ({ accounts }) => {
  const totalQuantity = accounts.reduce((acc, account) => acc + (account.quantity || 0), 0);
  const totalSearchCount = accounts.reduce((acc, account) => acc + (account.searchCount || 0), 0);

  return (
    <div className="mt-6 bg-white p-6 border border-gray-300 rounded-md shadow-md">
      <h3 className="text-xl font-semibold mb-4">Account Totals</h3>
      <div className="flex justify-between mb-4">
        <span className="text-gray-700 font-medium">Total Quantity:</span>
        <span className="text-gray-900">{totalQuantity}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-700 font-medium">Total Search Count:</span>
        <span className="text-gray-900">{totalSearchCount}</span>
      </div>
    </div>
  );
};

export default AccountTotals;
