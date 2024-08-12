import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair, faPlay, faStop, faUser } from '@fortawesome/free-solid-svg-icons';
import AccountModal from './AccountModal';
import './ManageTable.css'; // Import the CSS file

const getCategory = (deviceNumber) => {
    if (deviceNumber.startsWith('ps4') || deviceNumber.startsWith('ps5')) {
        return 'PlayStation';
    } else if (deviceNumber.startsWith('pc')) {
        return 'PC';
    } else {
        return 'Others';
    }
};

const ManageTable = ({
    filteredPlays,
    getDeviceIcon,
    handleSelectPlay,
    closeModal,
    selectedPlays,
    handleRemovePlay,
    handleStart,
    handleFinish,
    timer,
    isRunning,
    startTime
}) => {
    const [showModal, setShowModal] = useState(false);
    const [currentDevice, setCurrentDevice] = useState(null);
    const [activeTables, setActiveTables] = useState(() => {
        const savedTables = localStorage.getItem('activeTables');
        return savedTables ? JSON.parse(savedTables) : [];
    });
    const [finishingTableId, setFinishingTableId] = useState(null);
    const [isSending, setIsSending] = useState(false); // Track sending status

    useEffect(() => {
        localStorage.setItem('activeTables', JSON.stringify(activeTables));
    }, [activeTables]);

    const categorizedPlays = Object.entries(filteredPlays).reduce((acc, [deviceNumber, plays]) => {
        const category = getCategory(deviceNumber);
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({ deviceNumber, plays });
        return acc;
    }, {});

    const handleDeviceClick = (deviceNumber) => {
        setCurrentDevice(deviceNumber);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentDevice(null);
    };

    const handleStartNewTables = () => {
        if (selectedPlays.length === 6) {
            const newTableNumber = `Table-${Date.now()}`;
            const newTable = {
                _id: Date.now(),
                tableNumber: newTableNumber,
                startTime: new Date(),
                endTime: null,
                timeElapsed: 0,
                plays: selectedPlays
            };

            setActiveTables([...activeTables, newTable]);
            handleStart();
        }
    };

    const handleFinishTable = (tableId) => {
        if (isSending || finishingTableId) return; // Prevent multiple finish actions

        setFinishingTableId(tableId);
        setIsSending(true); // Set sending status

        const tableToFinish = activeTables.find(table => table._id === tableId);

        if (tableToFinish) {
            const updatedTable = {
                tableNumber: tableToFinish.tableNumber,
                startTime: tableToFinish.startTime,
                endTime: new Date().toISOString(),
                timeElapsed: Math.floor((new Date() - new Date(tableToFinish.startTime)) / 60000),
                date: new Date().toISOString().split('T')[0],
                dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
                plays: tableToFinish.plays
            };

            console.log('Data being sent:', updatedTable);

            fetch('http://localhost:5000/api/tables', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTable),
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.message || 'Network response was not ok');
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Table saved:', data);

                setActiveTables(prevTables =>
                    prevTables.filter(table => table._id !== tableId)
                );

                handleFinish();
            })
            .catch(error => {
                console.error('Failed to save table:', error.message);
                alert('Failed to save table: ' + error.message);
            })
            .finally(() => {
                setFinishingTableId(null);
                setIsSending(false); // Reset sending status
            });
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Tables</h2>

            {Object.keys(categorizedPlays).map(category => (
                <div key={category} className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">{category}</h3>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        {categorizedPlays[category].map(({ deviceNumber, plays }) => (
                            <div key={deviceNumber} className="border p-4 rounded-lg shadow-md flex flex-col items-center bg-white">
                                <h4 className="text-center mb-2 flex items-center">
                                    <span className="mr-2 text-3xl">{getDeviceIcon(deviceNumber)}</span>
                                    {deviceNumber}
                                </h4>
                                <button
                                    onClick={() => handleDeviceClick(deviceNumber)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                                >
                                    <FontAwesomeIcon icon={faUser} /> Show Accounts
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {showModal && currentDevice && (
                <AccountModal
                    deviceNumber={currentDevice}
                    plays={filteredPlays[currentDevice] || []}
                    handleSelectPlay={handleSelectPlay}
                    closeModal={handleCloseModal}
                />
            )}

            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Selected Plays ({selectedPlays.length})</h3>
                <div className="table-container grid grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="relative p-4 border rounded-lg bg-white shadow-md flex items-center justify-center">
                            {selectedPlays[index] ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="text-sm font-semibold mb-1">
                                        <FontAwesomeIcon icon={faPlay} /> {selectedPlays[index].deviceNumber}
                                    </div>
                                    <div className="text-xs mb-1">
                                        <FontAwesomeIcon icon={faUser} /> {selectedPlays[index].email}
                                    </div>
                                    <div className="text-xs text-green-500 mb-2">Playing</div>
                                    <FontAwesomeIcon icon={faChair} className="text-4xl" />
                                </div>
                            ) : (
                                <FontAwesomeIcon icon={faChair} className="text-4xl text-gray-400" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                {selectedPlays.length === 6 && !isRunning && !startTime && (
                    <button
                        onClick={handleStartNewTables}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        <FontAwesomeIcon icon={faPlay} /> Start New Tables
                    </button>
                )}
                {isRunning && (
                    <button
                        onClick={() => handleFinishTable(activeTables[activeTables.length - 1]._id)}
                        disabled={isSending || !!finishingTableId}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        <FontAwesomeIcon icon={faStop} /> Finish Last Table
                    </button>
                )}
                {isRunning && (
                    <p className="mt-2 text-gray-600">Time Elapsed: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</p>
                )}
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Active Tables</h3>
                {activeTables.length === 0 ? (
                    <p className="text-gray-500">No active tables</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {activeTables.map((table, index) => (
                            <div key={table._id} className="border p-4 rounded-lg bg-white shadow-md flex flex-col">
                                <h4 className="text-xl font-semibold mb-2">Table {index + 1}: {table.tableNumber}</h4>
                                <p className="text-sm text-gray-600 mb-1">Start Time: {new Date(table.startTime).toLocaleString()}</p>
                                <p className="text-sm text-gray-600 mb-1">Time Elapsed: {table.timeElapsed} min</p>
                                <div className="flex flex-col mb-2">
                                    {table.plays.map(play => (
                                        <div key={play.email} className="flex items-center">
                                            <FontAwesomeIcon icon={faUser} className="text-blue-500 mr-2" />
                                            {play.email} - {play.deviceNumber}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleFinishTable(table._id)}
                                    disabled={isSending || finishingTableId === table._id}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    <FontAwesomeIcon icon={faStop} /> Finish Table
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageTable;
