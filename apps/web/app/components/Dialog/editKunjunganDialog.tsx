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

  //Kabupaten Kota
    const [KabupatenKotaList, setKabupatenKotaList] = useState<KabupatenKota[]>([]);
    const [KecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
    const [DesaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
    const [selectedKota, setSelectedKota] = useState("");
    const [selectedKecamatan, setSelectedKecamatan] = useState("");
    const [selectedDesa, setSelectedDesa] = useState("");
    
  useEffect(() => {
    if (kunjungan) {
      console.log("Data Kunjungan dari API:", kunjungan);
      setHasilKunjungan(kunjungan.hasilKunjungan);
      setKunjunganData(kunjungan); // Pastikan kunjunganData juga diperbarui
  
      if (kunjungan.nasabah) {
        console.log("Data Nasabah dari API sebelum setState:", kunjungan.nasabah);
  
        setNasabah((prev) => {
          const updatedNasabah = {
            ...prev,
            ...kunjungan.nasabah,
            id_nasabah:
              kunjungan.nasabah.id_nasabah ?? prev?.id_nasabah ?? kunjungan.id_nasabah ?? null,
          };
  
          console.log("Data Nasabah setelah setState:", updatedNasabah);
          return updatedNasabah;
        });
      } else {
        console.error("ID Nasabah tidak ditemukan dalam data kunjungan:", kunjungan);
      }
    }
  }, [kunjungan]);  
  
  
  const handleSave = () => {
    setOpenAlert(true);
  };

  const fetchNasabah = async () => {
    try {
      const response = await fetch("http://localhost:8000/nasabah");
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
        `http://localhost:8000/kunjungan/${kunjungan.id_kunjungan}`,
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
        nik: 98,
        desaKelurahanId: "3301092009",
      };
  
      const nasabahResponse = await fetch(
        `http://localhost:8000/nasabah/${nasabah.id_nasabah}`,
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
          <TextField 
          label="Kabupaten/Kota" 
          value={nasabah?.desa?.Kecamatan?.KabupatenKota?.nama || ""} 
          margin="dense"
          fullWidth />
          <TextField 
          label="Kecamatan" 
          value={nasabah?.desa?.Kecamatan?.nama || ""} 
          margin="dense"
          fullWidth />
          <TextField 
          label="Desa/Kelurahan" 
          value={nasabah?.desa?.nama || ""} 
          margin="dense"
          fullWidth />
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
          disabled />
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
