"use client";
import React from "react";
import { useRouter } from "next/navigation";
import DetailNasabahTable from "./DetailNasabahTable";
import Link from "next/link";

const DetailNasabahCard: React.FC = () => {
  const router = useRouter();

  const nasabahData = {
    nama: "Mustakin",
    noHp: "081234567890",
    alamat: "Jalan Merdeka",
    kelurahan: "Beringin",
    kecamatan: "Semarang Tengah",
    kota: "Kota Semarang",
    namaAO: "Airin",
    namaSupervisor: "Maha Sagara Lim",
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6">
      <div className="bg-blue-100 p-4 rounded-xl shadow-md w-full">
        {/* Judul Card */}
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 sm:text-2xl md:text-3xl lg:text-4xl">
          Detail Nasabah
        </h2>

        {/* Data Nasabah */}
        <div className="space-y-3 text-gray-700">
          <p><strong>Nama:</strong> {nasabahData.nama}</p>
          <p><strong>No. HP:</strong> {nasabahData.noHp}</p>
          <p><strong>Alamat:</strong> {nasabahData.alamat}</p>
          <p><strong>Kelurahan:</strong> {nasabahData.kelurahan}</p>
          <p><strong>Kecamatan:</strong> {nasabahData.kecamatan}</p>
          <p><strong>Kota:</strong> {nasabahData.kota}</p>
          <p><strong>Nama AO:</strong> {nasabahData.namaAO}</p>
          <p><strong>Nama Supervisor:</strong> {nasabahData.namaSupervisor}</p>
        </div>

        {/* Detail Kunjungan */}
        <h3 className="text-xl font-semibold text-center text-gray-700 mt-6 mb-4">
          Detail Kunjungan
        </h3>
        <DetailNasabahTable />

        {/* Tombol Kembali */}
        <div className="flex justify-between mt-4">
          <Link href="/nasabah">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
            >
              KEMBALI
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailNasabahCard;