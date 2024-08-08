import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Adjust the path based on your routes
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to GameHub Store
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Manage your data efficiently with our CRUD application built using the MERN stack.
        </p>
        <button
          onClick={handleLoginClick}
          className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default HomePage;
