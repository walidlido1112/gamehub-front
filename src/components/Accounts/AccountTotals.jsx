import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaListAlt, FaUsers, FaBox, FaSearch } from 'react-icons/fa';

Modal.setAppElement('#root'); // Set the root element for accessibility

const AccountTotals = ({ accountsData, employees }) => {
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [psPrice, setPsPrice] = useState(0);
  const [pcPrice, setPcPrice] = useState(0);

  // Ensure accountsData is defined and contains accounts
  const accounts = accountsData && accountsData.accounts ? accountsData.accounts : []; 

  const psAccounts = accounts.filter(account => account.type === 'ps');
  const pcAccounts = accounts.filter(account => account.type === 'pc');
  const completedAccounts = accounts.filter(account => account.status === 'completed');

  const totalPsQuantity = psAccounts.reduce((acc, account) => acc + account.quantity, 0);
  const totalPcQuantity = pcAccounts.reduce((acc, account) => acc + account.quantity, 0);

  const employeeRole = 'employee'; // Ensure this matches your system's role value
  const filteredEmployees = employees ? employees.filter(employee => employee.role === employeeRole) : [];

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
            return [
              account.email,
              account.quantity,
              price
            ];
          })
          .sort((a, b) => b[1] - a[1]); // Sort by quantity
        break;
      case 'pcAccounts':
        detailData = pcAccounts
          .map(account => {
            const price = (account.quantity * pcPrice / 1000).toFixed(2);
            totalPrice += parseFloat(price);
            return [
              account.email,
              account.quantity,
              price
            ];
          })
          .sort((a, b) => b[1] - a[1]); // Sort by quantity
        break;
      case 'completedAccounts':
        detailData = completedAccounts
          .map(account => [
            account.email,
            account.employeeName || 'N/A'
          ]);
        break;
      case 'totalPsQuantity':
        detailData = psAccounts
          .map(account => {
            const price = (account.quantity * psPrice / 1000).toFixed(2);
            totalPrice += parseFloat(price);
            return [
              account.email,
              account.quantity,
              price
            ];
          })
          .sort((a, b) => b[1] - a[1]); // Sort by quantity
        break;
      case 'totalPcQuantity':
        detailData = pcAccounts
          .map(account => {
            const price = (account.quantity * pcPrice / 1000).toFixed(2);
            totalPrice += parseFloat(price);
            return [
              account.email,
              account.quantity,
              price
            ];
          })
          .sort((a, b) => b[1] - a[1]); // Sort by quantity
        break;
      case 'totalEmployees':
        detailData = filteredEmployees
          .map(employee => [
            employee.name
          ]);
        break;
      case 'inProgressCount':
        detailData = accounts
          .filter(account => account.status === 'in progress')
          .map(account => [
            account.email,
            account.employeeName || 'N/A'
          ]);
        break;
      case 'totalSearches':
        detailData = accounts
          .map(account => [
            account.email,
            account.searchCount
          ])
          .sort((a, b) => b[1] - a[1]); // Sort by search count
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
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <FaListAlt className="text-blue-500 mr-3" />
        Account Totals
      </h3>
      <div className="mb-4 flex gap-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('completedAccounts')}
        >
          <div className="flex items-center">
            <FaListAlt className="text-green-500 mr-3 text-xl" />
            <span className="font-medium text-gray-700">Completed Accounts:</span>
          </div>
          <span className="text-gray-900 font-semibold">{completedAccounts.length}</span>
        </div>
        <div 
          className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('totalPsQuantity')}
        >
          <div className="flex items-center">
            <FaBox className="text-red-500 mr-3 text-xl" />
            <span className="font-medium text-gray-700">Total PS Quantity:</span>
          </div>
          <span className="text-gray-900 font-semibold">{totalPsQuantity}</span>
        </div>
        <div 
          className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('totalPcQuantity')}
        >
          <div className="flex items-center">
            <FaBox className="text-purple-500 mr-3 text-xl" />
            <span className="font-medium text-gray-700">Total PC Quantity:</span>
          </div>
          <span className="text-gray-900 font-semibold">{totalPcQuantity}</span>
        </div>
        <div 
          className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('totalEmployees')}
        >
          <div className="flex items-center">
            <FaUsers className="text-teal-500 mr-3 text-xl" />
            <span className="font-medium text-gray-700">Total Employees:</span>
          </div>
          <span className="text-gray-900 font-semibold">{totalEmployees}</span>
        </div>
        <div 
          className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('inProgressCount')}
        >
          <div className="flex items-center">
            <FaListAlt className="text-yellow-500 mr-3 text-xl" />
            <span className="font-medium text-gray-700">In Progress Accounts:</span>
          </div>
          <span className="text-gray-900 font-semibold">{inProgressCount}</span>
        </div>
        <div 
          className="bg-gray-100 p-4 rounded-md shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleDetailClick('totalSearches')}
        >
          <div className="flex items-center">
            <FaSearch className="text-indigo-500 mr-3 text-xl" />
            <span className="font-medium text-gray-700">Total Searches:</span>
          </div>
          <span className="text-gray-900 font-semibold">{totalSearches}</span>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 bg-white p-6 mx-auto max-w-lg rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Detail View</h2>
        {selectedDetail && (
          <>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-700">{selectedDetail.type}</h3>
              {selectedDetail.type === 'totalPsQuantity' || selectedDetail.type === 'totalPcQuantity' ? (
                <div>
                  {selectedDetail.data.map((item, index) => (
                    <div key={index} className="flex justify-between mb-2 text-gray-700">
                      <span>{item[0]}</span>
                      <span>{item[1]}</span>
                      <span>${item[2]}</span>
                    </div>
                  ))}
                  <div className="mt-4 font-bold">Total Price: ${selectedDetail.totalPrice.toFixed(2)}</div>
                </div>
              ) : (
                <ul className="list-disc list-inside">
                  {selectedDetail.data.map((item, index) => (
                    <li key={index} className="mb-2 text-gray-700">
                      {selectedDetail.type === 'completedAccounts' ? (
                        <div>
                          <span className="font-medium">{item[0]}</span> - <span>{item[1]}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-medium">{item[0]}</span> - <span>{item[1]}</span> - <span>${item[2]}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={closeModal}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AccountTotals;
