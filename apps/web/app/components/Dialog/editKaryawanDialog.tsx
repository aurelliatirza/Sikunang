import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";

interface Karyawan {
  nik: number;
  namaKaryawan: string;
  jabatan: string;
  status: "AKTIF" | "NON_AKTIF";
  kantor: { id_kantor: number; jenis_kantor: string };
  supervisor?: { nik: number; namaKaryawan: string };
  kepalaBagian?: { nik: number; namaKaryawan: string };
  direkturBisnis?: { nik: number; namaKaryawan: string };
}

interface Kantor {
  id_kantor: number;
  jenis_kantor: string;
}

const jabatanOptions = [
  { label: "HRD", value: "hrd" },
  { label: "Admin Slik", value: "adminSlik" },
  { label: "Marketing", value: "marketing" },
  { label: "SPV", value: "spv" },
  { label: "Kepala Bagian", value: "kabag" },
  { label: "Direktur Bisnis", value: "direkturBisnis" },
];

interface EditKaryawanModalProps {
  open: boolean;
  onClose: () => void;
  karyawan: Karyawan | null;
  onSave: (updatedKaryawan: any) => void;
}

const EditKaryawanDialog: React.FC<EditKaryawanModalProps> = ({ open, onClose, karyawan, onSave }) => {
  const [formData, setFormData] = useState<any>(karyawan);
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [kantorList, setKantorList] = useState<Kantor[]>([]);

  useEffect(() => {
    if (karyawan) {
      setFormData({
        ...karyawan,
        jabatan: karyawan.jabatan || "", // Pastikan jabatan tidak kosong
      });
    }
  }, [karyawan]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resKaryawan = await fetch("http://localhost:8000/karyawan");
        const resKantor = await fetch("http://localhost:8000/kantor");

        if (!resKaryawan.ok || !resKantor.ok) throw new Error("Gagal mengambil data");

        const dataKaryawan = await resKaryawan.json();
        const dataKantor = await resKantor.json();

        setKaryawanList(dataKaryawan);
        setKantorList(dataKantor);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: "#E4F1FC", // Warna biru muda
          },
        },  
      }}
    >
      <DialogTitle sx={{ bgcolor: "#0F3A7C", color: "white", fontWeight: "bold" }}>
        Edit Karyawan
      </DialogTitle>
      <DialogContent sx={{ marginTop: 3 }}>
        <TextField
          label="Nama Karyawan"
          fullWidth
          sx ={{ bgcolor: "white" }}
          margin="dense"
          value={formData?.namaKaryawan || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("namaKaryawan", e.target.value)}
        />
        <TextField
          label="Jabatan"
          fullWidth
          sx ={{ bgcolor: "white" }}
          margin="dense"
          select
          value={formData?.jabatan || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("jabatan", e.target.value)}
        >
          {jabatanOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Status"
          fullWidth
          sx ={{ bgcolor: "white" }}
          margin="dense"
          select
          value={formData?.status || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("status", e.target.value)}
        >
          <MenuItem value="AKTIF">AKTIF</MenuItem>
          <MenuItem value="NON_AKTIF">NON AKTIF</MenuItem>
        </TextField>
        <TextField
          label="Kantor"
          fullWidth
          sx ={{ bgcolor: "white" }}
          margin="dense"
          select
          value={formData?.kantor?.id_kantor || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("id_kantor", parseInt(e.target.value))}
        >
          {kantorList.map((kantor) => (
            <MenuItem key={kantor.id_kantor} value={kantor.id_kantor}>
              {kantor.jenis_kantor}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Supervisor"
          fullWidth
          sx ={{ bgcolor: "white" }}
          margin="dense"
          select
          value={formData?.supervisor?.nik || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("nik_SPV", parseInt(e.target.value))}
        >
          {karyawanList.map((k) => (
            <MenuItem key={k.nik} value={k.nik}>
              {k.namaKaryawan}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Kepala Bagian"
          fullWidth
          sx ={{ bgcolor: "white" }}
          margin="dense"
          select
          value={formData?.kepalaBagian?.nik || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("nik_kabag", parseInt(e.target.value))}
        >
          {karyawanList.map((k) => (
            <MenuItem key={k.nik} value={k.nik}>
              {k.namaKaryawan}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Direktur Bisnis"
          fullWidth
          sx ={{ bgcolor: "white" }}
          margin="dense"
          select
          value={formData?.direkturBisnis?.nik || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("nik_direkturBisnis", parseInt(e.target.value))}
        >
          {karyawanList.map((k) => (
            <MenuItem key={k.nik} value={k.nik}>
              {k.namaKaryawan}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button 
        onClick={onClose} 
        sx={{ 
          bgcolor: "#FF0000 !important" ,
          color: "white !important" ,
          "&:hover": { bgcolor: "#A52A2A !important" }
          }}>
          Batal
        </Button>
        <Button
          onClick={() => formData && onSave(formData)}
          sx={{
            bgcolor: "#4CAF50 !important", 
            color: "white !important",
            "&:hover": { bgcolor: "#388E3C !important" }
          }}
        >
          Simpan
      </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditKaryawanDialog;