import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AlertDialog from "./alertEditDialog";

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
  namaUsaha: string;
  no_telp: string;
  nik?: number;
  desaKelurahanId?: string;
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
  id_nasabah?: number;
  hasilKunjungan: string;
  createdAt: string;
  nasabah: Nasabah;
}

interface EditKunjunganDialogProps {
  open: boolean;
  onClose: () => void;
  kunjungan: Kunjungan | null;
  onsave: (updatedKunjungan: Partial<Kunjungan>) => void;
}

const EditKunjunganDialog: React.FC<EditKunjunganDialogProps> = ({
  open,
  onClose,
  kunjungan,
  onsave,
}) => {
  const [hasilKunjungan, setHasilKunjungan] = useState("");
  const [kunjunganData, setKunjunganData] = useState<Kunjungan | null>(null);
  const [nasabah, setNasabah] = useState<Nasabah | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const { id } = useParams();

  // Kabupaten/Kota
  const [kabupatenKotaList, setKabupatenKotaList] = useState<KabupatenKota[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);

  const [selectedKota, setSelectedKota] = useState<KabupatenKota | null>(null);
  const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(null);
  const [selectedDesa, setSelectedDesa] = useState<DesaKelurahan | null>(null);

  const fetchKabupatenKota = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kabupaten-kota`);
      const data = await response.json();
      setKabupatenKotaList(data);
    } catch (error) {
      console.error("Error fetching kabupaten/kota:", error);
    }
  };

  const fetchKecamatan = async (id_kota: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kecamatan/filter/${id_kota}`);
      const data = await response.json();
      setKecamatanList(data);
    } catch (error) {
      console.error("Error fetching kecamatan:", error);
    }
  };

  const fetchDesaKelurahan = async (id_kecamatan: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/desa-kelurahan/filter/${id_kecamatan}`);
      const data = await response.json();
      setDesaKelurahanList(data);
    } catch (error) {
      console.error("Error fetching desa/kelurahan:", error);
    }
  };

  // //Maximum depth exceeded tapi wilayah semua bisa tampil
  // useEffect(() => {
  //   if (kunjungan) {
  //     console.log("Data Kunjungan dari API:", kunjungan);
  //     setHasilKunjungan(kunjungan.hasilKunjungan);
  //     setKunjunganData(kunjungan); // Pastikan kunjunganData juga diperbarui

  //     if (kunjungan.nasabah) {
  //       console.log("Data Nasabah dari API sebelum setState:", kunjungan.nasabah);

  //       setNasabah((prev) => {
  //         const updatedNasabah = {
  //           ...prev,
  //           ...kunjungan.nasabah,
  //           id_nasabah:
  //             kunjungan.nasabah.id_nasabah ?? prev?.id_nasabah ?? kunjungan.id_nasabah ?? null,
  //         };

  //         console.log("Data Nasabah setelah setState:", updatedNasabah);
  //         return updatedNasabah;
  //       });

  //       // Set initial values for selectedKota, selectedKecamatan, and selectedDesa
  //       const initialKota = kabupatenKotaList.find(
  //         (kota) => kota.nama === kunjungan.nasabah.desa.Kecamatan.KabupatenKota.nama
  //       );
  //       const initialKecamatan = kecamatanList.find(
  //         (kecamatan) => kecamatan.nama === kunjungan.nasabah.desa.Kecamatan.nama
  //       );
  //       const initialDesa = desaKelurahanList.find(
  //         (desa) => desa.nama === kunjungan.nasabah.desa.nama
  //       );

  //       setSelectedKota(initialKota || null);
  //       setSelectedKecamatan(initialKecamatan || null);
  //       setSelectedDesa(initialDesa || null);

  //       if (initialKota) fetchKecamatan(initialKota.id);
  //       if (initialKecamatan) fetchDesaKelurahan(initialKecamatan.id);
  //     } else {
  //       console.error("ID Nasabah tidak ditemukan dalam data kunjungan:", kunjungan);
  //     }
  //   }
  // }, [kunjungan, kabupatenKotaList, kecamatanList, desaKelurahanList]);

  //ga kena maximum exceed tapi kecamatan dan desa kelurahan tidak bisa tampil
  useEffect(() => {
    if (kunjungan) {
      console.log("Data Kunjungan dari API:", kunjungan);
      setHasilKunjungan(kunjungan.hasilKunjungan);
      setKunjunganData(kunjungan); 
  
      if (kunjungan.nasabah) {
        console.log("Data Nasabah dari API sebelum setState:", kunjungan.nasabah);
  
        setNasabah((prev) => ({
          ...prev,
          ...kunjungan.nasabah,
          id_nasabah:
            kunjungan.nasabah.id_nasabah ?? prev?.id_nasabah ?? kunjungan.id_nasabah ?? null,
        }));
  
        // Initialize selectedKota, selectedKecamatan, selectedDesa
        const initialKota = kabupatenKotaList.find(
          (kota) => kota.nama === kunjungan.nasabah.desa.Kecamatan.KabupatenKota.nama
        );
  
        if (initialKota) {
          setSelectedKota(initialKota);
          fetchKecamatan(initialKota.id); // Fetch only when needed
        }
  
        // Fetch kecamatan first, then find initial kecamatan
        if (kunjungan.nasabah.desa?.Kecamatan?.nama && kecamatanList.length > 0) {
          const initialKecamatan = kecamatanList.find(
            (kecamatan) => kecamatan.nama === kunjungan.nasabah.desa.Kecamatan.nama
          );
          if (initialKecamatan) {
            setSelectedKecamatan(initialKecamatan);
            fetchDesaKelurahan(initialKecamatan.id);
          }
        }
  
        // Set initialDesa when desaKelurahanList is ready
        if (kunjungan.nasabah.desa?.nama && desaKelurahanList.length > 0) {
          const initialDesa = desaKelurahanList.find(
            (desa) => desa.nama === kunjungan.nasabah.desa.nama
          );
          if (initialDesa) setSelectedDesa(initialDesa);
        }
  
      } else {
        console.error("ID Nasabah tidak ditemukan dalam data kunjungan:", kunjungan);
      }
    }
  }, [kunjungan, kabupatenKotaList]);
  
  useEffect(() => {
    fetchKabupatenKota();
  }, []);

  const handleSave = () => {
    setOpenAlert(true);
  };

  const fetchNasabah = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nasabah`);
      if (!response.ok) throw new Error("Gagal mengambil data nasabah");
      const data = await response.json();
      console.log("Data nasabah:", data);
      setNasabah(data); // Pastikan `setNasabahData` sudah ada di state
    } catch (error) {
      console.error("Error fetching nasabah data:", error);
    }
  };

  const handleConfirmSave = async () => {
    if (!kunjungan || !nasabah || !nasabah.id_nasabah) {
      console.error("ID nasabah tidak valid:", nasabah);
      alert("ID nasabah tidak ditemukan. Mohon periksa kembali data nasabah.");
      return;
    }

    try {
      // ✅ Update Data Kunjungan
      const updatedKunjungan: Partial<Kunjungan> = {
        id_kunjungan: kunjungan.id_kunjungan,
        hasilKunjungan,
      };

      const kunjunganResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kunjungan/${kunjungan.id_kunjungan}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedKunjungan),
        }
      );

      if (!kunjunganResponse.ok) {
        throw new Error("Gagal menyimpan data kunjungan");
      }

      // ✅ Update Data Nasabah
      const updatedNasabah: Partial<Nasabah> = {
        id_nasabah: nasabah.id_nasabah,
        namaNasabah: nasabah.namaNasabah,
        alamat: nasabah.alamat,
        namaUsaha: nasabah.namaUsaha,
        no_telp: nasabah.no_telp,
        nik: nasabah.nik,
        desaKelurahanId: nasabah.desaKelurahanId,
      };

      const nasabahResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/nasabah/${nasabah.id_nasabah}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedNasabah),
        }
      );

      if (!nasabahResponse.ok) {
        throw new Error("Gagal menyimpan data nasabah");
      }

      onsave(updatedKunjungan); // ✅ Refresh data kunjungan
      fetchNasabah(); // ✅ Refresh data nasabah setelah update
      onClose();
      setOpenAlert(false);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Kunjungan</DialogTitle>
        <DialogContent sx={{ marginTop: 3 }}>
          <TextField
            label="Nama Nasabah"
            value={nasabah?.namaNasabah || ""}
            margin="dense"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNasabah((prev) =>
                prev ? { ...prev, namaNasabah: e.target.value } : null
              )
            }
            fullWidth
          />
          <TextField
            label="Alamat"
            value={nasabah?.alamat || ""}
            margin="dense"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNasabah((prev) =>
                prev ? { ...prev, alamat: e.target.value } : null
              )
            }
            fullWidth
          />

          <Autocomplete
            options={kabupatenKotaList}
            getOptionLabel={(option) => option.nama}
            value={selectedKota}
            onChange={(e, newValue) => {
              setSelectedKota(newValue);
              setSelectedKecamatan(null);
              setSelectedDesa(null);
              if (newValue) fetchKecamatan(newValue.id);
            }}
            renderInput={(params) => <TextField {...params} label="Kabupaten/Kota" margin="dense" fullWidth />}
          />
          <Autocomplete
            options={kecamatanList}
            getOptionLabel={(option) => option.nama}
            value={selectedKecamatan}
            onChange={(e, newValue) => {
              setSelectedKecamatan(newValue);
              setSelectedDesa(null);
              if (newValue) fetchDesaKelurahan(newValue.id);
            }}
            renderInput={(params) => <TextField {...params} label="Kecamatan" margin="dense" fullWidth />}
          />
          <Autocomplete
            options={desaKelurahanList}
            getOptionLabel={(option) => option.nama}
            value={selectedDesa}
            onChange={(e, newValue) => setSelectedDesa(newValue)}
            renderInput={(params) => <TextField {...params} label="Desa/Kelurahan" margin="dense" fullWidth />}
          />

          <TextField
            label="Nama Usaha"
            value={nasabah?.namaUsaha || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNasabah((prev) =>
                prev ? { ...prev, namaUsaha: e.target.value } : null
              )
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="No. Telepon"
            value={nasabah?.no_telp || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNasabah((prev) =>
                prev ? { ...prev, no_telp: e.target.value } : null
              )
            }
            margin="dense"
            fullWidth
          />
          <TextField 
            label="Nama Karyawan" 
            value={nasabah?.karyawan?.namaKaryawan || ""} 
            margin="dense"
            fullWidth 
            disabled 
          />
          <TextField
            label="Hasil Kunjungan"
            value={hasilKunjungan}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHasilKunjungan(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="dense"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} color="primary">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <AlertDialog open={openAlert} onClose={() => setOpenAlert(false)} onConfirm={handleConfirmSave} />
    </>
  );
};

export default EditKunjunganDialog;