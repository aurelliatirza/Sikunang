import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface KonfirmasiCetakDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string, selectedAO?: string) => void;
  jabatan: "marketing" | "spv" | "kabag" | "direktur_bisnis";
  bawahanList?: string[];
}

const KonfirmasiCetakDialog: React.FC<KonfirmasiCetakDialogProps> = ({
  open,
  onClose,
  onConfirm,
  jabatan,
  bawahanList = [],
}) => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());
  const [selectedAO, setSelectedAO] = React.useState<string>("all");

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title">
      <DialogTitle id="alert-dialog-title">
        Pilih Tanggal Cetak Laporan
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Silakan pilih rentang tanggal laporan yang akan dicetak:
        </DialogContentText>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2} marginTop={3}>
            {/* Input Tanggal Mulai */}
            <DatePicker
              label="Tanggal Mulai"
              value={startDate}
              onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
            />

            {/* Input Tanggal Akhir */}
            <DatePicker
              label="Tanggal Akhir"
              value={endDate}
              onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
            />

            {/* Jika bukan Marketing, tampilkan dropdown untuk memilih bawahan */}
            {jabatan !== "marketing" && bawahanList.length > 0 && (
              <TextField
                select
                label="Pilih AO"
                value={selectedAO}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedAO(e.target.value)}
                fullWidth
              >
                {bawahanList.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Stack>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Batal
        </Button>
        <Button
          onClick={() => {
            if (!startDate || !endDate) {
              alert("Tanggal belum dipilih!");
              return;
            }
            if (endDate.isBefore(startDate)) {
              alert("Tanggal akhir tidak boleh lebih awal dari tanggal mulai!");
              return;
            }
            onConfirm(
              startDate.format("YYYY-MM-DD"),
              endDate.format("YYYY-MM-DD"),
              jabatan !== "marketing" ? selectedAO : undefined
            );
          }}
          color="primary"
          autoFocus
        >
          Cetak
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KonfirmasiCetakDialog;
