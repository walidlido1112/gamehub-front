import React, { useState, useRef } from 'react';
import { FaRegClock, FaSearch, FaChevronDown } from 'react-icons/fa';

// Modal Component
const Modal = ({ isOpen, onClose, accounts, rdp }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  if (!isOpen) return null;

  // Function to handle dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDragging && modalRef.current) {
      setPosition({
        x: e.clientX - modalRef.current.offsetWidth / 2,
        y: e.clientY - modalRef.current.offsetHeight / 2,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Count statuses
  const totalCount = accounts.length;
  const completedCount = accounts.filter(account => account.status === 'completed today').length;
  const inProgressCount = accounts.filter(account => account.status === 'in progress').length;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={handleMouseDown}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
        >
          <FaChevronDown />
        </button>
        <h2 className="text-lg font-semibold mb-4">RDP: {rdp}</h2>
        <div className="mb-4">
          <p className="text-sm font-medium">Total Accounts: {totalCount}</p>
          <p className="text-sm font-medium">Completed: {completedCount}</p>
          <p className="text-sm font-medium">In Progress: {inProgressCount}</p>
        </div>
        <ul className="space-y-3 overflow-y-auto max-h-96">
          {accounts.map((account) => (
            <li
              key={account._id}
              className="p-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-2">
                <span className="mr-2 text-gray-700 font-medium">{account.email}</span>
                <span
                  className={`px-2 py-1 text-white rounded-full ${
                    account.status === 'in progress'
                      ? 'bg-yellow-500'
                      : account.status === 'completed today'
                      ? 'bg-green-500'
                      : 'bg-gray-500'
                  }`}
                >
                  {account.status}
                </span>
              </div>
              <p className="text-sm">
                <FaRegClock className="inline-block mr-1 text-yellow-400" />
                {account.startTime ? `Started: ${new Date(account.startTime).toLocaleString()}` : `Started: ${new Date().toLocaleDateString()}`}
              </p>
              <p className="text-sm">
                <FaRegClock className="inline-block mr-1 text-yellow-400" />
                {account.stopTime ? `Stopped: ${new Date(account.stopTime).toLocaleString()}` : `Stopped: ${new Date().toLocaleDateString()}`}
              </p>
              <p className="text-sm">
                <FaSearch className="inline-block mr-1 text-blue-400" />
                Searches: {account.searchCount || 0}
              </p>
              <p className="text-sm">
                <FaRegClock className="inline-block mr-1 text-yellow-400" />
                Duration: {account.startTime && account.stopTime
                  ? `${Math.round((new Date(account.stopTime) - new Date(account.startTime)) / (1000 * 60))} minutes`
                  : 'N/A'}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modal;
