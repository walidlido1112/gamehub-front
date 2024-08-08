import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaListAlt, FaUsers, FaBox, FaSearch } from 'react-icons/fa';

Modal.setAppElement('#root'); // Set the root element for accessibility

const AccountTotals = ({ accounts = [], employees = [] }) => {
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [psPrice, setPsPrice] = useState(0);
  const [pcPrice, setPcPrice] = useState(0);

  // Ensure accounts and employees are arrays
  if (!Array.isArray(accounts) || !Array.isArray(employees)) {
    console.error('Accounts or Employees data is not an array');
    return <div>Error: Data is not in the expected format.</div>;
  }

  const psAccounts = accounts.filter(account => account.type === 'ps');
  const pcAccounts = accounts.filter(account => account.type === 'pc');
  const completedAccounts = accounts.filter(account => account.status === 'completed');

  const totalPsQuantity = psAccounts.reduce((acc, account) => acc + account.quantity, 0);
  const totalPcQuantity = pcAccounts.reduce((acc, account) => acc + account.quantity, 0);

  const filteredEmployees = employees.filter(employee => employee.role === 'employee');
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

      {selectedDetail && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Detail Modal"
          className="Modal"
          overlayClassName="Overlay"
        >
          <h2 className="text-xl font-bold mb-4">
            {selectedDetail.type === 'completedAccounts' ? 'Completed Accounts' : 'Details'}
          </h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                {selectedDetail.type === 'completedAccounts' && (
                  <>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Employee Name</th>
                  </>
                )}
                {selectedDetail.type === 'totalPsQuantity' || selectedDetail.type === 'totalPcQuantity' ? (
                  <>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Quantity</th>
                    <th className="px-4 py-2 text-left">Price</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Search Count</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {selectedDetail.data.map((item, index) => (
                <tr key={index} className="border-b">
                  {selectedDetail.type === 'completedAccounts' && (
                    <>
                      <td className="px-4 py-2">{item.email}</td>
                      <td className="px-4 py-2">{item.employee}</td>
                    </>
                  )}
                  {selectedDetail.type === 'totalPsQuantity' || selectedDetail.type === 'totalPcQuantity' ? (
                    <>
                      <td className="px-4 py-2">{item.email}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{item.price}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{item.email}</td>
                      <td className="px-4 py-2">{item.searchCount}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
            {selectedDetail.type !== 'completedAccounts' && (
              <tfoot>
                <tr>
                  <td className="px-4 py-2 font-bold" colSpan={selectedDetail.type === 'totalSearches' ? 2 : 3}>
                    Total Price: {selectedDetail.totalPrice.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
          <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default AccountTotals;
