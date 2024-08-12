import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../config';
import ManageTable from './ManageTable'; // استيراد المكون الجديد

const TableManager = ({ availablePlays }) => {
    const [selectedPlays, setSelectedPlays] = useState([]);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [tableNumber, setTableNumber] = useState(null);
    const [tables, setTables] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentDevice, setCurrentDevice] = useState(null);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const handleSelectPlay = (play) => {
        if (selectedPlays.length < 6 && !selectedPlays.find(p => p.deviceNumber === play.deviceNumber)) {
            setSelectedPlays([...selectedPlays, play]);
        }
    };

    const handleRemovePlay = (play) => {
        setSelectedPlays(selectedPlays.filter(p => p._id !== play._id));
    };

    const handleStart = () => {
        setStartTime(new Date());
        setEndTime(null);
        setTimer(0);
        setIsRunning(true);
        setTableNumber(generateTableNumber());
    };

    const handleFinish = async () => {
        try {
            const end = new Date();
            const timeElapsed = Math.floor((end - startTime) / 60000);

            const tableData = {
                tableNumber,
                plays: selectedPlays.map(play => ({
                    email: play.email,
                    deviceNumber: play.deviceNumber
                })),
                startTime,
                endTime: end.toISOString(),
                timeElapsed,
                date: new Date().toISOString().split('T')[0],
                dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' })
            };

            const response = await axios.post(`${apiUrl}/tables`, tableData);

            setTables([...tables, response.data]);
            setSelectedPlays([]);
            setTimer(0);
            setStartTime(null);
            setEndTime(null);
            setTableNumber(null);
            setIsRunning(false);
        } catch (error) {
            console.error('Failed to save table:', error.response ? error.response.data : error.message);
        }
    };

    const generateTableNumber = () => {
        return `T-${Date.now()}`;
    };

    // Group plays by device number
    const groupedPlays = availablePlays.reduce((acc, play) => {
        if (!acc[play.deviceNumber]) {
            acc[play.deviceNumber] = [];
        }
        acc[play.deviceNumber].push(play);
        return acc;
    }, {});

    const handleDeviceClick = (deviceNumber) => {
        setCurrentDevice(deviceNumber);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentDevice(null);
    };

    const filteredPlays = Object.keys(groupedPlays).reduce((acc, deviceNumber) => {
        if (!selectedPlays.find(play => play.deviceNumber === deviceNumber)) {
            acc[deviceNumber] = groupedPlays[deviceNumber];
        }
        return acc;
    }, {});

    const getDeviceIcon = (deviceNumber) => {
        if (deviceNumber.startsWith('ps4') || deviceNumber.startsWith('ps5')) {
            return '🎮'; // Gamepad icon
        } else if (deviceNumber.startsWith('pc')) {
            return '🖥️'; // Desktop icon
        } else {
            return '🕹️'; // Xbox or other icon
        }
    };

    return (
        <div className="p-4">
            <ManageTable
                filteredPlays={filteredPlays}
                handleDeviceClick={handleDeviceClick}
                getDeviceIcon={getDeviceIcon}
                showModal={showModal}
                currentDevice={currentDevice}
                groupedPlays={groupedPlays}
                handleSelectPlay={handleSelectPlay}
                closeModal={closeModal}
                selectedPlays={selectedPlays}
                handleRemovePlay={handleRemovePlay}
                handleStart={handleStart}
                handleFinish={handleFinish}
                timer={timer}
                isRunning={isRunning}
                startTime={startTime}
                tables={tables}
            />
        </div>
    );
};

export default TableManager;