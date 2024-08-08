import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AccountForm = ({ account }) => {
  const [formData, setFormData] = useState(account || {
    email: '',
    password: '',
    code: '',
    quantity: '',
    searchCount: '',
    status: 'in progress',
    employee: '', // Change 'employee' to 'user'
    employeeName: '', // Display employee's name
    type: '' // New field for account type
  });
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/users');
        // Filter users to only include employees
        const employees = data.filter(user => user.role === 'employee');
        setUsers(employees);
      } catch (error) {
        setUserError('Failed to fetch users');
        console.error('Failed to fetch users', error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // If there is an account prop, set the form data
    if (account) {
      setFormData({
        ...account,
        employeeName: account.employeeName || '' // Ensure employeeName is set
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedUser = users.find(user => user._id === formData.employee);
      const updatedFormData = {
        ...formData,
        employeeName: selectedUser ? selectedUser.name : ''  // Set employeeName here
      };

      if (account) {
        await axios.put(`/api/accounts/${account._id}`, updatedFormData);
        toast.success('Account updated successfully!');
      } else {
        await axios.post('/api/accounts', updatedFormData);
        toast.success('Account created successfully!');
      }
      navigate('/dashboard');
    } catch (error) {
      toast.error('Operation failed.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {account ? 'Update Account' : 'Create Account'}
        </h2>
        {userError && <p className="text-red-500 text-center">{userError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Code"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="searchCount" className="block text-sm font-medium text-gray-700">Search Count</label>
            <input
              type="number"
              id="searchCount"
              name="searchCount"
              value={formData.searchCount}
              onChange={handleChange}
              placeholder="Search Count"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="in progress">In Progress</option>
              <option value="in testing">In Testing</option>
              <option value="completed">Completed</option>
              <option value="on hold">On Hold</option>
            </select>
          </div>

          <div>
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              id="employee"
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="">Select an employee</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Account Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="">Select Account Type</option>
              <option value="ps">PS</option>
              <option value="pc">PC</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {account ? 'Update Account' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
