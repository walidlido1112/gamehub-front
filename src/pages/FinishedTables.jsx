import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarAlt, faList, faTrash, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

const FinishedTables = ({ tables, onDeleteTable }) => {
    const [searchDate, setSearchDate] = useState(dayjs().format('YYYY-MM-DD')); // Default to today's date
    const [expandedTable, setExpandedTable] = useState(null);
    const [showAll, setShowAll] = useState(false); // New state to track "show all" option

    // Filter tables based on today's date or search date if not showing all tables
    const filteredTables = showAll
        ? tables
        : tables.filter(table => {
            const tableStartDate = dayjs(table.startTime).format('YYYY-MM-DD');
            return tableStartDate === searchDate;
        });

    const toggleTableDetails = (tableId) => {
        setExpandedTable(prevId => (prevId === tableId ? null : tableId));
    };

    const handleDelete = (tableId) => {
        if (window.confirm("Are you sure you want to delete this table?")) {
            onDeleteTable(tableId);
            alert(`Table ${tableId} has been deleted.`);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Finished Tables</h2>

            <div className="mb-4 flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className={`border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${showAll ? 'hidden' : ''}`}
                    />
                    <FontAwesomeIcon icon={faSearch} className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 ${showAll ? 'hidden' : ''}`} />
                </div>
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center space-x-2"
                >
                    <FontAwesomeIcon icon={faFilter} />
                    <span>{showAll ? 'Filter by Date' : 'Show All'}</span>
                </button>
            </div>

            {filteredTables.length === 0 ? (
                <p>No finished tables to display.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Elapsed</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredTables.map((table, index) => (
                                <React.Fragment key={table._id}>
                                    <tr
                                        className={`cursor-pointer hover:bg-gray-50 ${expandedTable === table._id ? 'bg-gray-200' : ''}`}
                                        onClick={() => toggleTableDetails(table._id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{table.tableNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                                            {table.startTime ? dayjs(table.startTime).format('YYYY-MM-DD HH:mm') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                                            {table.endTime ? dayjs(table.endTime).format('YYYY-MM-DD HH:mm') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-400" />
                                            {table.timeElapsed !== undefined ? `${table.timeElapsed} min` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(table._id);
                                                }}
                                                className="text-red-600 hover:text-red-800 transition"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedTable === table._id && (
                                        <tr>
                                            <td colSpan="6" className="p-4 bg-gray-50">
                                                <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800">
                                                    <FontAwesomeIcon icon={faList} className="mr-2 text-gray-600" />
                                                    Plays Details
                                                </h3>
                                                {table.plays && table.plays.length > 0 ? (
                                                    table.plays.map((play, playIndex) => (
                                                        <div key={playIndex} className="mb-1 text-gray-700">
                                                            {play.email} - {play.deviceNumber}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No plays available for this table.</p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FinishedTables;
