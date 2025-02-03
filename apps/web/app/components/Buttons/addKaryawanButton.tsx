"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MdGroupAdd } from "react-icons/md";

const AddKaryawanButton: React.FC = () => {
    const router = useRouter();

    const handleAddKaryawan = () => {
        router.push('/karyawan/tambahKaryawan');
    };

    return (
        <button
            onClick={handleAddKaryawan}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-5 px-8 w-72 h-30 rounded-lg shadow-md transition duration-300 flex items-center justify-center space-x-2"
        >
            <MdGroupAdd size={24} />
            <span>Tambah Karyawan</span>
        </button>
    );
};

export default AddKaryawanButton;
    