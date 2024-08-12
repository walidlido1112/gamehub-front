import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const EditPlayModal = ({ isOpen, onRequestClose, play, onEdit }) => {
  const [email, setEmail] = useState(play.email);
  const [code, setCode] = useState(play.code);
  const [deviceNumber, setDeviceNumber] = useState(play.deviceNumber);

  useEffect(() => {
    setEmail(play.email);
    setCode(play.code);
    setDeviceNumber(play.deviceNumber);
  }, [play]);

  const handleSave = () => {
    onEdit({ ...play, email, code, deviceNumber });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2 className="text-xl font-bold mb-4">Edit Play</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Device Number:</label>
          <input
            type="text"
            value={deviceNumber}
            onChange={(e) => setDeviceNumber(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="text-right">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onRequestClose}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditPlayModal;
