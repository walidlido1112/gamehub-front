import React, { useEffect, useState } from 'react';
import { FaRegClock, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { apiUrl } from '../../../config';
import Modal from './Modal';

// AccountList Component
const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [expandedRdp, setExpandedRdp] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${apiUrl}/snipeaccounts`)
      .then((response) => response.json())
      .then((data) => setAccounts(data))
      .catch((error) => console.error('Error fetching accounts:', error));
  }, []);

  // Group accounts by RDP
  const groupedAccounts = accounts.reduce((acc, account) => {
    (acc[account.rdp] = acc[account.rdp] || []).push(account);
    return acc;
  }, {});

  const handleRdpClick = (rdp) => {
    if (expandedRdp === rdp) {
      setExpandedRdp(null);
      setModalOpen(false);
    } else {
      setExpandedRdp(rdp);
      setSelectedAccounts(groupedAccounts[rdp]);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setExpandedRdp(null);
  };

  // Calculate total coins for the entire table
  const totalCoins = accounts.reduce((total, account) => total + account.coins, 0);

  // Calculate total coins for each RDP
  const getTotalCoinsForRdp = (rdp) => {
    return (groupedAccounts[rdp] || []).reduce((total, account) => total + account.coins, 0);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Object.keys(groupedAccounts).map((rdp) => (
          <div
            key={rdp}
            onClick={() => handleRdpClick(rdp)}
            className="flex items-center cursor-pointer p-4 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-300"
          >
            <span className="text-lg font-semibold text-gray-800">{rdp}</span>
            <span className="ml-auto text-gray-500">
              {expandedRdp === rdp ? (
                <FaChevronUp className="inline-block" />
              ) : (
                <FaChevronDown className="inline-block" />
              )}
            </span>
            {expandedRdp === rdp && (
              <div className="text-gray-700 ml-4">
                <span>Total Coins: {getTotalCoinsForRdp(rdp)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-white border border-gray-300 rounded-lg shadow-md">
        <span className="text-lg font-semibold text-gray-800">Total Coins (All RDPs): {totalCoins}</span>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        accounts={selectedAccounts}
      />
    </div>
  );
};

export default AccountList;
