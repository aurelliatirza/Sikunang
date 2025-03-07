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
  Alert
} from "@mui/material";
import { NumericFormat } from "react-number-format";

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

interface Kredit {
  id_kredit?: number;
  nasabah: Nasabah;
  nominal_pengajuan: number;
  tenor_pengajuan: number;
  status_pengajuan: "sedang_diajukan";
  id_karyawan_pengajuan: number;
}

interface UserProfile {
  id: number;
  namaKaryawan: string;
  nik: number;
  jabatan: "marketing" | "spv" | "kabag" | "direkturBisnis";
}

interface PengajuanKreditDialogProps {
  open: boolean;
  onClose: () => void;
  onsave: (createdKredit: Kredit) => void;
  nasabah: Nasabah;
}

const PengajuanKreditDialog: React.FC<PengajuanKreditDialogProps> = ({
  open,
  onClose,
  onsave,
  nasabah,
}) => {
  const [nominalPengajuan, setNominalPengajuan] = useState<number>(0);
  const [tenor, setTenor] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Gagal mengambil data user");

        const data = await response.json();
        console.log("Data user:", data);
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async () => {
    if (!userProfile) return;
  
    // Validasi sebelum dikirim
    if (!nominalPengajuan || isNaN(nominalPengajuan) || nominalPengajuan <= 0) {
      alert("Nominal pengajuan harus berupa angka lebih dari 0");
      return;
    }
    if (!tenor || isNaN(tenor) || tenor < 1) {
      alert("Tenor harus berupa angka minimal 1 bulan");
      return;
    }
    if (!userProfile.nik || isNaN(userProfile.nik)) {
      alert("ID Karyawan tidak valid");
      return;
    }
  
    const newKredit = {
      id_nasabah: nasabah.id_nasabah,
      nominal_pengajuan: nominalPengajuan, // Sesuaikan dengan DTO
      tenor_pengajuan: tenor, // Sesuaikan dengan DTO
      id_karyawan_pengajuan: userProfile.nik, // Sesuaikan dengan DTO
    };
  
    try {
      const response = await fetch("http://localhost:8000/kredit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newKredit),
      });
  
      console.log("Data yang dikirim ke backend:", newKredit);
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Response error:", errorResponse);
        throw new Error(errorResponse.message.join(", ") || "Gagal mengajukan kredit");
      }
  
      const data = await response.json();
      console.log("Pengajuan berhasil:", data);
  
      onsave(data);
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Error mengajukan kredit:", error);
      alert(error instanceof Error ? error.message : "Gagal mengajukan kredit. Silakan coba lagi.");
    }
  };

  const handleSnackbarClose = (event: React.SyntheticEvent, reason: string) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };
  
  
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Pengajuan Kredit</DialogTitle>
        <DialogContent>
          <DialogContentText>{nasabah.namaNasabah}</DialogContentText>
          <NumericFormat
            customInput={TextField}
            label="Nominal Pengajuan"
            value={nominalPengajuan}
            thousandSeparator="," 
            decimalSeparator="."
            InputProps={{
              startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
            }}
            onValueChange={(values) => setNominalPengajuan(Number(values.value))}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tenor"
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
          <Button onClick={handleSubmit} disabled={!userProfile}>
            Ajukan
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={(event) => handleSnackbarClose(event, "close")} severity="success" variant="filled" sx={{ width: "100%" }}>
          Pengajuan kredit berhasil!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PengajuanKreditDialog;
