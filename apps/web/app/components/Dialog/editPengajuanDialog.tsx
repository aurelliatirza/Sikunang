import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert
} from "@mui/material";
import { NumericFormat } from "react-number-format";

interface KreditPengajuan {
  id_kredit: number;
  nominal_pengajuan: number;
  tenor_pengajuan: number;
}

interface EditPengajuanModalProps {
  open: boolean;
  onClose: () => void;
  kreditPengajuan: KreditPengajuan | null;
  onSave: (updatedKredit: KreditPengajuan) => Promise<void>;
}

const EditPengajuanDialog: React.FC<EditPengajuanModalProps> = ({
  open,
  onClose,
  kreditPengajuan,
  onSave,
}) => {
  const [formData, setFormData] = useState<KreditPengajuan | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (kreditPengajuan) {
      setFormData(kreditPengajuan);
    }
  }, [kreditPengajuan]);

  const handleChange = (field: keyof KreditPengajuan, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (!formData) return;

    if (formData.nominal_pengajuan <= 0) {
      alert("Nominal pengajuan harus lebih dari 0!");
      return;
    }
    if (formData.tenor_pengajuan < 1) {
      alert("Tenor harus minimal 1 bulan!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/kredit/${formData.id_kredit}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");

      onSave(formData);
      setSnackbarOpen(true);
      onClose();
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      alert("Terjadi kesalahan, coba lagi.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit Pengajuan</DialogTitle>
        <DialogContent>
          <NumericFormat
            customInput={TextField}
            label="Nominal Pengajuan"
            value={formData?.nominal_pengajuan || ""}
            thousandSeparator=","
            decimalSeparator="."
            InputProps={{
              startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
            }}
            onValueChange={(values) => handleChange("nominal_pengajuan", Number(values.value))}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tenor"
            type="tel"
            value={formData?.tenor_pengajuan || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("tenor_pengajuan", Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">bulan</InputAdornment>,
            }}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Batal</Button>
          <Button onClick={handleSave} disabled={!formData}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
          Pengajuan berhasil diperbarui!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditPengajuanDialog;
