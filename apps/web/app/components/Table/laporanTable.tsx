import { useEffect, useState } from "react";
import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

interface Nasabah {
  namaNasabah: string;
  alamat: string;
  namaUsaha: string;
  no_telp: string;
  karyawan: {
    namaKaryawan: string;
  };
  desa: {
    nama: string;
    Kecamatan: {
      nama: string;
      KabupatenKota: {
        nama: string;
      };
    };
  };
}

interface Kunjungan {
  id_kunjungan: number;
  hasilKunjungan: string;
  createdAt: string;
  nasabah: Nasabah;
}

const LaporanTable: React.FC = () => {
  const [kunjunganData, setKunjunganData] = useState<Kunjungan[]>([]);

  useEffect(() => {
    const fetchKunjungan = async () => {
      try {
        const response = await fetch("http://localhost:8000/kunjungan");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        console.log("Data kunjungan:", data);
        setKunjunganData(data);
      } catch (error) {
        console.error("Error fetching kunjungan data:", error);
      }
    };

    fetchKunjungan();
  }, []);


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
          {kunjunganData.length > 0 ? (
            kunjunganData
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((item, index) => (
              <tr
                key={item.id_kunjungan}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="px-6 py-3 text-center">{index + 1}</td>
                <td className="px-6 py-3 text-center border-l border-white">
                  {item.nasabah.namaNasabah}
                </td>
                <td className="px-6 py-3 text-center border-l border-white">
                  {item.nasabah.alamat}
                </td>
                <td className="px-6 py-3 text-center border-l border-white">
                  {item.nasabah.desa.nama}
                </td>
                <td className="px-6 py-3 text-center border-l border-white">
                  {item.nasabah.desa.Kecamatan.nama}
                </td>
                <td className="px-6 py-3 text-center border-l border-white">
                  {item.nasabah.desa.Kecamatan.KabupatenKota.nama}
                </td>
                <td className="px-6 py-3 text-center border-l border-white">
                  {item.nasabah.namaUsaha}
                </td>
                <td className="px-6 py-3 text-center border-l border-white">
                  {new Date(item.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </td>
                <td className="px-6 py-3 text-center border-l border-white">
                  {item.hasilKunjungan}
                </td>
                <td className="px-6 py-3 text-center border-l border-white">
                  {item.nasabah.karyawan.namaKaryawan}
                </td>
                <td className="px-6 py-4 text-center border-l border-white">
                  <div className="flex justify-center space-x-2">
                    <button className="text-yellow-500 hover:text-yellow-600">
                      <MdEditSquare size={36} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <RiDeleteBin6Fill size={36} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={11} className="text-center py-6 text-gray-500">
                Tidak ada data kunjungan yang tersedia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LaporanTable;
