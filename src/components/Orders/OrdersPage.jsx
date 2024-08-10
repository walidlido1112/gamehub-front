import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderForm from '../Forms/OrderForm';
import OrderTable from '../Tables/OrderTable';
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar';
import './OrdersPage.css';
import OrderTotals from '../Orders/OrderTotals';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

import { apiUrl } from '../../config'; // استيراد apiUrl

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [showTable, setShowTable] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/orders`);
      setOrders(data);
    } catch (error) {
      setError('Failed to fetch orders');
      console.error('Failed to fetch orders', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      if (selectedOrder) {
        await axios.put(`${apiUrl}/orders/${updatedOrder._id}`, updatedOrder);
        setOrders(orders.map(order => order._id === updatedOrder._id ? updatedOrder : order));
      } else {
        const { data } = await axios.post(`${apiUrl}/orders`, updatedOrder);
        setOrders([...orders, data]);
      }
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update order', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`${apiUrl}/orders/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Failed to delete order', error);
    }
  };

  const toggleForm = () => setShowForm(!showForm);
  const toggleTable = () => setShowTable(!showTable);

  return (
    <div className="orders-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <OrderTotals orders={orders} />
        <div className="content">
          <h1 className="header">Orders</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="card">
            <div className="card-header">
              <h2>Order Form</h2>
              <button onClick={toggleForm} className="toggle-button">
                {showForm ? <FaChevronUp className="icon" /> : <FaChevronDown className="icon" />}
              </button>
            </div>
            <div className={showForm ? 'visible-content' : 'hidden-content'}>
              <OrderForm 
                order={selectedOrder} 
                onUpdateOrder={handleUpdateOrder} 
                onClose={() => setSelectedOrder(null)}
              />
            </div>
          </div>
          <div className="card mt-6">
            <div className="card-header">
              <h2>Orders List</h2>
              <button onClick={toggleTable} className="toggle-button">
                {showTable ? <FaChevronUp className="icon" /> : <FaChevronDown className="icon" />}
              </button>
            </div>
            <div className={showTable ? 'visible-content' : 'hidden-content'}>
              <OrderTable 
                orders={orders}
                onEdit={setSelectedOrder} 
                onDelete={handleDeleteOrder} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
