import Link from "next/link";
import React from "react";

const AddLaporanCard = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6">
      <div className="bg-blue-100 p-4 rounded-xl shadow-md w-full">
        <h2 className="text-center font-bold text-lg">AKTIVITAS PENJUALAN AO/MARKETING</h2>
        <form className="mt-4">
          <label className="block text-sm font-medium">Nama</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">Alamat</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">Kota</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">Kecamatan</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">Kelurahan</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">No. Telp/HP</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">Usaha</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">AO</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">Hasil Kunjungan</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">Foto</label>
          <input type="file" accept="image/*" />

          <div className="flex justify-between mt-4">
            <Link href="/laporan">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                BATALKAN
              </button>
            </Link>
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md">
              KIRIM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLaporanCard;
