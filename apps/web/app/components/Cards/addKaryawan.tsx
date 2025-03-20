import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material";

interface Kantor {
  id_kantor: number;
  jenis_kantor: string;
}

interface Karyawan {
  nik: number;
  namaKaryawan: string;
  jabatan: string;
}

const jabatanOptions = [
  { label: "HRD", value: "hrd" },
  { label: "Admin Slik", value: "adminSlik" },
  { label: "Marketing", value: "marketing" },
  { label: "SPV", value: "spv" },
  { label: "Kepala Bagian", value: "kabag" },
  { label: "Kepala Cabang", value: "kacab"},
  { label: "Direktur Bisnis", value: "direkturBisnis" },
];

const AddKaryawanCard: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nik: "",
    namaKaryawan: "",
    jabatan: "",
    nik_SPV: "",
    nik_kabag: "",
    nik_direkturBisnis: "",
    status: "AKTIF",
    id_kantor: "",
  });

  const [kantorList, setKantorList] = useState<Kantor[]>([]);
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const fetchKantor = async () => {
      try {
        const response = await fetch("http://localhost:8000/kantor");
        const data = await response.json();
        setKantorList(data);
      } catch (error) {
        console.error("Error fetching kantor data:", error);
      }
    };

    const fetchKaryawan = async () => {
      try {
        const response = await fetch("http://localhost:8000/karyawan");
        const data = await response.json();
        setKaryawanList(data);
      } catch (error) {
        console.log("Error fetching Karyawan Data:", error);
      }
    };

    fetchKantor();
    fetchKaryawan();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi jika field wajib kosong
    if (!formData.nik || !formData.namaKaryawan || !formData.jabatan || !formData.id_kantor) {
      setAlert({ type: "error", message: "NIK, Nama Karyawan, Jabatan, dan Kantor tidak boleh kosong." });
      return;
    }

    setLoading(true);
    setAlert(null); // Reset alert sebelum request baru

    try {
      // Check for duplicate NIK
      const checkResponse = await fetch(`http://localhost:8000//karyawan/search?nik=${formData.nik}`);
      const checkData = await checkResponse.json();

      if (checkData.length > 0) {
        setAlert({ type: "error", message: "NIK telah terdaftar." });
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/karyawan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          nik: Number(formData.nik),
          nik_SPV: formData.nik_SPV ? Number(formData.nik_SPV) : null,
          nik_kabag: formData.nik_kabag ? Number(formData.nik_kabag) : null,
          nik_direkturBisnis: formData.nik_direkturBisnis ? Number(formData.nik_direkturBisnis) : null,
          id_kantor: Number(formData.id_kantor),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setAlert({ type: "error", message: result.message || "Gagal menambahkan karyawan." });
        return;
      }

      setAlert({ type: "success", message: "Karyawan berhasil ditambahkan." });
      setTimeout(() => router.push("/karyawan"), 1000);
    } catch (error) {
      console.error("Error:", error);
      setAlert({ type: "error", message: "Terjadi kesalahan saat menambahkan karyawan." });
    } finally {
      setLoading(false);
    }
  };

  const filterKaryawanByJabatan = (jabatan: string) => {
    return karyawanList.filter((karyawan) => karyawan.jabatan === jabatan);
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6">
      <div className="bg-blue-100 p-4 rounded-xl shadow-md w-full">
        <h2 className="text-center font-bold text-lg">FORM KARYAWAN</h2>

        {alert && (
          <Alert severity={alert.type} className="mt-3">
            {alert.message}
          </Alert>
        )}

        <form className="mt-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">NIK</label>
          <input
            name="nik"
            value={formData.nik}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mt-1"
            type="number"
            required
          />

          <label className="block text-sm font-medium mt-3">Nama Karyawan</label>
          <input
            name="namaKaryawan"
            value={formData.namaKaryawan}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mt-1"
            type="text"
            required
          />

          <label className="block text-sm font-medium mt-3">Jabatan</label>
          <select
            name="jabatan"
            value={formData.jabatan}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mt-1"
            required
          >
            <option value="" disabled>
              Pilih Jabatan
            </option>
            {jabatanOptions.map((jabatan) => (
              <option key={jabatan.value} value={jabatan.value}>
                {jabatan.label}
              </option>
            ))}
          </select>

          {/* Dropdown SPV */}
          <label className="block text-sm font-medium mt-3">Nama SPV</label>
          <select
            name="nik_SPV"
            value={formData.nik_SPV}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value="">Pilih SPV</option>
            {filterKaryawanByJabatan("spv").map((karyawan) => (
              <option key={karyawan.nik} value={karyawan.nik}>
                {karyawan.namaKaryawan}
              </option>
            ))}
          </select>

          {/* Dropdown Kabag */}
          <label className="block text-sm font-medium mt-3">Nama Kabag</label>
          <select
            name="nik_kabag"
            value={formData.nik_kabag}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value="">Pilih Kabag</option>
            {filterKaryawanByJabatan("kabag").map((karyawan) => (
              <option key={karyawan.nik} value={karyawan.nik}>
                {karyawan.namaKaryawan}
              </option>
            ))}
          </select>

          {/* Dropdown Direktur Bisnis */}
          <label className="block text-sm font-medium mt-3">Nama Direktur Bisnis</label>
          <select
            name="nik_direkturBisnis"
            value={formData.nik_direkturBisnis}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mt-1"
          >
            <option value="">Pilih Direktur Bisnis</option>
            {filterKaryawanByJabatan("direkturBisnis").map((karyawan) => (
              <option key={karyawan.nik} value={karyawan.nik}>
                {karyawan.namaKaryawan}
              </option>
            ))}
          </select>

          {/* Dropdown Kantor */}
          <label className="block text-sm font-medium mt-3">Jenis Kantor</label>
          <select
            name="id_kantor"
            value={formData.id_kantor}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mt-1"
            required
          >
            <option value="" disabled>
              Pilih Kantor
            </option>
            {kantorList.map((kantor) => (
              <option key={kantor.id_kantor} value={kantor.id_kantor}>
                {kantor.jenis_kantor}
              </option>
            ))}
          </select>

          <div className="flex justify-between mt-4">
            <Link href="/karyawan">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                BATALKAN
              </button>
            </Link>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "KIRIM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddKaryawanCard;
