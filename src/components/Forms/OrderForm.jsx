import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const OrderForm = ({ order }) => {
  const [formData, setFormData] = useState(order || {
    email: '',
    password: '',
    code: '',
    quantityRequested: '',
    status: 'shipping',
    orderPrice: '',
    totalPrice: '',
    user: ''
  });

  const [users, setUsers] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api/users');
        setUsers(data);
      } catch (error) {
        toast.error('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (formData.user) {
      const selectedUser = users.find(user => user._id === formData.user);
      setEmployeeName(selectedUser ? selectedUser.name : '');
    } else {
      setEmployeeName('');
    }
  }, [formData.user, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value };

      if (name === 'orderPrice' || name === 'quantityRequested') {
        newData.totalPrice = (newData.orderPrice || 0) * (newData.quantityRequested || 0);
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (order) {
        await axios.put(`https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api/orders/${order._id}`, formData);
        toast.success('Order updated successfully!');
      } else {
        await axios.post('https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api/orders', formData);
        toast.success('Order created successfully!');
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
          {order ? 'Update Order' : 'Create Order'}
        </h2>
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
            <label htmlFor="quantityRequested" className="block text-sm font-medium text-gray-700">Quantity Requested</label>
            <input
              type="number"
              id="quantityRequested"
              name="quantityRequested"
              value={formData.quantityRequested}
              onChange={handleChange}
              placeholder="Quantity Requested"
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
              <option value="shipped">Shipped</option>
              <option value="shipping">Shipping</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label htmlFor="orderPrice" className="block text-sm font-medium text-gray-700">Order Price</label>
            <input
              type="number"
              id="orderPrice"
              name="orderPrice"
              value={formData.orderPrice}
              onChange={handleChange}
              placeholder="Order Price"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">Total Price</label>
            <input
              type="number"
              id="totalPrice"
              name="totalPrice"
              value={formData.totalPrice}
              readOnly
              placeholder="Total Price"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700">User</label>
            <select
              id="user"
              name="user"
              value={formData.user}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">Employee Name</label>
            <input
              type="text"
              id="employeeName"
              name="employeeName"
              value={employeeName}
              readOnly
              placeholder="Employee Name"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
