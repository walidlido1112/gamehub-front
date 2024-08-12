import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faDesktop, faGamepad, faLaptop } from '@fortawesome/free-solid-svg-icons';
import './PlaysTable.css';

// Function to get the icon based on device number
const getDeviceIcon = (deviceNumber) => {
    if (deviceNumber.startsWith('ps4') || deviceNumber.startsWith('ps5')) {
        return faGamepad;
    } else if (deviceNumber.startsWith('pc')) {
        return faDesktop;
    } else {
        return faLaptop; // Default icon
    }
};

// Predefined device numbers
const deviceNumbers = [
    'ps4-01', 'ps4-02', 'ps4-03', 'ps4-04', 'ps4-05', 'ps4-06', 'ps4-07', 'ps4-08', 'ps4-09', 'ps4-10',
    'ps4-11', 'ps4-12', 'ps4-13', 'ps4-14', 'ps4-15', 'ps4-16', 'ps4-17', 'ps4-18', 'ps4-19', 'ps4-20',
    'ps4-21', 'ps4-22', 'ps4-23', 'ps4-24', 'ps4-25', 'ps5-01', 'ps5-02', 'ps5-03', 'ps5-04', 'ps5-05',
    'pc-01', 'pc-02', 'pc-03', 'pc-04', 'pc-05', 'pc-06'
];

const PlaysTable = ({ plays, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPlays = plays.filter(play =>
        play.deviceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="overflow-x-auto p-4">
            <div className="flex mb-4 items-center space-x-2">
                <input
                    type="text"
                    placeholder="Search by device number"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                />
            </div>
            <table className="min-w-full bg-white border border-gray-200 rounded shadow-md">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-300">
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Device Number</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPlays.map(play => (
                        <tr key={play._id} className="border-b border-gray-200">
                            <td className="px-4 py-2">{play.email}</td>
                            <td className="px-4 py-2 flex items-center">
                                <FontAwesomeIcon
                                    icon={getDeviceIcon(play.deviceNumber)}
                                    className="mr-2 text-gray-500"
                                />
                                {play.deviceNumber}
                            </td>
                            <td className="px-4 py-2 flex justify-around items-center">
                                <button
                                    onClick={() => onEdit(play)}
                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="mr-1" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(play._id)}
                                    className="text-red-500 hover:text-red-700 flex items-center"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlaysTable;
