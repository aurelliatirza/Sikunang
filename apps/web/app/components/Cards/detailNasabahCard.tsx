"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DetailNasabahTable from "../Table/DetailNasabahTable";
import Link from "next/link";

interface Nasabah {
  namaNasabah: string;
  no_telp: string;
  alamat: string;
  karyawan : {
    namaKaryawan: string;
    supervisor: {
      namaKaryawan: string;
    }
  };
  desa: {
    nama: string;
    Kecamatan: {
      nama: string;
      KabupatenKota: {
        nama: string;
      };
    };
  }
}

const DetailNasabahCard: React.FC = () => {
  const router = useRouter();

  const [nasabahData, setNasabahData] = React.useState<Nasabah | null>(null);
  const { id } = useParams();
  console.log("ID dari URL:", id);

  useEffect(() => {
    const fetchDetailNasabah = async () => {
      if (!id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nasabah/${id}`);
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        console.log("Data nasabah:", data);
        setNasabahData(data);
      } catch (error) {
        console.error("Error fetching nasabah data:", error);
      }
    };
    fetchDetailNasabah();
  }
  , [id]);

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
          <p><strong>Nama:</strong> {nasabahData?.namaNasabah}</p>
          <p><strong>No. HP:</strong> {nasabahData?.no_telp}</p>
          <p><strong>Alamat:</strong> {nasabahData?.alamat}</p>
          <p><strong>Kelurahan:</strong> {nasabahData?.desa.nama}</p>
          <p><strong>Kecamatan:</strong> {nasabahData?.desa.Kecamatan.nama}</p>
          <p><strong>Kota:</strong> {nasabahData?.desa.Kecamatan.KabupatenKota.nama}</p>
          <p><strong>Nama AO:</strong> {nasabahData?.karyawan.namaKaryawan}</p>
          <p><strong>Nama Supervisor:</strong> {nasabahData?.karyawan.supervisor.namaKaryawan}</p>
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