import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const AccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    quantity: '',
    status: '',
    employee: '',
    searchCount: '',
    password: '',
    type: ''
  });
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [accountsPerPage] = useState(30);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showPassword, setShowPassword] = useState({});

  const API_URL = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';

  const fetchAccounts = async (page = 1) => {
    try {
      const { data } = await axios.get(`${API_URL}/accounts`, {
        params: {
          page,
          limit: accountsPerPage,
          search: searchQuery,
          employee: selectedEmployee,
          type: selectedType
        }
      });
      setAccounts(data.accounts || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/users`);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchAccounts(currentPage);
    fetchUsers();
  }, [currentPage, searchQuery, selectedEmployee, selectedType]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
    setCurrentPage(1);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/accounts/${editingAccount}`, formData);
      const updatedAccount = response.data;
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) => (acc._id === updatedAccount._id ? updatedAccount : acc))
      );
      setEditingAccount(null);
    } catch (error) {
      console.error('Failed to update account:', error);
    }
  };

  const handleDeleteClick = async (accountId) => {
    const confirmed = window.confirm('Are you sure you want to delete this account?');
    if (confirmed) {
      try {
        await axios.delete(`${API_URL}/accounts/${accountId}`);
        fetchAccounts(currentPage);
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const handleCheckboxChange = (e, accountId) => {
    const { checked } = e.target;
    setSelectedAccounts((prevSelected) =>
      checked
        ? [...prevSelected, accountId]
        : prevSelected.filter((id) => id !== accountId)
    );
  };

  const handleSelectAllChange = (e) => {
    const { checked } = e.target;
    setSelectAll(checked);
    setSelectedAccounts(checked ? accounts.map((acc) => acc._id) : []);
  };

  const handleDeleteSelected = async () => {
    const confirmed = window.confirm('Are you sure you want to delete selected accounts?');
    if (confirmed) {
      try {
        await Promise.all(selectedAccounts.map((accountId) =>
          axios.delete(`${API_URL}/accounts/${accountId}`)
        ));
        fetchAccounts(currentPage);
        setSelectedAccounts([]);
        setSelectAll(false);
      } catch (error) {
        console.error('Failed to delete selected accounts:', error);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (editingAccount) {
      const accountToEdit = accounts.find((account) => account._id === editingAccount);
      if (accountToEdit) {
        setFormData({
          email: accountToEdit.email || '',
          code: accountToEdit.code || '',
          quantity: accountToEdit.quantity || '',
          status: accountToEdit.status || '',
          employee: accountToEdit.employee || '',
          searchCount: accountToEdit.searchCount || '',
          password: accountToEdit.password || '',
          type: accountToEdit.type || ''
        });
      }
    }
  }, [editingAccount, accounts]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'in progress':
        return 'bg-blue-300';
      case 'in testing':
        return 'bg-orange-200';
      case 'completed':
        return 'bg-green-200';
      case 'on hold':
        return 'bg-red-200';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Account Management</h2>

      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 p-2 rounded-md w-full sm:w-1/3 mb-4 sm:mb-0"
        />
        <select
          value={selectedEmployee}
          onChange={handleEmployeeChange}
          className="border border-gray-300 p-2 rounded-md mb-4 sm:mb-0"
        >
          <option value="">All Employees</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="border border-gray-300 p-2 rounded-md mb-4 sm:mb-0"
        >
          <option value="">All Types</option>
          <option value="ps">PS</option>
          <option value="pc">PC</option>
        </select>
        <button
          onClick={handleDeleteSelected}
          className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          disabled={selectedAccounts.length === 0}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete Selected
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 p-4 text-left font-bold">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                  className="form-checkbox"
                />
              </th>
              <th className="border border-gray-300 p-4 text-left font-bold">#</th>
              <th className="border border-gray-300 p-4 text-left font-bold">Email</th>
              <th className="border border-gray-300 p-4 text-left font-bold">Password</th>
              <th className="border border-gray-300 p-4 text-left font-bold">Code</th>
              <th className="border border-gray-300 p-4 text-left font-bold">Quantity</th>
              <th className="border border-gray-300 p-4 text-left font-bold">Search Count</th>
              <th className="border border-gray-300 p-4 text-left font-bold">Employee</th>
              <th className="border border-gray-300 p-4 text-left font-bold">Type</th>
              <th className="border border-gray-300 p-4 text-left font-bold">Status</th>
              <th className="border border-gray-300 p-4 text-left font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={account._id} className={getStatusColor(account.status)}>
                <td className="border border-gray-300 p-2">
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account._id)}
                    onChange={(e) => handleCheckboxChange(e, account._id)}
                    className="form-checkbox"
                  />
                </td>
                <td className="border border-gray-300 p-2 font-bold">{index + 1}</td>
                <td className="border border-gray-300 p-2 font-bold">{account.email}</td>
                <td className="border border-gray-300 p-2">
                  {showPassword[account._id] ? account.password : '••••••••'}
                  <button
                    onClick={() => setShowPassword((prev) => ({
                      ...prev,
                      [account._id]: !prev[account._id]
                    }))}
                    className="ml-2 text-blue-500"
                  >
                    <FontAwesomeIcon icon={showPassword[account._id] ? faEyeSlash : faEye} />
                  </button>
                </td>
                <td className="border border-gray-300 p-2">{account.code}</td>
                <td className="border border-gray-300 p-2 font-medium">{account.quantity}</td>
                <td className="border border-gray-300 p-2">{account.searchCount}</td>
                <td className="border border-gray-300 p-2 font-bold">
                  {account.employeeName || 'N/A'}
                </td>
                <td className="border border-gray-300 p-2 font-medium">{account.type}</td>
                <td className="border border-gray-300 p-2 font-medium">{account.status}</td>
                <td className="border border-gray-300 p-2 flex space-x-2">
                  <button
                    onClick={() => setEditingAccount(account._id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(account._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4 sm:mb-0"
        >
          Previous
        </button>
        <span className="text-gray-700 mb-4 sm:mb-0">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next
        </button>
      </div>

      {editingAccount && (
        <div className="mt-6 bg-white p-6 border border-gray-300 rounded-md shadow-md">
          <h3 className="text-xl font-semibold mb-4">Edit Account</h3>
          <form onSubmit={handleUpdateAccount}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="border border-gray-300 p-2 rounded-md w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="code" className="block text-gray-700">Code</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleFormChange}
                className="border border-gray-300 p-2 rounded-md w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-gray-700">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleFormChange}
                className="border border-gray-300 p-2 rounded-md w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                className="border border-gray-300 p-2 rounded-md w-full"
                required
              >
                <option value="in progress">In Progress</option>
                <option value="in testing">In Testing</option>
                <option value="completed">Completed</option>
                <option value="on hold">On Hold</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="employee" className="block text-gray-700">Employee</label>
              <select
                id="employee"
                name="employee"
                value={formData.employee}
                onChange={handleFormChange}
                className="border border-gray-300 p-2 rounded-md w-full"
                required
              >
                <option value="">Select Employee</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="searchCount" className="block text-gray-700">Search Count</label>
              <input
                type="number"
                id="searchCount"
                name="searchCount"
                value={formData.searchCount}
                onChange={handleFormChange}
                className="border border-gray-300 p-2 rounded-md w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                className="border border-gray-300 p-2 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                className="border border-gray-300 p-2 rounded-md w-full"
                required
              >
                <option value="ps">PS</option>
                <option value="pc">PC</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="ml-4 bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccountTable;
