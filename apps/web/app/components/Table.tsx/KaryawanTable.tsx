import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

const KaryawanTable: React.FC = () => {
  const data = [
    {
      no: 1,
      nik: 100123456789,
      namaKaryawan: "Rendra",
      jabatan: "Marketing",
      SPV: "Baba",
      kabag: "Dedy",
      direkturBisnis: "Rhino",
      status: "Aktif",
    },
    {
        no: 2,
        nik: 200123456789,
        namaKaryawan: "Budiono",
        jabatan: "Marketing",
        SPV: "Baba",
        kabag: "Dedy",
        direkturBisnis: "Rhino",
        status: "Aktif",
    },
    {
        no: 3,
        nik: 300123456789,
        namaKaryawan: "Andri",
        jabatan: "Marketing",
        SPV: "Yatno",
        kabag: "Dedy",
        direkturBisnis: "Rhino",
        status: "Aktif",
    },
    {
        no: 4,
        nik: 400123456789,
        namaKaryawan: "Lutfi",
        jabatan: "Marketing",
        SPV: "Yatno",
        kabag: "Dedy",
        direkturBisnis: "Rhino",
        status: "Aktif",
    },
    {
        no: 5,
        nik: 500123456789,
        namaKaryawan: "Baba",
        jabatan: "SPV",
        SPV: " ",
        kabag: "Dedy",
        direkturBisnis: "Rhino",
        status: "Aktif",
    },
    {
        no: 6,
        nik: 600123456789,
        namaKaryawan: "Yatno",
        jabatan: "SPV",
        SPV: " ",
        kabag: "Dedy",
        direkturBisnis: "Rhino",
        status: "Aktif",
    },
    {
        no: 7,
        nik: 700123456789,
        namaKaryawan: "Dedy",
        jabatan: "Kabag",
        SPV: " ",
        kabag: " ",
        direkturBisnis: "Rhino",
        status: "Aktif",
    },
    {
        no: 8,
        nik: 800123456789,
        namaKaryawan: "Rhino",
        jabatan: "Direktur Bisnis",
        SPV: " ",
        kabag: " ",
        direkturBisnis: " ",
        status: "Aktif",
    },
    // Data lainnya...
  ];

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-[1200px] text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-6 py-3 text-center rounded-tl-2xl">No</th>
            <th className="px-6 py-3 text-center border-l border-white">NIK</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Karyawan</th>
            <th className="px-6 py-3 text-center border-l border-white">Jabatan</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama SPV</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Kabag</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Direktur Bisnis</th>
            <th className="px-6 py-3 text-center border-l border-white">Status</th>
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
                {item.nik}
              </td>
              <td className="px-6 py-3 text-center border-l border-white">{item.namaKaryawan}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.jabatan}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.SPV}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.kabag}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.direkturBisnis}</td>
              <td className="px-6 py-3 text-center border-l border-white">{item.status}</td>
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

export default KaryawanTable;
