import React from "react";

const AnalisisSlikTable: React.FC = () => {
  const data = [
    {
      no: 1,
      namaNasabah: "Mustakin",
      alamat: "Jl. Merdeka No. 1",
      kelurahan: "Beringin",
      kecamatan: "Ngaliyan",
      kota: "Kota Semarang",
      namaUsaha: "Toko Sembako",
      waktuPengajuan: "2025-10-01 10.54",
      statusPengajuan: "sedang Diajukan",
      waktuSlik: "2025-10-15 11.04",
      statusSlik: "lanjut",
      waktuAnalisis: "2025-10-15 11.04",
      statusAnalisis: "tolak",
      namaAO: "Airin",
    },
    {
      no: 2,
      namaNasabah: "Siti",
      alamat: "Jl. Merdeka No. 2",
      kelurahan: "Durian",
      kecamatan: "Tembalang",
      kota: "Kota Semarang",
      namaUsaha: "Toko Buku",
      waktuPengajuan: "2025-10-01 10.54",
      statusPengajuan: "sedang Diajukan",
      waktuSlik: "2025-10-15 11.04",
      statusSlik: "lanjut",
      waktuAnalisis: "2025-10-15 11.04",
      statusAnalisis: "setuju",
      namaAO: "Permatasari",
    },
    {
      no: 3,
      namaNasabah: "Rahmat",
      alamat: "Jl. Merdeka No. 3",
      kelurahan: "Pringapus",
      kecamatan: "Ungaran",
      kota: "Kabupaten Semarang",
      namaUsaha: "Ternak Sapi",
      statusPengajuan: "Sedang Diajukan",
      waktuPengajuan: "2025-10-01 10.54",
      waktuSlik: "2025-10-15 11.04",
      statusSlik: "lanjut",
      waktuAnalisis: "2025-10-15 11.04",
      statusAnalisis: "setuju",
      namaAO: "Indah",
    },
  ];

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-[1200px] text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-6 py-3 text-center rounded-tl-2xl">No</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Nasabah</th>
            <th className="px-6 py-3 text-center border-l border-white">Alamat</th>
            <th className="px-6 py-3 text-center border-l border-white">Kelurahan</th>
            <th className="px-6 py-3 text-center border-l border-white">Kecamatan</th>
            <th className="px-6 py-3 text-center border-l border-white">Kota</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Usaha</th>
            <th className="px-6 py-3 text-center border-l border-white">Waktu Pengajuan</th>
            <th className="px-6 py-3 text-center border-l border-white">Status Pengajuan</th>
            <th className="px-6 py-3 text-center border-l border-white">Waktu Slik</th>
            <th className="px-6 py-3 text-center border-l border-white">Status Slik</th>
            <th className="px-6 py-3 text-center border-l border-white">Waktu Analisis</th>
            <th className="px-6 py-3 text-center border-l border-white">Status Analisis</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama AO</th>
            <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center">
              <td className="px-6 py-4">{item.no}</td>
              <td className="px-6 py-4">{item.namaNasabah}</td>
              <td className="px-6 py-4">{item.alamat}</td>
              <td className="px-6 py-4">{item.kelurahan}</td>
              <td className="px-6 py-4">{item.kecamatan}</td>
              <td className="px-6 py-4">{item.kota}</td>
              <td className="px-6 py-4">{item.namaUsaha}</td>
              <td className="px-6 py-4">{item.waktuPengajuan}</td>
              <td className="px-6 py-4">{item.statusPengajuan}</td>
              <td className="px-6 py-4">{item.waktuSlik}</td>
              <td className="px-6 py-4">{item.statusSlik}</td>
              <td className="px-6 py-4">{item.waktuAnalisis}</td>
              <td className="px-6 py-4">{item.statusAnalisis}</td>
              <td className="px-6 py-4">{item.namaAO}</td>
              <td className="px-6 py-4 flex space-x-2">
                <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md">
                    Tolak
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md">
                    Setuju
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnalisisSlikTable;