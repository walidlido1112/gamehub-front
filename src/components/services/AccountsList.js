import React, { useState, useEffect } from 'react';
import { fetchAccounts } from './services/accountService'; // المسار حسب موقع الملف

const AccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await fetchAccounts();
        setAccounts(data);
      } catch (error) {
        setError(error.message); // تعيين الرسالة المناسبة في حالة حدوث خطأ
      }
    };

    loadAccounts();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Accounts List</h1>
      <ul>
        {accounts.map((account) => (
          <li key={account._id}>{account.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default AccountsList;
