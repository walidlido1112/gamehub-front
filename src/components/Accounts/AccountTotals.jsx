import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaListAlt, FaUsers, FaBox, FaSearch } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root'); // Set the root element for accessibility

const AccountTotals = ({ data }) => {
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [psPrice, setPsPrice] = useState(0);
  const [pcPrice, setPcPrice] = useState(0);

  if (!data || !Array.isArray(data.accounts) || !Array.isArray(data.employees)) {
    console.error('Data is not in the expected format:', data);
    return <div>No data available</div>;
  }

  const { accounts, employees } = data;

  const psAccounts = accounts.filter(account => account.type === 'ps');
  const pcAccounts = accounts.filter(account => account.type === 'pc');
  const completedAccounts = accounts.filter(account => account.status === 'completed');

  const totalPsQuantity = psAccounts.reduce((acc, account) => acc + account.quantity, 0);
  const totalPcQuantity = pcAccounts.reduce((acc, account) => acc + account.quantity, 0);

  const employeeRole = 'employee'; // Ensure this matches your system's role value
  const filteredEmployees = employees.filter(employee => employee.role === employeeRole);

  const totalEmployees = filteredEmployees.length;
  const inProgressCount = accounts.filter(account => account.status === 'in progress').length;
  const completedCount = completedAccounts.length;
  const totalSearches = accounts.reduce((acc, account) => acc + account.searchCount, 0);

  const handleDetailClick = (detailType) => {
    let detailData = [];
    let totalPrice = 0;

    switch (detailType) {
      case 'psAccounts':
        detailData = psAccounts
          .map(account => {
            const price = (account.quantity * psPrice / 1000).toFixed(2);
            totalPrice += parseFloat(price);
            return {
              email: account.email,
              quantity: account.quantity,
              price: price
            };
          })
          .sort((a, b) => b.quantity - a.quantity);
        break;
      case 'pcAccounts':
        detailData = pcAccounts
          .map(account => {
            const price = (account.quantity * pcPrice / 1000).toFixed(2);
            totalPrice += parseFloat(price);
            return {
              email: account.email,
              quantity: account.quantity,
              price: price
            };
          })
          .sort((a, b) => b.quantity - a.quantity);
        break;
      case 'completedAccounts':
        detailData = completedAccounts
          .map(account => ({
            email: account.email,
            employee: account.employeeName || 'N/A'
          }));
        break;
      case 'totalPsQuantity':
        detailData = psAccounts
          .map(account => {
            const price = (account.quantity * psPrice / 1000).toFixed(2);
            totalPrice += parseFloat(price);
            return {
              email: account.email,
              quantity: account.quantity,
              price: price
            };
          })
          .sort((a, b) => b.quantity - a.quantity);
        break;
      case 'totalPcQuantity':
        detailData = pcAccounts
          .map(account => {
            const price = (account.quantity * pcPrice / 1000).toFixed(2);
            totalPrice += parseFloat(price);
            return {
              email: account.email,
              quantity: account.quantity,
              price: price
            };
          })
          .sort((a, b) => b.quantity - a.quantity);
        break;
      case 'totalEmployees':
        detailData = filteredEmployees
          .map(employee => ({
            name: employee.name
          }));
        break;
      case 'inProgressCount':
        detailData = accounts
          .filter(account => account.status === 'in progress')
          .map(account => ({
            email: account.email,
            employee: account.employeeName || 'N/A'
          }));
        break;
      case 'totalSearches':
        detailData = accounts
          .map(account => ({
            email: account.email,
            searchCount: account.searchCount
          }))
          .sort((a, b) => b.searchCount - a.searchCount);
        break;
      default:
        detailData = [];
    }

    setSelectedDetail({ type: detailType, data: detailData, totalPrice: totalPrice });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDetail(null);
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-lg mb-4">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <FaListAlt className="text-blue-500 mr-2" />
        Account Totals
      </h3>
      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">PS Price:</label>
          <input
            type="number"
            value={psPrice}
            onChange={(e) => setPsPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 font-medium mb-2">PC Price:</label>
          <input
            type="number"
            value={pcPrice}
            onChange={(e) => setPcPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
      <div className="flex flex-wrap space-x-4">
        <div 
          className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('completedAccounts')}
        >
          <div className="flex items-center">
            <FaListAlt className="text-green-500 mr-3" />
            <span className="font-medium text-gray-700">Completed Accounts:</span>
          </div>
          <span className="text-gray-900 font-semibold">{completedAccounts.length}</span>
        </div>
        <div 
          className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('totalPsQuantity')}
        >
          <div className="flex items-center">
            <FaBox className="text-red-500 mr-3" />
            <span className="font-medium text-gray-700">Total PS Quantity:</span>
          </div>
          <span className="text-gray-900 font-semibold">{totalPsQuantity}</span>
        </div>
        <div 
          className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('totalPcQuantity')}
        >
          <div className="flex items-center">
            <FaBox className="text-purple-500 mr-3" />
            <span className="font-medium text-gray-700">Total PC Quantity:</span>
          </div>
          <span className="text-gray-900 font-semibold">{totalPcQuantity}</span>
        </div>
        <div 
          className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('totalEmployees')}
        >
          <div className="flex items-center">
            <FaUsers className="text-teal-500 mr-3" />
            <span className="font-medium text-gray-700">Total Employees:</span>
          </div>
          <span className="text-gray-900 font-semibold">{totalEmployees}</span>
        </div>
        <div 
          className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('inProgressCount')}
        >
          <div className="flex items-center">
            <FaListAlt className="text-blue-500 mr-3" />
            <span className="font-medium text-gray-700">In Progress:</span>
          </div>
          <span className="text-gray-900 font-semibold">{inProgressCount}</span>
        </div>
        <div 
          className="flex-1 bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('totalSearches')}
        >
          <div className="flex items-center">
            <FaSearch className="text-gray-500 mr-3" />
            <span className="font-medium text-gray-700">Total Searches:</span>
          </div>
          <span className="text-gray-900 font-semibold">{totalSearches}</span>
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Details">
        <h2 className="text-2xl font-bold mb-4">Detail View</h2>
        {selectedDetail ? (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{selectedDetail.type.replace(/([A-Z])/g, ' $1')}</h3>
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    {Object.keys(selectedDetail.data[0] || {}).map((key) => (
                      <th key={key} className="py-2 px-4 border-b">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedDetail.data.map((item, index) => (
                    <tr key={index}>
                      {Object.values(item).map((value, index) => (
                        <td key={index} className="py-2 px-4 border-b">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {selectedDetail.totalPrice > 0 && (
                <div className="mt-4">
                  <strong>Total Price:</strong> {selectedDetail.totalPrice.toFixed(2)}
                </div>
              )}
            </div>
            <button onClick={closeModal} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Close
            </button>
          </>
        ) : (
          <div>No details available</div>
        )}
      </Modal>
    </div>
  );
};

export default AccountTotals;
