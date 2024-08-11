import React, { useState } from 'react';
import { FaListAlt, FaBox, FaDollarSign, FaTimes } from 'react-icons/fa';

// Modal component for detailed view
const DetailModal = ({ title, content, onClose }) => {
  if (!content) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600">
          <FaTimes size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="space-y-4">
          {content.map((item, index) => (
            <div key={index} className="p-4 bg-gray-100 border border-gray-300 rounded-md shadow-sm">
              <p><strong>Email:</strong> {item.email}</p>
              <p><strong>Code:</strong> {item.code}</p>
              <p><strong>Quantity Requested:</strong> {item.quantityRequested}</p>
              <p><strong>Total Price:</strong> ${(item.totalPrice / 100).toFixed(2)}</p>
              {/* Add more fields if needed */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrderTotals = ({ orders }) => {
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Calculate total quantity, total price, and order count
  const totalQuantity = orders.reduce((acc, order) => acc + (order.quantityRequested || 0), 0);
  const totalPrice = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
  const orderCount = orders.length;

  const handleModalOpen = (title, content) => {
    setSelectedDetail({ title, content });
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-lg mb-4">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <FaListAlt className="text-blue-500 mr-2" />
        Order Totals
      </h3>
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
        <div
          className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer"
          onClick={() => handleModalOpen('Total Orders', orders)}
        >
          <div className="flex items-center">
            <FaListAlt className="text-green-500 mr-3" />
            <span className="font-medium text-gray-700">Total Orders:</span>
          </div>
          <span className="text-gray-900 font-semibold">{orderCount}</span>
        </div>
        <div
          className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer"
          onClick={() => handleModalOpen('Total Quantity', [{ quantityRequested: totalQuantity }])}
        >
          <div className="flex items-center">
            <FaBox className="text-yellow-500 mr-3" />
            <span className="font-medium text-gray-700">Total Quantity:</span>
          </div>
          <span className="text-gray-900 font-semibold">{totalQuantity}</span>
        </div>
        <div
          className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer"
          onClick={() => handleModalOpen('Total Price', [{ totalPrice }])}
        >
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

      {/* Display modal if detail is selected */}
      {selectedDetail && (
        <DetailModal
          title={selectedDetail.title}
          content={selectedDetail.content}
          onClose={() => setSelectedDetail(null)}
        />
      )}
    </div>
  );
};

export default OrderTotals;
