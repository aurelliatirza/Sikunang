import { useEffect, useState } from "react";
import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Chip } from "@mui/material";
import EditKaryawanDialog from "../Dialog/editKaryawanDialog";

type Status = "AKTIF" | "NON_AKTIF";

interface Karyawan {
  nik: number;
  namaKaryawan: string;
  jabatan: string;
  status: Status;
  kantor: { id_kantor: number; jenis_kantor: string };
  supervisor?: { nik: number; namaKaryawan: string };
  kepalaBagian?: { nik: number; namaKaryawan: string };
  direkturBisnis?: { nik: number; namaKaryawan: string };
}

const jabatanOptions = [
  { label: "HRD", value: "hrd" },
  { label: "Admin Slik", value: "adminSlik" },
  { label: "Marketing", value: "marketing" },
  { label: "SPV", value: "spv" },
  { label: "Kepala Bagian", value: "kabag" },
  { label: "Direktur Bisnis", value: "direkturBisnis" },
];

const KaryawanTable: React.FC = () => {
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState<Karyawan | null>(null);

  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const response = await fetch("http://localhost:8000/karyawan");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        setKaryawan(data);
      } catch (error) {
        console.error("Error fetching karyawan data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKaryawan();
  }, []);

  const handleEditClick = (item: Karyawan) => {
    setSelectedKaryawan(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedKaryawan(null);
  };

  const handleSave = async (updatedKaryawan: Karyawan) => {
    const payload = {
      namaKaryawan: updatedKaryawan.namaKaryawan,
      jabatan: updatedKaryawan.jabatan,
      status: updatedKaryawan.status,
      nik_SPV: updatedKaryawan.supervisor?.nik,
      nik_kabag: updatedKaryawan.kepalaBagian?.nik,
      nik_direkturBisnis: updatedKaryawan.direkturBisnis?.nik,
      id_kantor: updatedKaryawan.kantor.id_kantor,
    };

    try {
      const response = await fetch(`http://localhost:8000/karyawan/${updatedKaryawan.nik}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Gagal mengupdate data");

      setKaryawan((prev) =>
        prev.map((k) => (k.nik === updatedKaryawan.nik ? updatedKaryawan : k))
      );

      handleClose();
    } catch (error) {
      console.error("Error updating karyawan:", error);
    }
  };

  if (loading) return <p>Loading data...</p>;

  const getStatusLabel = (status: Status) => {
    switch (status) {
      case "AKTIF":
        return "AKTIF";
      case "NON_AKTIF":
        return "NON AKTIF";
      default:
        return status;
    }
  };

  const getJabatanLabel = (jabatan: string) => {
    const option = jabatanOptions.find((option) => option.value === jabatan);
    return option ? option.label : jabatan;
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-6 py-3 text-center rounded-tl-2xl">NIK</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Karyawan</th>
            <th className="px-6 py-3 text-center border-l border-white">Jabatan</th>
            <th className="px-6 py-3 text-center border-l border-white">Kantor</th>
            <th className="px-6 py-3 text-center border-l border-white">Status</th>
            <th className="px-6 py-3 text-center border-l border-white">SPV</th>
            <th className="px-6 py-3 text-center border-l border-white">Kabag</th>
            <th className="px-6 py-3 text-center border-l border-white">Direktur Bisnis</th>
            <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {karyawan.length > 0 ? (
            karyawan.map((item) => (
              <tr key={item.nik} className="text-center">
                <td className="px-6 py-4">{item.nik}</td>
                <td className="px-6 py-4">{item.namaKaryawan}</td>
                <td className="px-6 py-4">{getJabatanLabel(item.jabatan)}</td>
                <td className="px-6 py-4">{item.kantor?.jenis_kantor || "-"}</td>
                <td className="px-6 py-4">
                  <Chip
                    label={getStatusLabel(item.status)}
                    color={item.status === "AKTIF" ? "success" : "error"}
                    variant="filled" // Bisa diganti "outlined" jika ingin tanpa background
                  />
                </td>
                <td className="px-6 py-4">{item.supervisor?.namaKaryawan || "-"}</td>
                <td className="px-6 py-4">{item.kepalaBagian?.namaKaryawan || "-"}</td>
                <td className="px-6 py-4">{item.direkturBisnis?.namaKaryawan || "-"}</td>
                <td className="px-6 py-4 flex justify-center space-x-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => handleEditClick(item)}
                  >
                    <MdEditSquare size={20} /> Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center">
                    <RiDeleteBin6Fill /> Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                Tidak ada data karyawan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedKaryawan && (
        <EditKaryawanDialog
          open={open}
          onClose={handleClose}
          onSave={handleSave}
          karyawan={selectedKaryawan}
        />
      )}
    </div>
  );
};

export default KaryawanTable;