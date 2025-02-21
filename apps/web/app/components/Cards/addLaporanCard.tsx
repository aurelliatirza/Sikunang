import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import UploadComponent from "../Unggah/page";

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

interface Nasabah {
  id_nasabah: number;
  namaNasabah: string;
  alamat: string;
  no_telp: string;
  namaUsaha: string;
  nik: number;
}

interface Karyawan {
  nik: number;  // Sesuaikan dengan backend (pastikan `nik` ada)
  namaKaryawan: string;  // Sesuaikan dengan properti backend
}

interface FormDataType {
  namaNasabah: string;
  alamat: string;
  id_kota: string;
  id_kecamatan: string;
  id_kelurahan: string;
  no_telp: string;
  namaUsaha: string;
  nik: number;
  hasilKunjungan: string;
  foto_kunjungan: string;
  id_nasabah?: string; // Bisa undefined jika nasabah baru
}


const AddLaporanCard: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataType>({
    namaNasabah: "",
    alamat: "",
    id_kota: "",
    id_kecamatan: "",
    id_kelurahan: "",
    no_telp: "",
    namaUsaha: "",
    nik: 0,
    hasilKunjungan: "",
    foto_kunjungan: "",
    id_nasabah: "", // Bisa kosong untuk nasabah baru
  });

  const [KabupatenKotaList, setKabupatenKotaList] = useState<KabupatenKota[]>([]);
  const [KecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [DesaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [NasabahList, setNasabahList] = useState<Nasabah[]>([]);
  const [loading, setLoading] = useState(false);
  const [aoList, setAoList] = useState<Karyawan[]>([]);
  const [selectedAo, setSelectedAo] = useState<Karyawan | null>(null);  
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const fetchNasabah = async () => {
      try {
        const response = await fetch("http://localhost:8000/nasabah");
        const data = await response.json();
        setNasabahList(data);
      } catch (error) {
        console.log("Error fetching nasabah data: ", error);
      }
    };
    fetchNasabah();
  }, []);

  useEffect(() => {
    const fetchKabupatenKota = async () => {
      try {
        const response = await fetch("http://localhost:8000/kabupaten-kota");
        const data = await response.json();
        setKabupatenKotaList(data);
      } catch (error) {
        console.error("Error fetching kabupaten kota data:", error);
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
          setKecamatanList(data);
        } catch (error) {
          console.error("Error fetching kecamatan data:", error);
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
          setDesaKelurahanList(data);
        } catch (error) {
          console.error("Error fetching desa kelurahan data:", error);
        }
      }
    };
    fetchDesaKelurahan();
  }, [formData.id_kecamatan]);
  
  useEffect(() => {
    const fetchMarketing = async () => {
      try {
        const response = await fetch("http://localhost:8000/karyawan/marketing");
        const data: Karyawan[] = await response.json();  // Menyesuaikan tipe data
        setAoList(data);
      } catch (error) {
        console.error("Error fetching marketing data:", error);
      }
    };
  
    fetchMarketing();
  }, []);
  
  const handleSelectAo = (event: any, newValue: Karyawan | null) => {
    console.log("AO selected:", newValue); // Log data AO yang dipilih
    setSelectedAo(newValue);
    setFormData((prev) => ({
      ...prev,
      nik: newValue?.nik || 0, // Pastikan selalu mengambil `nik` yang benar
    }));
  };  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAutocompleteChange = (
    event: React.SyntheticEvent,
    value: string | Nasabah | null
  ) => {
    if (typeof value === "string") {
      // User mengetik sendiri
      setFormData({ ...formData, namaNasabah: value });
    } else if (value && "namaNasabah" in value) {
      // User memilih dari daftar (value adalah objek Nasabah)
      setFormData({ 
        ...formData, 
        namaNasabah: value.namaNasabah 
      });
    } else {
      // Jika null atau tidak valid
      setFormData({ ...formData, namaNasabah: "" });
    }
  
    console.log("Nama Nasabah dipilih:", value);
  };
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data sebelum submit:", formData);
  
    // Validasi field wajib
    const requiredFields: (keyof FormDataType)[] = [
      "namaNasabah", "alamat", "id_kota", "id_kecamatan", "id_kelurahan",
      "namaUsaha", "nik", "no_telp", "hasilKunjungan", "foto_kunjungan",
    ];
  
    if (requiredFields.some((field) => !formData[field]?.toString().trim())) {
      setAlert({ type: "error", message: "Field tidak boleh ada yang kosong." });
      return;
    }
  
    setLoading(true);
    setAlert(null);
  
    try {
      let idNasabah = formData.id_nasabah;
  
      if (!idNasabah) {
        console.log("Nasabah belum ada, cek apakah sudah ada di database...");
  
        const checkNasabah = await fetch("http://localhost:8000/nasabah/find", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            namaNasabah: formData.namaNasabah,
            no_telp: formData.no_telp,
            alamat: formData.alamat,
          }),
        });
  
        const nasabahData = await checkNasabah.json();
        console.log("Data hasil pencarian nasabah:", nasabahData);
  
        if (Array.isArray(nasabahData) && nasabahData.length > 0) {
          idNasabah = nasabahData[0].id_nasabah;
          console.log("Nasabah ditemukan dengan ID:", idNasabah);
        } else {
          console.log("Nasabah tidak ditemukan, membuat nasabah baru...");
  
          const nasabahBaru = {
            namaNasabah: formData.namaNasabah,
            alamat: formData.alamat,
            desaKelurahanId: String(formData.id_kelurahan), // Pastikan string
            namaUsaha: formData.namaUsaha,
            nik: Number(formData.nik), // Pastikan number
            no_telp: formData.no_telp,
          };
  
          console.log("Data yang dikirim ke backend untuk membuat nasabah:", nasabahBaru);
  
          const responseNasabah = await fetch("http://localhost:8000/nasabah", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nasabahBaru),
          });
  
          const newNasabah = await responseNasabah.json();
          console.log("Response dari backend saat membuat nasabah:", newNasabah);
  
          if (!responseNasabah.ok) {
            throw new Error(newNasabah.message || "Gagal menambahkan nasabah.");
          }
  
          idNasabah = newNasabah.id_nasabah;
          console.log("Nasabah baru berhasil dibuat dengan ID:", idNasabah);
        }
      }
  
      const kunjunganData = {
        foto_kunjungan: formData.foto_kunjungan,
        hasilKunjungan: formData.hasilKunjungan,
        id_nasabah: Number(idNasabah), // Pastikan ID nasabah dikirim sebagai number
      };
  
      console.log("Data yang dikirim ke backend untuk kunjungan:", kunjunganData);
  
      const responseKunjungan = await fetch("http://localhost:8000/kunjungan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(kunjunganData),
      });
  
      const resultKunjungan = await responseKunjungan.json();
      console.log("Response dari backend saat membuat kunjungan:", resultKunjungan);
  
      if (!responseKunjungan.ok) {
        throw new Error(resultKunjungan.message || "Gagal menambahkan kunjungan.");
      }
  
      setAlert({ type: "success", message: "Laporan Kunjungan berhasil ditambahkan!" });
      setTimeout(() => router.push("/laporan"), 1000);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat memproses data.";
      setAlert({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
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

        <form className="mt-4" onSubmit={handleSubmit}>
        {/* Field Nama Nasabah */}
          <label className="block text-sm font-medium">Nama Nasabah</label>
          <Autocomplete
            freeSolo
            options={NasabahList}
            getOptionLabel={(option) => (typeof option === "string" ? option : option.namaNasabah)}
            value={formData.namaNasabah}
            onChange={handleAutocompleteChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nama Nasabah"
                variant="outlined"
                name="namaNasabah"
                onChange={handleChange} // Untuk menangkap input manual juga
              />
            )}
          />




          {/* Field Alamat Nasabah */}
          <label className="block text-sm font-medium mt-3">Alamat</label>
          <TextField
            className="w-full"
            sx={{ backgroundColor: "white" }}
            type="text"
            name="alamat"
            value={formData.alamat}
            onChange={handleChange}
            placeholder="Masukkan Alamat"
          />

          {/* Field Kota */}
          <label className="block text-sm font-medium mt-3">Kota</label>
          <Autocomplete
            sx={{ backgroundColor: "white" }}
            options={KabupatenKotaList.map((kota) => ({ label: kota.nama, value: kota.id }))}
            renderInput={(params) => <TextField {...params} placeholder="Pilih Kota" />}
            onChange={(event, newValue) =>
              setFormData({ ...formData, id_kota: newValue?.value || "" })
            }
          />

          {/* Field Kecamatan */}
          <label className="block text-sm font-medium mt-3">Kecamatan</label>
          <Autocomplete
            sx={{ backgroundColor: "white" }}
            options={KecamatanList}
            getOptionLabel={(option) => option.nama}
            value={KecamatanList.find((kec) => kec.id === formData.id_kecamatan) || null}
            onChange={(event, newValue) =>
              setFormData({ ...formData, id_kecamatan: newValue?.id || "" })
            }
            disabled={!formData.id_kota}
            renderInput={(params) => <TextField {...params} placeholder="Pilih Kecamatan"  />}
            className="mt-1"
          />

          {/* Field Kelurahan */}
          <label className="block text-sm font-medium mt-3">Kelurahan</label>
          <Autocomplete
              sx={{ backgroundColor: "white" }}
              options={DesaKelurahanList}
              getOptionLabel={(option) => option.nama}
              value={DesaKelurahanList.find((desa) => desa.id === formData.id_kelurahan) || null}
              onChange={(event, newValue) =>
                  setFormData({ ...formData, id_kelurahan: newValue?.id || "" })
              }
              disabled={!formData.id_kecamatan}
              renderInput={(params) => <TextField {...params} placeholder="Pilih Kelurahan" />}
              className="mt-1"
          />


          <label className="block text-sm font-medium mt-3">No. Telp/HP</label>
          <TextField 
            sx={{ backgroundColor: "white" }}
            className="w-full" 
            type="text" 
            name="no_telp" 
            value={formData.no_telp} 
            onChange={handleChange} 
            placeholder="Masukkan No. Telp" />

          <label className="block text-sm font-medium mt-3">Usaha</label>
          <TextField sx={{ backgroundColor: "white" }} className="w-full" type="text" name="namaUsaha" value={formData.namaUsaha} onChange={handleChange} placeholder="Masukkan Nama Usaha" />

          {/* Ao nya */}
          <label className="block text-sm font-medium mt-3">AO (Account Officer)</label>
          <Autocomplete
            sx={{ backgroundColor: "white" }}
            options={aoList}
            getOptionLabel={(option) => option.namaKaryawan}
            value={aoList.find((ao) => ao.nik === formData.nik) || null} 
            onChange={(event, newValue) =>
              setFormData((prev) => ({
                ...prev,
                nik: newValue?.nik || 0, // Pastikan selalu number
              }))
            }
            renderInput={(params) => <TextField {...params} placeholder="Pilih AO" />}
            className="mt-1"
          />




          <label className="block text-sm font-medium mt-3">Hasil Kunjungan</label>
          <TextField 
          sx={{ backgroundColor: "white" }} 
          className="w-full" 
          type="text" 
          name="hasilKunjungan" 
          value={formData.hasilKunjungan} 
          onChange={handleChange} 
          placeholder="Masukkan Hasil Kunjungan" />

          <UploadComponent
            onUpload={(filePath) => setFormData({ ...formData, foto_kunjungan: filePath })}
          />
          
          <div className="flex justify-between mt-4">
            <Link href="/laporan">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                BATALKAN
              </button>
            </Link>
            <button type="submit" className="bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md">
              SIMPAN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLaporanCard;
