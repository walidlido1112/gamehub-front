import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    user: ''
  });
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch orders from the server
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  // Fetch users from the server
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  // Handle edit button click
  const handleEditClick = (order) => {
    setEditingOrder(order._id);
    setFormData({
      email: order.email,
      code: order.code,
      quantityRequested: order.quantityRequested,
      status: order.status,
      orderPrice: order.orderPrice,
      totalPrice: order.totalPrice,
      user: order.user || ''
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingOrder(null);
    setFormData({
      email: '',
      code: '',
      quantityRequested: '',
      status: '',
      orderPrice: '',
      totalPrice: '',
      user: ''
    });
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Update order
  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/orders/${editingOrder}`, formData);
      const updatedOrder = response.data;
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
      setEditingOrder(null);
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  // Handle delete button click
  const handleDeleteClick = async (orderId) => {
    const confirmed = window.confirm('Are you sure you want to delete this order?');
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e, orderId) => {
    const { checked } = e.target;
    setSelectedOrders((prevSelected) =>
      checked
        ? [...prevSelected, orderId]
        : prevSelected.filter((id) => id !== orderId)
    );
  };

  // Handle select all change
  const handleSelectAllChange = (e) => {
    const { checked } = e.target;
    setSelectAll(checked);
    setSelectedOrders(checked ? orders.map((order) => order._id) : []);
  };

  // Delete selected orders
  const handleDeleteSelected = async () => {
    const confirmed = window.confirm('Are you sure you want to delete the selected orders?');
    if (confirmed) {
      try {
        await Promise.all(selectedOrders.map((orderId) =>
          axios.delete(`http://localhost:5000/api/orders/${orderId}`)
        ));
        fetchOrders(); // Fetch orders again after deletion
        setSelectedOrders([]);
        setSelectAll(false);
      } catch (error) {
        console.error('Failed to delete selected orders:', error);
      }
    }
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
                />
              </td>
              <td className="border border-gray-300 p-4">
                {editingOrder === order._id ? (
                  <input
                    type="email"
                    name="email"
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
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="shipped">Shipped</option>
                    <option value="shipping">Shipping</option>
                    <option value="paid">Paid</option>
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
                    value={formData.user}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  order.userName || 'N/A'
                )}
              </td>
              <td className="border border-gray-300 p-4 text-center">
                {editingOrder === order._id ? (
                  <>
                    <button
                      onClick={handleUpdateOrder}
                      className="bg-green-500 text-white py-1 px-3 rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="ml-2 bg-gray-500 text-white py-1 px-3 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(order)}
                      className="bg-blue-500 text-white py-1 px-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(order._id)}
                      className="ml-2 bg-red-500 text-white py-1 px-3 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                  </>
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
