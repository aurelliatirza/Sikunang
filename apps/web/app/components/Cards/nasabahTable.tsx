import React from "react";

const NasabahTable: React.FC = () => {
  const data = [
    {
      no: 1,
      nama: "John Doe",
      alamat: "Jl. Lorem Ipsum",
      noTelp: "08123456789",
      jumlahKunjungan: 1,
      ao: "Dikta Wicaksono",
    },
    {
      no: 2,
      nama: "Jane Doe",
      alamat: "Jl. Lorem Ipsum",
      noTelp: "08123456789",
      jumlahKunjungan: 3,
      ao: "Dikta Wicaksono",
    },
    {
      no: 3,
      nama: "John Smith",
      alamat: "Jl. Lorem Ipsum",
      noTelp: "08123456789",
      jumlahKunjungan: 2,
      ao: "Fleamus Potter",
    },
  ];

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
                <td className="px-4 py-2">{item.no}</td>
                <td className="border px-4 py-2">{item.nama}</td>
                <td className="border px-4 py-2">{item.alamat}</td>
                <td className="border px-4 py-2">{item.noTelp}</td>
                <td className="border px-4 py-2">{item.jumlahKunjungan}</td>
                <td className="border px-4 py-2">{item.ao}</td>
                <td className="border px-4 py-2">
                  <button className="text-blue-500 hover:text-blue-700 hover:underline">
                    Lihat Selengkapnya
                  </button>
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