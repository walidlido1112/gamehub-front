import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import AccountForm from '../Forms/AccountForm';
import AccountTable from '../Tables/AccountTable';
import AccountTotals from './AccountTotals'; // تأكد من صحة المسار
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import './AccountsPage.css';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await axios.get('https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api/accounts');
        if (Array.isArray(data)) {
          setAccounts(data);
        } else {
          console.error('Accounts data is not an array:', data);
        }
      } catch (error) {
        setError('Failed to fetch accounts');
        console.error('Failed to fetch accounts', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api/users');
        // Assuming data is an array of users
        if (Array.isArray(data)) {
          // تصفية المستخدمين الذين لديهم دور EMPLOYEEROLE
          const filteredEmployees = data.filter(user => user.role === 'EMPLOYEEROLE');
          setEmployees(filteredEmployees);
        } else {
          console.error('Users data is not an array:', data);
        }
      } catch (error) {
        setError('Failed to fetch users');
        console.error('Failed to fetch users', error);
      }
    };

    fetchAccounts();
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <AccountTotals accounts={accounts} employees={employees} />
          </div>
          
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {showForm ? (
                <>
                  <FaArrowUp className="mr-2" /> Hide Form
                </>
              ) : (
                <>
                  <FaArrowDown className="mr-2" /> Show Form
                </>
              )}
            </button>
            <button
              onClick={() => setShowTable(!showTable)}
              className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              {showTable ? (
                <>
                  <FaArrowUp className="mr-2" /> Hide Table
                </>
              ) : (
                <>
                  <FaArrowDown className="mr-2" /> Show Table
                </>
              )}
            </button>
          </div>

          {showForm && <AccountForm />}
          {showTable && <AccountTable accounts={accounts} />}
        </main>
      </div>
    </div>
  );
};

export default AccountsPage;
