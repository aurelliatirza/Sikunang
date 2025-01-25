import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

const MarketingTable: React.FC = () => {
  const data = [
    {
      no: 1,
      namaNasabah: "Mustakin",
      alamat: "Jl. Merdeka No. 1",
      kelurahan: "Beringin",
      kecamatan: "Ngaliyan",
      kota: "Kota Semarang",
      namaUsaha: "Toko Sembako",
      waktuKunjungan: "2025-10-01 10.54",
      hasilKunjungan: "Tertarik",
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
      waktuKunjungan: "2025-10-01 10.54",
      hasilKunjungan: "Tertarik",
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
      waktuKunjungan: "2025-10-01 10.54",
      hasilKunjungan: "Belum Tertarik",
      namaAO: "Indah",
    }
    // Data lainnya...
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
            <th className="px-6 py-3 text-center border-l border-white">Waktu Kunjungan</th>
            <th className="px-6 py-3 text-center border-l border-white">Hasil Kunjungan</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama AO</th>
            <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="px-6 py-3 text-center">{item.no}</td>
              <td className="px-6 py-3 text-center border-l border-white">
                {item.namaNasabah}
              </td>
              <td className="px-6 py-3 text-center border-l border-white">{item.alamat}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.kelurahan}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.kecamatan}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.kota}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.namaUsaha}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.waktuKunjungan}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.hasilKunjungan}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.namaAO}</td>
              <td className="px-6 py-4 text-center border-l border-white">
                <div className="flex justify-center space-x-2">
                  <button className="text-yellow-500 hover:text-yellow-600">
                    <MdEditSquare className="w-6 h-6" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <RiDeleteBin6Fill className="w-6 h-6" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarketingTable;
