import { useEffect, useState } from "react";
import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

interface Karyawan {
  nik: number;
  namaKaryawan: string;
  jabatan: string;
  kantor: {
    jenis_kantor: string;
  };
}

const KaryawanTable: React.FC = () => {
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const response = await fetch("http://localhost:3000/karyawan");
        const data = await response.json();
        setKaryawan(data);
      } catch (error) {
        console.error("Error fetching karyawan data:", error);
      }
    };

    fetchKaryawan();
  }, []);

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-6 py-3 text-center rounded-tl-2xl">NIK</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Karyawan</th>
            <th className="px-6 py-3 text-center border-l border-white">Jabatan</th>
            <th className="px-6 py-3 text-center border-l border-white">Kantor</th>
            <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {karyawan.map((item) => (
            <tr key={item.nik} className="text-center">
              <td className="px-6 py-4">{item.nik}</td>
              <td className="px-6 py-4">{item.namaKaryawan}</td>
              <td className="px-6 py-4">{item.jabatan}</td>
              <td className="px-6 py-4">{item.kantor.jenis_kantor}</td>
              <td className="px-6 py-4 flex justify-center space-x-2">
                <button className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
                  <MdEditSquare size={20} /> Edit
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center">
                  <RiDeleteBin6Fill /> Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KaryawanTable;