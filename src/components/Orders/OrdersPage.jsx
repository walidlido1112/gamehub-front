import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderForm from '../Forms/OrderForm'; // Ensure the path is correct
import OrderTable from '../Tables/OrderTable'; // Ensure the path is correct
import Navbar from '../Shared/Navbar';
import Sidebar from '../Shared/Sidebar'; // Adjust the path as needed
import './OrdersPage.css'; // Import the CSS file
import OrderTotals from '../Orders/OrderTotals'; // Ensure the path is correct
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'; // Added icons for toggling

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [showTable, setShowTable] = useState(true);

  // Fetch orders from the server
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders');
      setOrders(data);
    } catch (error) {
      setError('Failed to fetch orders');
      console.error('Failed to fetch orders', error);
    }
  };

  // Fetch orders initially and then every 5 seconds
  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const handleUpdateOrder = async (updatedOrder) => {
    try {
      if (selectedOrder) {
        await axios.put(`/api/orders/${updatedOrder._id}`, updatedOrder);
        setOrders(orders.map(order => order._id === updatedOrder._id ? updatedOrder : order));
      } else {
        const { data } = await axios.post('/api/orders', updatedOrder);
        setOrders([...orders, data]);
      }
      setSelectedOrder(null);
    } catch (error) {
      console.error('Failed to update order', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`/api/orders/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Failed to delete order', error);
    }
  };

  const toggleForm = () => setShowForm(!showForm);
  const toggleTable = () => setShowTable(!showTable);

  return (
    <div className="orders-page">
      <Sidebar className="sidebar" />
      <div className="main-content">
        <Navbar />
        <OrderTotals orders={orders} />

        <div className="p-6 min-h-screen">
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
