"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const AddLaporanButton: React.FC = () => {
    const router = useRouter();

    const handleAddLaporan = () => {
        router.push('/laporan/buatLaporan');
    };

    return (
        <button
            onClick={handleAddLaporan}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-5 px-8 w-72 h-30 rounded-lg shadow-md transition duration-300"
        >
            +Tambah Laporan
        </button>
    );
};

export default AddLaporanButton;