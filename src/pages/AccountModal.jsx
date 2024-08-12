import React from 'react';

const AccountModal = ({ deviceNumber, plays, handleSelectPlay, closeModal }) => {
    // Ensure we have exactly 6 seats, if less, fill with placeholders
    const seats = [...plays, ...Array(12 - plays.length).fill(null)];

    const handlePlaySelect = (play) => {
        handleSelectPlay(play);
        closeModal(); // Close the modal after selecting a play
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Accounts for {deviceNumber}</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {seats.map((play, index) => (
                        <div key={index} className="border p-4 rounded-lg shadow-md flex flex-col items-center bg-gray-100">
                            {play ? (
                                <>
                                    <span className="text-lg font-small mb-2">{play.email}</span>
                                    <button
                                        onClick={() => handlePlaySelect(play)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    >
                                        Add
                                    </button>
                                </>
                            ) : (
                                <span className="text-gray-600">Empty Seat</span>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={closeModal}
                    className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AccountModal;
