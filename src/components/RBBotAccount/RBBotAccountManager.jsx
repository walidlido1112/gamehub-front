// src/components/RBBotAccountManager/RBBotAccountManager.jsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { FaDownload, FaUpload } from 'react-icons/fa';

const RBBotAccountManager = () => {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const exportToCSV = async () => {
    try {
      const { data } = await axios.get('/api/rbbotaccounts'); // اجلب جميع بيانات rbbotaccounts
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'rbbotaccounts.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to export accounts:', error);
    }
  };

  const importFromCSV = async () => {
    if (!file) return;

    setImporting(true);
    Papa.parse(file, {
      complete: async (results) => {
        try {
          await axios.post('/api/rbbotaccounts/import', { data: results.data });
          setImporting(false);
          alert('Data imported successfully!');
        } catch (error) {
          setImporting(false);
          console.error('Failed to import accounts:', error);
          alert('Failed to import data');
        }
      },
      header: true
    });
  };

  return (
    <div className="rbbot-account-manager p-6 bg-white shadow-lg rounded-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Manage RBBot Accounts</h2>
      <div className="flex items-center mb-4">
        <button
          onClick={exportToCSV}
          className="mr-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
        >
          <FaDownload className="mr-2" />
          Export to CSV
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mr-4"
        />
        <button
          onClick={importFromCSV}
          className={`px-4 py-2 ${importing ? 'bg-gray-500' : 'bg-blue-500'} text-white rounded-md hover:bg-blue-600 flex items-center`}
          disabled={importing}
        >
          <FaUpload className="mr-2" />
          {importing ? 'Importing...' : 'Import from CSV'}
        </button>
      </div>
    </div>
  );
};

export default RBBotAccountManager;
