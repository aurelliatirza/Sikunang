import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";
import UploadComponent from "../Upload/page";

interface KabupatenKota {
  id: string;
  nama: string;
}

interface Kecamatan {
  id: string;
  nama: string;
  kabupatenKotaId: string;
}

interface DesaKelurahan {
  id: string;
  kecamatanId: string;
  nama: string;
}

const AddLaporanCard: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaNasabah: "",
    alamat: "",
    id_kota: "",
    id_kecamatan: "",
    id_kelurahan: "",
    no_telp: "",
    namaUsaha: "",
    nik: "",
    hasilKunjungan: "",
    foto_kunjungan: "",
  });

  const [KabupatenKotaList, setKabupatenKotaList] = useState<KabupatenKota[]>([]);
  const [KecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [DesaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  useEffect(() => {
    const fetchKabupatenKota = async () => {
      try {
        const response = await fetch("http://localhost:8000/kabupaten-kota");
        const data = await response.json();
    
        console.log("Respons Data KabupatenKota:", data); // Tambahkan ini untuk melihat struktur data
    
        if (Array.isArray(data)) {
          setKabupatenKotaList(data);
        } else {
          console.error("Data KabupatenKota tidak berbentuk array:", data);
          setKabupatenKotaList([]); 
        }
      } catch (error) {
        console.error("Error fetching kabupaten kota data:", error);
        setKabupatenKotaList([]); 
      }
    };    
  
    fetchKabupatenKota();
  }, []);
  
  useEffect(() => {
    const fetchKecamatan = async () => {
      if (formData.id_kota) {
        try {
          const response = await fetch(`http://localhost:8000/kecamatan/filter/${formData.id_kota}`);
          const data = await response.json();

          // Debugging: log data to check the structure
          console.log("Respons Data Kecamatan:", data);

          if (Array.isArray(data)) {
            setKecamatanList(data);
          } else {
            console.error("Data Kecamatan tidak berbentuk array:", data);
            setKecamatanList([]);
          }
        } catch (error) {
          console.error("Error fetching kecamatan data:", error);
          setKecamatanList([]);
        }
      }
    };

    fetchKecamatan();
  }, [formData.id_kota]);

  useEffect(() => {
    const fetchDesaKelurahan = async () => {
      if (formData.id_kecamatan) {
        try {
          const response = await fetch(`http://localhost:8000/desa-kelurahan/filter/${formData.id_kecamatan}`);
          const data = await response.json();

          // Debugging: log data to check the structure
          console.log("Respons Data DesaKelurahan:", data);

          if (Array.isArray(data)) {
            setDesaKelurahanList(data);
          } else {
            console.error("Data DesaKelurahan tidak berbentuk array:", data);
            setDesaKelurahanList([]);
          }
        } catch (error) {
          console.error("Error fetching desa kelurahan data:", error);
          setDesaKelurahanList([]);
        }
      }
    };

    fetchDesaKelurahan();
  }, [formData.id_kecamatan]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Reset dependent fields
    if (name === "id_kota") {
      setFormData((prev) => ({
        ...prev,
        id_kecamatan: "",
        id_kelurahan: "",
      }));
    } else if (name === "id_kecamatan") {
      setFormData((prev) => ({
        ...prev,
        id_kelurahan: "",
      }));
    }
  };
  

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6">
      <div className="bg-blue-100 p-4 rounded-xl shadow-md w-full">
        <h2 className="text-center font-bold text-lg">AKTIVITAS PENJUALAN AO/MARKETING</h2>

        {alert && (
          <Alert severity={alert.type} className="mt-3">
            {alert.message}
          </Alert>
        )}

        <form className="mt-4">
          <label className="block text-sm font-medium">Nama</label>
          <input
            className="w-full p-2 border rounded-md mt-1"
            type="text"
            name="namaNasabah"
            value={formData.namaNasabah}
            onChange={handleChange}
          />

          <label className="block text-sm font-medium mt-3">Alamat</label>
          <input
            className="w-full p-2 border rounded-md mt-1"
            type="text"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
          />

          <label className="block text-sm font-medium mt-3">Kota</label>
          <select
            name="id_kota"
            className="w-full p-2 border rounded-md mt-1"
            value={formData.id_kota}
            onChange={handleChange}
          >
            <option value="">Pilih Kota</option>
            {KabupatenKotaList.map((kota) => (
              <option key={kota.id} value={kota.id}>
                {kota.nama}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mt-3">Kecamatan</label>
          <select
            name="id_kecamatan"
            className="w-full p-2 border rounded-md mt-1"
            value={formData.id_kecamatan}
            onChange={handleChange}
            disabled={!formData.id_kota}
          >
            <option value="">Pilih Kecamatan</option>
            {KecamatanList.map((kecamatan) => (
              <option key={kecamatan.id} value={kecamatan.id}>
                {kecamatan.nama}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mt-3">Kelurahan</label>
          <select
            name="id_kelurahan"
            className="w-full p-2 border rounded-md mt-1"
            value={formData.id_kelurahan}
            onChange={handleChange}
            disabled={!formData.id_kecamatan}
          >
            <option value="">Pilih Kelurahan</option>
            {DesaKelurahanList.map((desa) => (
              <option key={desa.id} value={desa.id}>
                {desa.nama}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium mt-3">No. Telp/HP</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">Usaha</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">AO</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <label className="block text-sm font-medium mt-3">Hasil Kunjungan</label>
          <input className="w-full p-2 border rounded-md mt-1" type="text" />

          <UploadComponent />

          <div className="flex justify-between mt-4">
            <Link href="/laporan">
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

export default AddLaporanCard;
