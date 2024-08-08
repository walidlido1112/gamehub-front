import React from 'react';

const AccountTotals = ({ accounts, users }) => {
  // حساب عدد الحسابات المكتملة
  const completedAccountsCount = accounts.filter(account => account.status === 'completed').length;

  // تحديد اسم الموظف الذي لديه أكبر عدد من الحسابات المكتملة
  const employeeCounts = accounts.reduce((counts, account) => {
    if (account.status === 'completed') {
      counts[account.employeeName] = (counts[account.employeeName] || 0) + 1;
    }
    return counts;
  }, {});

  const topEmployee = Object.entries(employeeCounts).reduce((max, [name, count]) => {
    if (count > max.count) {
      return { name, count };
    }
    return max;
  }, { name: 'N/A', count: 0 });

  return (
    <div className="p-6 bg-white border border-gray-300 rounded-md shadow-md">
      <h3 className="text-xl font-semibold mb-4">Account Totals</h3>
      <p className="mb-2 text-gray-700">
        <strong>Total Completed Accounts:</strong> {completedAccountsCount}
      </p>
      <p className="text-gray-700">
        <strong>Top Employee with Completed Accounts:</strong> {topEmployee.name} ({topEmployee.count})
      </p>
    </div>
  );
};

export default AccountTotals;
