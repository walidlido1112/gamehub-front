import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AccountForm from './components/AccountForm';
import AccountTable from './components/AccountTable';
import AccountList from './components/AccountList';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './SnipeAccounts.css'; // Add custom styles if needed
import { apiUrl } from '../../config';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'; // Ensure these are imported

const SnipeAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/snipeaccounts`);
        if (data && Array.isArray(data)) {
          setAccounts(data);
        } else {
          console.error('Accounts data is not an array:', data);
          setError('Accounts data format is incorrect.');
        }
      } catch (error) {
        setError('Failed to fetch accounts.');
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const toggleForm = () => setShowForm(!showForm);
  const toggleTable = () => setShowTable(!showTable);

  const goToDashboard = () => {
    navigate('/dashboard'); // Navigate to the dashboard page
  };

  return (
    <div className="flex h-screen">
      <main className="flex-1 p-6 bg-gray-100">
        <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-md flex flex-col h-full">
          <button 
            onClick={goToDashboard} 
            className="bg-blue-500 text-white p-2 rounded mb-6"
          >
            Go to Dashboard
          </button>
          <h1 className="text-3xl font-bold mb-6">Snipe Accounts</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {/* Account Table */}
          <div className="card mb-6 flex flex-col">
            <div className="card-header flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Accounts List</h2>
              <button onClick={toggleTable} className="bg-blue-500 text-white p-2 rounded flex items-center">
                {showTable ? (
                  <>
                    <FaChevronUp className="mr-2" /> 
                  </>
                ) : (
                  <>
                    <FaChevronDown className="mr-2" /> 
                  </>
                )}
              </button>
            </div>
            <div className={showTable ? 'visible-content h-auto overflow-auto' : 'hidden-content'}>
              <AccountTable 
                accounts={accounts}
                onAccountSelect={handleAccountSelect} 
              />
            </div>
          </div>

          {/* Account Form */}
          <div className="card mb-6 flex flex-col">
            <div className="card-header flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Account Form</h2>
              <button onClick={toggleForm} className="bg-blue-500 text-white p-2 rounded flex items-center">
                {showForm ? (
                  <>
                    <FaChevronUp className="mr-2" /> 
                  </>
                ) : (
                  <>
                    <FaChevronDown className="mr-2" /> 
                  </>
                )}
              </button>
            </div>
            <div className={showForm ? 'visible-content' : 'hidden-content'}>
              <AccountForm 
                account={selectedAccount} 
                onUpdateAccount={handleAccountSelect} 
                onClose={() => setSelectedAccount(null)}
              />
            </div>
          </div>

          <div className="mt-6">
            <AccountList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SnipeAccounts;
