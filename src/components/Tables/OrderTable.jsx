import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { apiUrl } from '../../config';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    quantityRequested: '',
    status: '',
    orderPrice: '',
    totalPrice: '',
    user: '',
    password: '' // Add password field
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showPassword, setShowPassword] = useState({}); // Track visibility

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/orders`);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/users`);
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const handleEditClick = (order) => {
    setEditingOrder(order._id);
    setFormData({
      email: order.email,
      code: order.code,
      quantityRequested: order.quantityRequested,
      status: order.status,
      orderPrice: order.orderPrice,
      totalPrice: order.totalPrice,
      user: order.user || '',
      password: order.password || '' // Set password in form data
    });
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setFormData({
      email: '',
      code: '',
      quantityRequested: '',
      status: '',
      orderPrice: '',
      totalPrice: '',
      user: '',
      password: '' // Clear password field
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${apiUrl}/orders/${editingOrder}`, formData);
      const updatedOrder = response.data;
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
      setEditingOrder(null);
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleDeleteClick = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to delete this order?');
    if (confirmed) {
      try {
        await axios.delete(`${apiUrl}/orders/${orderId}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const handleCheckboxChange = (e, orderId) => {
    const { checked } = e.target;
    setSelectedOrders((prevSelected) =>
      checked
        ? [...prevSelected, orderId]
        : prevSelected.filter((id) => id !== orderId)
    );
  };

  const handleSelectAllChange = (e) => {
    const { checked } = e.target;
    setSelectAll(checked);
    setSelectedOrders(checked ? orders.map((order) => order._id) : []);
  };

  const handleDeleteSelected = async () => {
    const confirmed = window.confirm('Are you sure you want to delete the selected orders?');
    if (confirmed) {
      try {
        await Promise.all(selectedOrders.map((orderId) =>
          axios.delete(`${apiUrl}/orders/${orderId}`)
        ));
        fetchOrders(); // Fetch orders again after deletion
        setSelectedOrders([]);
        setSelectAll(false);
      } catch (error) {
        console.error('Failed to delete selected orders:', error);
      }
    }
  };

  const togglePasswordVisibility = (orderId) => {
    setShowPassword((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Management</h2>

      <div className="mb-4 flex items-center">
        <button
          onClick={handleDeleteSelected}
          className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          disabled={selectedOrders.length === 0}
        >
          <FontAwesomeIcon icon={faTrash} className="mr-2" />
          Delete Selected
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-4 text-left">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
                className="mr-2"
                id="select-all"
              />
              Select All
            </th>
            <th className="border border-gray-300 p-4 text-left">Email</th>
            <th className="border border-gray-300 p-4 text-left">Code</th>
            <th className="border border-gray-300 p-4 text-left">Quantity Requested</th>
            <th className="border border-gray-300 p-4 text-left">Status</th>
            <th className="border border-gray-300 p-4 text-left">Order Price</th>
            <th className="border border-gray-300 p-4 text-left">Total Price</th>
            <th className="border border-gray-300 p-4 text-left">User</th>
            <th className="border border-gray-300 p-4 text-left">Password</th> {/* New column */}
            <th className="border border-gray-300 p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-4">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order._id)}
                  onChange={(e) => handleCheckboxChange(e, order._id)}
                  className="mr-2"
                  id={`checkbox-${order._id}`}
                />
              </td>
              <td className="border border-gray-300 p-4">
                {editingOrder === order._id ? (
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  order.email
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingOrder === order._id ? (
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  order.code
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingOrder === order._id ? (
                  <input
                    type="number"
                    name="quantityRequested"
                    id="quantityRequested"
                    value={formData.quantityRequested}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  order.quantityRequested
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingOrder === order._id ? (
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="shipped">Shipped</option>
                    <option value="pending">Pending</option>
                    <option value="delivered">Delivered</option>
                  </select>
                ) : (
                  order.status
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingOrder === order._id ? (
                  <input
                    type="number"
                    name="orderPrice"
                    id="orderPrice"
                    value={formData.orderPrice}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  order.orderPrice
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingOrder === order._id ? (
                  <input
                    type="number"
                    name="totalPrice"
                    id="totalPrice"
                    value={formData.totalPrice}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  order.totalPrice
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingOrder === order._id ? (
                  <select
                    name="user"
                    id="user"
                    value={formData.user}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  order.user
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingOrder === order._id ? (
                  <div className="relative">
                    <input
                      type={showPassword[order._id] ? 'text' : 'password'}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(order._id)}
                      className="absolute right-2 top-2"
                    >
                      <FontAwesomeIcon icon={showPassword[order._id] ? faEye : faEyeSlash} />
                    </button>
                  </div>
                ) : (
                  '••••••••••'
                )}
              </td>
              <td className="border border-gray-300 p-4">
                {editingOrder === order._id ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleUpdateOrder}
                      className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(order)}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(order._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
