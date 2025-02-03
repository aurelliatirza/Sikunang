import Link from "next/link";
import React from "react";

const addKaryawanCard = () => {
    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6">
        <div className="bg-blue-100 p-4 rounded-xl shadow-md w-full">
          <h2 className="text-center font-bold text-lg">FORM KARYAWAN</h2>
          <form className="mt-4">
            <label className="block text-sm font-medium">NIK</label>
            <input className="w-full p-2 border rounded-md mt-1" type="text" />
  
            <label className="block text-sm font-medium mt-3">Nama Karyawan</label>
            <input className="w-full p-2 border rounded-md mt-1" type="text" />
  
            <label className="block text-sm font-medium mt-3">Jabatan</label>
            <input className="w-full p-2 border rounded-md mt-1" type="text" />
  
            <label className="block text-sm font-medium mt-3">Nama SPV</label>
            <input className="w-full p-2 border rounded-md mt-1" type="text" />
  
            <label className="block text-sm font-medium mt-3">Nama Kabag</label>
            <input className="w-full p-2 border rounded-md mt-1" type="text" />
  
            <label className="block text-sm font-medium mt-3">Nama Direktur Bisnis</label>
            <input className="w-full p-2 border rounded-md mt-1" type="text" />
  
            <label className="block text-sm font-medium mt-3">Status</label>
            <div className="flex flex-col mt-2">
            <div className="flex items-center mb-2">
                <input type="radio" id="aktif" name="status" value="aktif" className="mr-2" />
                <label htmlFor="aktif">Aktif</label>
            </div>
            <div className="flex items-center">
                <input type="radio" id="nonAktif" name="status" value="nonAktif" className="mr-2" />
                <label htmlFor="nonAktif">Non-Aktif</label>
            </div>
            </div>
  
            <div className="flex justify-between mt-4">
              <Link href="/karyawan">
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

export default addKaryawanCard;