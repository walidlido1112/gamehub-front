import React from 'react';

const RBBotAccountForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = React.useState(initialData || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id={`codes-${initialData?._id}`}
        name="codes"
        placeholder="Codes"
        value={formData.codes || ''}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <input
        type="text"
        id={`deviceNumber-${initialData?._id}`}
        name="deviceNumber"
        placeholder="Device Number"
        value={formData.deviceNumber || ''}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <input
        type="email"
        id={`email-${initialData?._id}`}
        name="email"
        placeholder="Email"
        required
        value={formData.email || ''}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <input
        type="text"
        id={`googleAuthEA-${initialData?._id}`}
        name="googleAuthEA"
        placeholder="Google Auth EA"
        value={formData.googleAuthEA || ''}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <input
        type="text"
        id={`googleAuthSony-${initialData?._id}`}
        name="googleAuthSony"
        placeholder="Google Auth Sony"
        value={formData.googleAuthSony || ''}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <select
        id={`passwordType-${initialData?._id}`}
        name="passwordType"
        value={formData.passwordType || ''}
        onChange={handleChange}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      >
        {/* Options here */}
      </select>
      <input
        type="text"
        id={`proxy-${initialData?._id}`}
        name="proxy"
        placeholder="Proxy"
        value={formData.proxy || ''}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default RBBotAccountForm;
