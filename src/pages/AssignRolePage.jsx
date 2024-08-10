import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserTag, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Shared/Navbar'; // Adjust the path if needed
import Sidebar from '../components/Shared/Sidebar'; // Adjust the path if needed

import { apiUrl } from '../config'; // استيراد apiUrl

const AssignRolePage = () => {
  const [allUsers, setAllUsers] = useState([]); // Save all users
  const [users, setUsers] = useState([]); // Save only employees
  const [selectedUser, setSelectedUser] = useState('');
  const [role, setRole] = useState('');
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/users`);
        const allUsers = response.data;
        setAllUsers(allUsers);
        const employees = allUsers.filter(user => user.role === 'employee');
        setUsers(employees);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleAssignRole = async () => {
    try {
      console.log('Assigning role:', { userId: selectedUser, role });
      await axios.post(`${apiUrl}/assign-role`, { userId: selectedUser, role });
      alert('Role assigned successfully');
    } catch (error) {
      console.error('Failed to assign role:', error);
    }
  };

  const handleEditUser = async () => {
    try {
      if (!editUser) return;
      console.log('Editing user:', editUser);
      await axios.put(`${apiUrl}/users/${editUser._id}`, editUser);
      alert('User updated successfully');
      setEditUser(null);
      // Refresh users list
      const updatedUsers = await axios.get(`${apiUrl}/users`);
      setAllUsers(updatedUsers.data);
      const employees = updatedUsers.data.filter(user => user.role === 'employee');
      setUsers(employees);
    } catch (error) {
      console.error('Failed to edit user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!editUser) return;

    // Add confirmation dialog
    const confirmDelete = window.confirm(`Are you sure you want to delete user ${editUser.name}?`);
    if (!confirmDelete) return;

    try {
      console.log('Deleting user:', editUser._id);
      await axios.delete(`${apiUrl}/users/${editUser._id}`);
      alert('User deleted successfully');
      setEditUser(null);
      // Refresh users list
      const updatedUsers = await axios.get(`${apiUrl}/users`);
      setAllUsers(updatedUsers.data);
      const employees = updatedUsers.data.filter(user => user.role === 'employee');
      setUsers(employees);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          {/* Assign Role Section */}
          <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mb-10">
            <h1 className="text-2xl font-semibold mb-4 flex items-center">
              <FontAwesomeIcon icon={faUserTag} className="mr-2 text-blue-500" />
              Assign Role
            </h1>
            <div className="mb-4">
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                Select User
              </label>
              <select
                id="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                <option value="" disabled>Select a user</option>
                {allUsers.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FontAwesomeIcon icon={faUserTag} className="mr-2 text-gray-500" />
                Select Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                <option value="" disabled>Select a role</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              onClick={handleAssignRole}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Assign Role
            </button>
          </div>

          {/* Edit User Section */}
          <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FontAwesomeIcon icon={faEdit} className="mr-2 text-green-500" />
              Edit User
            </h2>
            <div className="mb-4">
              <label htmlFor="edit-user" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-500" />
                Select User to Edit
              </label>
              <select
                id="edit-user"
                value={editUser ? editUser._id : ''}
                onChange={(e) => {
                  const user = allUsers.find(u => u._id === e.target.value);
                  if (user) setEditUser(user);
                }}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                <option value="" disabled>Select a user</option>
                {allUsers.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
            </div>
            {editUser && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="edit-user-name" className="block text-sm font-medium text-gray-700 mb-2">
                      User Name
                    </label>
                    <input
                      id="edit-user-name"
                      type="text"
                      value={editUser.name}
                      onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-user-email" className="block text-sm font-medium text-gray-700 mb-2">
                      User Email
                    </label>
                    <input
                      id="edit-user-email"
                      type="email"
                      value={editUser.email}
                      onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                    />
                  </div>
                </div>
                <button
                  onClick={handleEditUser}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
                >
                  Update User
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mt-4 transition duration-150 ease-in-out"
                >
                  Delete User
                </button>
              </>
            )}
          </div>

          {/* Employees Table */}
          <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
              Employees
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => {
                          setEditUser(user);
                          handleDeleteUser();
                        }}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AssignRolePage;
