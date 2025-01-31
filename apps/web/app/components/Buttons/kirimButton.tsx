import React from 'react';

const kirimButton: React.FC = () => {
    return (
        <button className="bg-yellow-200 hover:bg-yellow-300 text-white font-semibold py-5 px-8 w-72 h-30 rounded-lg shadow-md transition duration-300">
            Kirim
        </button>
    );
};

export default kirimButton;