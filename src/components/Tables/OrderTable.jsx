import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
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
    orderPrice: '',
    totalPrice: '',
    user: '',
    password: ''
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showPassword, setShowPassword] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);

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
      orderPrice: order.orderPrice,
      totalPrice: order.totalPrice,
      user: order.user || '',
      password: order.password || ''
    });
    setModalIsOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setFormData({
      email: '',
      code: '',
      quantityRequested: '',
      orderPrice: '',
      totalPrice: '',
      user: '',
      password: ''
    });
    setModalIsOpen(false);
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
      setModalIsOpen(false);
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
            <th className="border border-gray-300 p-4 text-left">Password</th>
            <th className="border border-gray-300 p-4 text-left">Code</th>
            <th className="border border-gray-300 p-4 text-left">Quantity Requested</th>
            <th className="border border-gray-300 p-4 text-left">Order Price</th>
            <th className="border border-gray-300 p-4 text-left">Total Price</th>
            <th className="border border-gray-300 p-4 text-left">User</th>
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
                  <input
                    type="number"
                    name="orderPrice"
                    id="orderPrice"
                    value={formData.orderPrice}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  `$${order.orderPrice}`
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
                  `$${order.totalPrice}`
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
                        {user.username}
                      </option>
                    ))}
                  </select>
                ) : (
                  order.user?.username || 'N/A'
                )}
              </td>
              <td className="border border-gray-300 p-4">
                <button
                  onClick={() => handleEditClick(order)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDeleteClick(order._id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Editing Order */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCancelEdit}
        contentLabel="Edit Order"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-2xl font-bold mb-4">Edit Order</h2>
        <form onSubmit={handleUpdateOrder}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword[editingOrder] ? 'text' : 'password'}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(editingOrder)}
              className="absolute right-2 top-2"
            >
              <FontAwesomeIcon icon={showPassword[editingOrder] ? faEye : faEyeSlash} />
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              name="code"
              id="code"
              value={formData.code}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantityRequested" className="block text-sm font-medium text-gray-700">Quantity Requested</label>
            <input
              type="number"
              name="quantityRequested"
              id="quantityRequested"
              value={formData.quantityRequested}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="orderPrice" className="block text-sm font-medium text-gray-700">Order Price</label>
            <input
              type="number"
              name="orderPrice"
              id="orderPrice"
              value={formData.orderPrice}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">Total Price</label>
            <input
              type="number"
              name="totalPrice"
              id="totalPrice"
              value={formData.totalPrice}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="user" className="block text-sm font-medium text-gray-700">User</label>
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
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OrderTable;
