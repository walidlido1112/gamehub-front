import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddAccountModal from './AddAccountModal';
import PlaysTable from './PlaysTable';
import FinishedTables from './FinishedTables';
import TableManager from './TableManager';
import { apiUrl } from '../config';
import Sidebar from '../components/Shared/Sidebar';
import Navbar from '../components/Shared/Navbar';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './SnTool.css';

const SnTool = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [plays, setPlays] = useState([]);
    const [tables, setTables] = useState([]);
    const [loadingPlays, setLoadingPlays] = useState(true);
    const [loadingTables, setLoadingTables] = useState(true);
    const [error, setError] = useState(null);
    const [showPlaysTable, setShowPlaysTable] = useState(false); // Default to hidden
    const [showTableManager, setShowTableManager] = useState(false); // Default to hidden
    const [showActiveTable, setShowActiveTable] = useState(false); // Default to hidden
    const [activeTable, setActiveTable] = useState(() => {
        const savedTable = localStorage.getItem('activeTable');
        return savedTable ? JSON.parse(savedTable) : null;
    });

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    useEffect(() => {
        const fetchPlays = async () => {
            try {
                const response = await axios.get(`${apiUrl}/plays/all`);
                setPlays(response.data);
                setLoadingPlays(false);
            } catch (error) {
                setError('Failed to fetch plays');
                setLoadingPlays(false);
            }
        };

        fetchPlays();
    }, []);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const response = await axios.get(`${apiUrl}/tables`);
                setTables(response.data);
                setLoadingTables(false);
            } catch (error) {
                setError('Failed to fetch tables');
                setLoadingTables(false);
            }
        };

        fetchTables();
    }, []);

    useEffect(() => {
        if (activeTable) {
            localStorage.setItem('activeTable', JSON.stringify(activeTable));
        }
    }, [activeTable]);

    const handleEdit = (play) => {
        // Define the logic to handle play editing
    };

    const handleDelete = async (playId) => {
        try {
            await axios.delete(`${apiUrl}/api/plays/${playId}`);
            setPlays(plays.filter(play => play._id !== playId));
        } catch (error) {
            console.error('Failed to delete play:', error);
            alert('Failed to delete play');
        }
    };

    const handleSaveTable = (selectedPlays) => {
        setActiveTable({
            _id: Date.now(),
            tableNumber: `Table-${tables.length + 1}`,
            startTime: new Date(),
            endTime: null,
            timeElapsed: 0,
            plays: selectedPlays,
        });
        setShowTableManager(false);
    };

    const handleDeleteTable = async (tableId) => {
        try {
            await axios.delete(`${apiUrl}/tables/${tableId}`);
            setTables(tables.filter(table => table._id !== tableId));
        } catch (error) {
            console.error('Failed to delete table:', error);
            alert('Failed to delete table');
        }
    };

    const handleFinishTable = () => {
        if (activeTable) {
            setActiveTable({
                ...activeTable,
                endTime: new Date(),
                timeElapsed: Math.floor((new Date() - new Date(activeTable.startTime)) / 60000)
            });
            localStorage.removeItem('activeTable'); // Clear the active table from local storage
        }
    };

    const handleClearTable = () => {
        setActiveTable(null);
        localStorage.removeItem('activeTable'); // Clear the active table from local storage
    };

    if (loadingPlays || loadingTables) return <p>Loading...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="sn-tool">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="content p-6">
                    <h1 className="header">SN Tool</h1>

                    <button
                        onClick={openModal}
                        className="btn btn-primary mb-6"
                    >
                        Add Account
                    </button>
                    <AddAccountModal isOpen={modalIsOpen} onRequestClose={closeModal} />

                    <div className="card mb-6">
                        <div className="card-header">
                            <h2>Account List</h2>
                            <button
                                onClick={() => setShowPlaysTable(!showPlaysTable)}
                                className="toggle-button"
                            >
                                {showPlaysTable ? (
                                    <>
                                        <FaArrowUp className="mr-2" /> 
                                    </>
                                ) : (
                                    <>
                                        <FaArrowDown className="mr-2" /> 
                                    </>
                                )}
                            </button>
                        </div>
                        {showPlaysTable && (
                            <div className="mt-6">
                                <PlaysTable
                                    plays={plays}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        )}
                    </div>

                    <div className="card mb-6">
                        <div className="card-header">
                            <h2>Table Manager</h2>
                            <button
                                onClick={() => setShowTableManager(!showTableManager)}
                                className="toggle-button"
                            >
                                {showTableManager ? (
                                    <>
                                        <FaArrowUp className="mr-2" /> 
                                    </>
                                ) : (
                                    <>
                                        <FaArrowDown className="mr-2" /> 
                                    </>
                                )}
                            </button>
                        </div>
                        {showTableManager && (
                            <div className="mt-6">
                                <TableManager
                                    availablePlays={plays}
                                    addToTable={handleSaveTable}
                                />
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h2>Active Table</h2>
                            <button
                                onClick={() => setShowActiveTable(!showActiveTable)}
                                className="toggle-button"
                            >
                                {showActiveTable ? (
                                    <>
                                        <FaArrowUp className="mr-2" /> Hide Active Table
                                    </>
                                ) : (
                                    <>
                                        <FaArrowDown className="mr-2" /> Show Active Table
                                    </>
                                )}
                            </button>
                        </div>
                        {showActiveTable && activeTable ? (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Active Table</h2>
                                <div>Table Number: {activeTable.tableNumber}</div>
                                <div>Start Time: {new Date(activeTable.startTime).toLocaleString()}</div>
                                <div>Time Elapsed: {activeTable.timeElapsed} min</div>
                                <button
                                    onClick={handleFinishTable}
                                    className="btn btn-danger mr-2"
                                >
                                    Finish Table
                                </button>
                                <button
                                    onClick={handleClearTable}
                                    className="btn btn-secondary"
                                >
                                    Clear Table
                                </button>
                            </div>
                        ) : (
                            !showActiveTable && <FinishedTables tables={tables} onDeleteTable={handleDeleteTable} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SnTool;
