import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { NumericFormat } from "react-number-format";

interface Nasabah {
  id_nasabah: number;
  namaNasabah: string;
}

interface Kredit {
  id_kredit?: number;
  nasabah: Nasabah;
  nominal_disetujui?: number;
  tenor_disetujui?: number;
}

interface UserProfile {
  id: number;
  namaKaryawan: string;
  nik: number;
  jabatan: "marketing" | "spv" | "kabag" | "direkturBisnis";
}

interface PersetujuanKreditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (nominal_disetujui: number, tenor_disetujui: number) => void;
  kredit: Kredit | null;
  nominal_pengajuan: number;
  jenisPersetujuan: "satu" | "dua" | "tiga"; // Tambahkan prop ini
}

const PersetujuanKreditDialog: React.FC<PersetujuanKreditDialogProps> = ({
  open,
  onClose,
  onSave,
  kredit,
  nominal_pengajuan,
  jenisPersetujuan, // Gunakan prop ini untuk menentukan jenis persetujuan
}) => {
  const [nominalPersetujuan, setNominalPersetujuan] = useState<number>(0);
  const [tenor, setTenor] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Gagal mengambil data user");

        const data = await response.json();
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async () => {
    if (!userProfile) return;
  
    if (!nominalPersetujuan || nominalPersetujuan <= 0) {
      alert("Nominal persetujuan harus lebih dari 0");
      return;
    }
    if (nominalPersetujuan > nominal_pengajuan) {
      alert("Nominal disetujui tidak boleh lebih besar dari nominal pengajuan");
      return;
    }
    if (!tenor || tenor < 1) {
      alert("Tenor harus minimal 1 bulan");
      return;
    }
    if (!userProfile.nik) {
      alert("ID Karyawan tidak valid");
      return;
    }
  
    if (!kredit?.id_kredit) {
      alert("ID kredit tidak ditemukan!");
      return;
    }
  
    const newApprovalKredit = {
      nominal_disetujui: nominalPersetujuan,
      tenor_disetujui: tenor,
      status_persetujuan: "setuju",
      id_karyawan_persetujuan: userProfile.nik, // ID Karyawan yang menyetujui
    };
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/kredit/${kredit.id_kredit}/persetujuan?step=${jenisPersetujuan}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newApprovalKredit),
        }
      );
  
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Gagal mengajukan kredit.");
      }
  
      onSave(nominalPersetujuan, tenor);
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Error mengajukan kredit:", error);
      alert(error instanceof Error ? error.message : "Terjadi kesalahan.");
    }
  };
  

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Persetujuan Kredit {jenisPersetujuan}</DialogTitle>
        <DialogContent>
          <DialogContentText>Nasabah: {kredit?.nasabah.namaNasabah}</DialogContentText>
          <NumericFormat
            customInput={TextField}
            label="Nominal Disetujui"
            value={nominalPersetujuan}
            thousandSeparator=","
            decimalSeparator="."
            InputProps={{
              startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
            }}
            onValueChange={(values) => setNominalPersetujuan(Number(values.value))}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tenor Disetujui"
            type="tel"
            value={tenor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTenor(Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">bulan</InputAdornment>,
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={!userProfile || tenor < 1}>
            Setuju
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Persetujuan kredit {jenisPersetujuan} berhasil!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PersetujuanKreditDialog;
