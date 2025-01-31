
import React from "react";
import Link from "next/link";

const DetailKunjunganCard = () => {
    // Data dummy untuk detail nasabah
    const kunjunganData = {
        nama: "Mustakin",
        alamat: "Jalan Merdeka",
        kelurahan: "Beringin",
        kecamatan: "Semarang Tengah",
        kota: "Kota Semarang",
        namaUsaha: "Toko Sembako",
        waktuKunjungan: "2025-10-01 10:54",
        hasilKunjungan: "Tertarik",
        namaAO: "Airin",
        fotoKunjungan: "/bpr.png", // URL gambar
    };

    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="bg-blue-100 p-4 rounded-xl shadow-md w-full">
                {/* Judul Card */}
                <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 sm:text-2xl md:text-3xl lg:text-4xl">
                    Detail Kunjungan
                </h2>

                {/* Data Nasabah */}
                <div className="space-y-3 text-gray-700">
                    <p><strong>Nama:</strong> {kunjunganData.nama}</p>
                    <p><strong>Alamat:</strong> {kunjunganData.alamat}</p>
                    <p><strong>Kelurahan:</strong> {kunjunganData.kelurahan}</p>
                    <p><strong>Kecamatan:</strong> {kunjunganData.kecamatan} </p>
                    <p><strong>Kota:</strong> {kunjunganData.kota}</p>
                    <p><strong>Nama Usaha:</strong> {kunjunganData.namaUsaha}</p>
                    <p><strong>Waktu Kunjungan:</strong> {kunjunganData.waktuKunjungan}</p>
                    <p><strong>Hasil Kunjungan:</strong> {kunjunganData.hasilKunjungan}</p>
                    <p><strong>Nama AO:</strong> {kunjunganData.namaAO}</p>
                </div>

                {/* Foto Kunjungan */}
                <div className="mt-4">
                    <p className="font-semibold">Foto Kunjungan:</p>
                    <img src={kunjunganData.fotoKunjungan} alt="Foto Kunjungan" className="mt-2 w-full rounded-lg shadow-md" />
                </div>

                {/* Tombol Kembali */}
                <div className="flex justify-between mt-4">
                    <Link href="/marketing">
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

export default DetailKunjunganCard;
