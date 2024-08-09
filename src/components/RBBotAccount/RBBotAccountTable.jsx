import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';

const RBBotAccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/rbbotaccounts`);
        setAccounts(response.data);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/rbbotaccounts/${id}`);
      setAccounts(accounts.filter(account => account._id !== id));
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.email.toLowerCase().includes(search.toLowerCase()) ||
    account.deviceNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or device number"
          className="border border-gray-300 rounded-md p-2 w-1/3"
        />
      </div>

      <table className="min-w-full bg-white border border-gray-300 rounded-md">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Device Number</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccounts.map((account, index) => (
            <tr key={account._id} className="border-b border-gray-200">
              <td className="p-3 text-center">{index + 1}</td>
              <td className="p-3">{account.email}</td>
              <td className="p-3">{account.deviceNumber}</td>
              <td className="p-3 text-center">
                <Link to={`/rbbotaccounts/edit/${account._id}`} className="text-blue-500 hover:text-blue-700 mr-3">
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
                <button
                  onClick={() => handleDelete(account._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RBBotAccountTable;
