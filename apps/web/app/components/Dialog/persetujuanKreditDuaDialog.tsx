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
  nominal_disetujui: number;
  tenor_disetujui: number;
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
  onsave: (nominal_disetujui: number, tenor_disetujui: number) => void;
  nasabah: Nasabah;
  kredit: Kredit | null;
  nominal_pengajuan: number; // Tambahkan prop ini
}

const PersetujuanKreditDialog: React.FC<PersetujuanKreditDialogProps> = ({
  open,
  onClose,
  onsave,
  nasabah,
  kredit,
  nominal_pengajuan, // Terima prop nominal_pengajuan
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
    if (!nominalPersetujuan || isNaN(nominalPersetujuan) || nominalPersetujuan <= 0) {
      alert("Nominal persetujuan harus berupa angka lebih dari 0");
      return;
    }
    if (nominalPersetujuan > nominal_pengajuan) {
      alert("Nominal disetujui tidak boleh lebih besar dari nominal pengajuan");
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

    // Ambil ID kredit yang benar
    const kreditId = kredit?.id_kredit;
    if (!kreditId) {
      alert("ID kredit tidak ditemukan!");
      return;
    }

    const newApprovalKredit = {
      nominal_disetujui: nominalPersetujuan,
      tenor_disetujui: tenor,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kredit/${kreditId}/persetujuanDua`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newApprovalKredit),
      });

      console.log("Data yang dikirim ke backend:", newApprovalKredit);

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Response error:", errorResponse);
        // Jika backend tidak mengembalikan pesan error, gunakan pesan default
        throw new Error(errorResponse.message || "Gagal mengajukan kredit. Silakan coba lagi.");
      }

      const data = await response.json();
      console.log("Persetujuan berhasil:", data);

      onsave(nominalPersetujuan, tenor);
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

  // Jika kredit tidak ada, kembalikan null atau tampilkan pesan
  if (!kredit) {
    return null; // Atau tampilkan pesan seperti: <div>Data kredit tidak ditemukan.</div>
  }

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Pengajuan Kredit</DialogTitle>
        <DialogContent>
          <DialogContentText>{kredit.nasabah.namaNasabah}</DialogContentText>
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
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={(event) => handleSnackbarClose(event, "close")} severity="success" variant="filled" sx={{ width: "100%" }}>
          Persetujuan kredit berhasil!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PersetujuanKreditDialog;