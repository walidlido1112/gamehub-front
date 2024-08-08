import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import { toast } from 'react-toastify';
import UserTable from '../Tables/UserTable';
import EmployeeTable from '../Tables/EmployeeTable';
import AccountTable from '../Tables/AccountTable';
import { Link } from 'react-router-dom'; // استيراد Link
import './AdminDashboard.css'; // استيراد ملف CSS

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [userError, setUserError] = useState('');
  const [employeeError, setEmployeeError] = useState('');
  const [accountError, setAccountError] = useState('');
  const [showUsers, setShowUsers] = useState(true);
  const [showEmployees, setShowEmployees] = useState(true);
  const [showAccounts, setShowAccounts] = useState(true);

  const toggleUsers = () => setShowUsers(!showUsers);
  const toggleEmployees = () => setShowEmployees(!showEmployees);
  const toggleAccounts = () => setShowAccounts(!showAccounts);

  const apiUrl = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api'; // عنوان Heroku

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      setUsers(response.data);
    } catch (error) {
      toast.error('فشل في جلب المستخدمين');
      setUserError('فشل في جلب المستخدمين');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/employees`);
      setEmployees(response.data);
    } catch (error) {
      toast.error('فشل في جلب الموظفين');
      setEmployeeError('فشل في جلب الموظفين');
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/accounts`);
      setAccounts(response.data);
    } catch (error) {
      toast.error('فشل في جلب الأكوانتات');
      setAccountError('فشل في جلب الأكوانتات');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchEmployees();
    fetchAccounts();
  }, []);

  return (
    <div className="admin-dashboard">
      <Sidebar className="sidebar" />
      <div className="main-content">
        <Navbar />
        <div className="p-6 min-h-screen">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Control</h1>

          <div className="mb-6">
            <Link to="/assign-role" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600">
              Assign Roles
            </Link>
          </div>

          {userError && <p className="text-red-500 mb-4">{userError}</p>}
          {employeeError && <p className="text-red-500 mb-4">{employeeError}</p>}
          {accountError && <p className="text-red-500 mb-4">{accountError}</p>}

          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2>Users</h2>
                <button onClick={toggleUsers} className="toggle-button">
                  {showUsers ? '▲' : '▼'}
                </button>
              </div>
              <div className={showUsers ? 'visible-content' : 'hidden-content'}>
                <UserTable users={users} />
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Employee</h2>
                <button onClick={toggleEmployees} className="toggle-button">
                  {showEmployees ? '▲' : '▼'}
                </button>
              </div>
              <div className={showEmployees ? 'visible-content' : 'hidden-content'}>
                <EmployeeTable employees={employees} />
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Accounts</h2>
                <button onClick={toggleAccounts} className="toggle-button">
                  {showAccounts ? '▲' : '▼'}
                </button>
              </div>
              <div className={showAccounts ? 'visible-content' : 'hidden-content'}>
                <AccountTable accounts={accounts} setAccounts={setAccounts} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
