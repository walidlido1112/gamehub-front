import React from 'react';
import { FaListAlt, FaBox, FaDollarSign } from 'react-icons/fa';

const OrderTotals = ({ orders }) => {
  // Calculate total quantity, total price, and order count
  const totalQuantity = orders.reduce((acc, order) => acc + (order.quantityRequested || 0), 0);
  const totalPrice = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  const orderCount = orders.length;

  return (
    <div className="bg-white p-6 rounded-md shadow-lg mb-4">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <FaListAlt className="text-blue-500 mr-2" />
        Order Totals
      </h3>
      <div className="flex space-x-4">
        <div className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <FaListAlt className="text-green-500 mr-3" />
            <span className="font-medium text-gray-700">Total Orders:</span>
          </div>
          <span className="text-gray-900 font-semibold">{orderCount}</span>
        </div>
        <div className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <FaBox className="text-yellow-500 mr-3" />
            <span className="font-medium text-gray-700">Total Quantity:</span>
          </div>
          <span className="text-gray-900 font-semibold">{totalQuantity}</span>
        </div>
        <div className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <FaDollarSign className="text-red-500 mr-3" />
            <span className="font-medium text-gray-700">Total Price:</span>
          </div>
          <div className="flex items-center">
            <FaDollarSign className="text-red-500 mr-2" />
            <span className="text-gray-900 font-semibold">{(totalPrice / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTotals;
