import React from "react";
import Link from "next/link";
import { useEffect } from "react";

interface NasabahWithCount {
  id_nasabah: number;
  namaNasabah: string;
  alamat: string;
  no_telp: string;
  jumlahKunjungan: number;
  karyawan: {
    namaKaryawan: string;
  };
}

const NasabahTable: React.FC = () => {
  const [data, setData] = React.useState<NasabahWithCount[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/nasabah/kunjungan");
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }
  , []);

  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-full"> {/* Wrapper untuk memastikan overflow scroll berfungsi */}
        <table className="min-w-[1200px] text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border px-4 py-2 rounded-tl-2xl">No</th>
              <th className="border px-4 py-2">Nama</th>
              <th className="border px-4 py-2">Alamat</th>
              <th className="border px-4 py-2">No. Telepon</th>
              <th className="border px-4 py-2">Jumlah Kunjungan</th>
              <th className="border px-4 py-2">AO</th>
              <th className="border px-4 py-2 rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.namaNasabah}</td>
                <td className="border px-4 py-2">{item.alamat}</td>
                <td className="border px-4 py-2">{item.no_telp}</td>
                <td className="border px-4 py-2">{item.jumlahKunjungan}</td>
                <td className="border px-4 py-2">{item.karyawan.namaKaryawan}</td>
                <td className="border px-4 py-2">
                  <Link href={`/nasabah/${item.id_nasabah}`}>
                    <button className="text-blue-500 hover:text-blue-700 hover:underline">
                      Lihat Selengkapnya
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NasabahTable;