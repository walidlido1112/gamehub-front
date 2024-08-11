import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const statusColors = {
  'in progress': 'bg-blue-100 text-blue-800',
  'in testing': 'bg-orange-100 text-orange-800',
  'completed': 'bg-green-100 text-green-800',
  'on hold': 'bg-red-100 text-red-800',
};

const EmployeeDashboard = () => {
  const { user, loading, logout } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [showPassword, setShowPassword] = useState({}); // State for password visibility

  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/accounts', {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from localStorage
          },
        });
        console.log('Fetched Accounts:', response.data.accounts);

        // Ensure `user.id` and `account.employee` are defined
        const filteredAccounts = response.data.accounts.filter(account => 
          user.id && account.employee 
          ? account.employee.toString() === user.id.toString()
          : false
        );
        console.log('Filtered Accounts:', filteredAccounts);
        setAccounts(filteredAccounts);
      } catch (error) {
        console.error('Failed to fetch accounts:', error.response?.data || error.message);
        if (error.response?.status === 401) {
          // Handle unauthorized access
          window.location.href = '/login';
        }
      }
    };

    fetchAccounts();
  }, [user, loading]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/accounts/${id}`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Use token from localStorage
        },
      });
      console.log('Status updated:', response.data);
      setAccounts(accounts.map(account =>
        account._id === id ? response.data : account
      ));
    } catch (error) {
      console.error('Failed to update status:', error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token'); // Remove token on logout
    window.location.href = '/login';
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="container mx-auto p-4">
      {user && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              مرحبا، {user.name}!
            </h1>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4">حساباتك المخصصة</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">البريد الإلكتروني</th>
                <th className="py-2 px-4 text-left">كود</th>
                <th className="py-2 px-4 text-left">كلمة المرور</th>
                <th className="py-2 px-4 text-left">حالة</th>
                <th className="py-2 px-4 text-left">تعديل الحالة</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <tr key={account._id} className={`hover:bg-gray-50 ${statusColors[account.status] || 'bg-gray-50'}`}>
                    <td className="py-2 px-4 border-b">{account.email}</td>
                    <td className="py-2 px-4 border-b">{account.code}</td>
                    <td className="py-2 px-4 border-b flex items-center">
                      <input
                        type={showPassword[account._id] ? 'text' : 'password'}
                        value={account.password}
                        readOnly
                        className="border border-gray-300 rounded p-1 w-full"
                      />
                      <i
                        className={`fas ${showPassword[account._id] ? 'fa-eye-slash' : 'fa-eye'} ml-2 cursor-pointer`}
                        onClick={() => togglePasswordVisibility(account._id)}
                      ></i>
                    </td>
                    <td className="py-2 px-4 border-b">{account.status}</td>
                    <td className="py-2 px-4 border-b">
                      <select
                        value={account.status}
                        onChange={(e) => handleStatusChange(account._id, e.target.value)}
                        className="form-select border border-gray-300 rounded p-1"
                      >
                        <option value="in progress">In Progress</option>
                        <option value="in testing">In Testing</option>
                        <option value="completed">Completed</option>
                        <option value="on hold">On Hold</option>
                      </select>
                      <i className="fas fa-pencil-alt ml-2 text-blue-600 cursor-pointer"></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-2 px-4 text-center">لا توجد حسابات لعرضها.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EmployeeDashboard;
