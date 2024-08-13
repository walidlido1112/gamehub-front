import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faEdit, faTrash, faCheck, faUndo } from '@fortawesome/free-solid-svg-icons';
import EditAccountModal from './EditAccountModal';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const AccountTable = () => {
  const [accountData, setAccountData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownRDP, setDropdownRDP] = useState([]);
  const [selectedRDP, setSelectedRDP] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`${apiUrl}/snipeaccounts`)
      .then(response => {
        setAccountData(response.data);
        setFilteredData(response.data);
        const rdpOptions = [...new Set(response.data.map(account => account.rdp))];
        setDropdownRDP(rdpOptions);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = accountData.filter(account =>
      (account.email.toLowerCase().includes(lowerCaseQuery) || account.rdp.toLowerCase().includes(lowerCaseQuery)) &&
      (selectedRDP ? account.rdp === selectedRDP : true)
    );
    setFilteredData(filtered);
  }, [searchQuery, accountData, selectedRDP]);

  const startAccount = (accountId) => {
    axios.post(`${apiUrl}/snipeaccounts/starttime`, { id: accountId })
      .then(response => {
        fetchData(); // إعادة تحميل البيانات بعد التحديث
      })
      .catch(error => {
        console.error('Error starting account:', error);
      });
  };

  const stopAccount = (accountId) => {
    axios.post(`${apiUrl}/snipeaccounts/stop`, { id: accountId })
      .then(response => {
        fetchData(); // إعادة تحميل البيانات بعد التحديث
      })
      .catch(error => {
        console.error('Error stopping account:', error);
      });
  };

  const resetAccount = (accountId) => {
    confirmAlert({
      title: 'Confirm Reset',
      message: 'Are you sure you want to reset this account?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            axios.post(`${apiUrl}/snipeaccounts/reset`, { id: accountId })
              .then(() => {
                fetchData(); // إعادة تحميل البيانات بعد التحديث
              })
              .catch(error => {
                console.error('Error resetting account:', error);
              });
          }
        },
        {
          label: 'No',
        }
      ]
    });
  };

  const deleteAccount = (accountId) => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this account?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            axios.delete(`${apiUrl}/snipeaccounts/${accountId}`)
              .then(() => {
                fetchData(); // إعادة تحميل البيانات بعد التحديث
              })
              .catch(error => {
                console.error('Error deleting account:', error);
              });
          }
        },
        {
          label: 'No',
        }
      ]
    });
  };

  const openEditModal = (account) => {
    setSelectedAccount(account);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error fetching data: {error.message}</p>;
  }

  const getRowColor = (status, stopTime) => {
    if (status === 'in progress') return 'bg-blue-500 text-white';
    if (status === 'completed today') {
      const stopDate = new Date(stopTime);
      const currentDate = new Date();
      const isPast24Hours = (currentDate - stopDate) > (24 * 60 * 60 * 1000);
      return isPast24Hours ? 'bg-green-100' : 'bg-green-500 text-white';
    }
    return 'bg-white';
  };

  const isStartButtonDisabled = (status, stopTime) => {
    if (status === 'in progress') return true;
    if (status === 'completed today') {
      const stopDate = new Date(stopTime);
      const currentDate = new Date();
      return (currentDate - stopDate) < (24 * 60 * 60 * 1000);
    }
    return false;
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email or RDP"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded mr-4"
        />
        <select
          value={selectedRDP}
          onChange={(e) => setSelectedRDP(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select RDP</option>
          {dropdownRDP.map(rdp => (
            <option key={rdp} value={rdp}>{rdp}</option>
          ))}
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">RDP</th>
            <th className="px-4 py-2 text-left">Searches</th>
            <th className="px-4 py-2 text-left">Coins</th>
            <th className="px-4 py-2 text-left">Start Time</th>
            <th className="px-4 py-2 text-left">Stop Time</th>
            <th className="px-4 py-2 text-left">Time Elapsed</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((account, index) => (
            <tr
              key={account._id}
              className={`${getRowColor(account.status, account.stopTime)} px-4 py-2 border-b border-gray-300`}
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2 text-lg font-semibold">{account.email}</td>
              <td className="px-4 py-2">{account.rdp}</td>
              <td className="px-4 py-2">{account.searches}</td>
              <td className="px-4 py-2">{account.coins}</td>
              <td className="px-4 py-2">{account.startTime ? new Date(account.startTime).toLocaleString() : 'N/A'}</td>
              <td className="px-4 py-2">{account.stopTime ? new Date(account.stopTime).toLocaleString() : 'N/A'}</td>
              <td className="px-4 py-2">
                {account.startTime && account.stopTime
                  ? `${Math.round((new Date(account.stopTime) - new Date(account.startTime)) / 60000)} mins`
                  : 'N/A'
                }
              </td>
              <td className="px-4 py-2">
                {account.status === 'in progress' && (
                  <>
                    <FontAwesomeIcon icon={faPlay} className="mr-1" />
                    In Progress
                  </>
                )}
                {account.status === 'completed today' && (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="mr-1" />
                    Completed 
                  </>
                )}
              </td>
              <td className="px-4 py-2 flex space-x-2">
                <button
                  onClick={() => startAccount(account._id)}
                  className="bg-blue-500 text-white p-2 rounded flex items-center"
                  disabled={isStartButtonDisabled(account.status, account.stopTime)}
                >
                  <FontAwesomeIcon icon={faPlay} />
                </button>
                <button
                  onClick={() => stopAccount(account._id)}
                  className="bg-red-500 text-white p-2 rounded flex items-center"
                  disabled={account.status !== 'in progress'}
                >
                  <FontAwesomeIcon icon={faStop} />
                </button>
                <button
                  onClick={() => openEditModal(account)}
                  className="bg-yellow-500 text-white p-2 rounded flex items-center"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => deleteAccount(account._id)}
                  className="bg-red-600 text-white p-2 rounded flex items-center"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button
                  onClick={() => resetAccount(account._id)}
                  className="bg-gray-500 text-white p-2 rounded flex items-center"
                >
                  <FontAwesomeIcon icon={faUndo} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditModalOpen && (
        <EditAccountModal
          account={selectedAccount}
          onClose={closeEditModal}
          onUpdate={fetchData} // إعادة تحميل البيانات بعد التعديل
        />
      )}
    </div>
  );
};

export default AccountTable;
