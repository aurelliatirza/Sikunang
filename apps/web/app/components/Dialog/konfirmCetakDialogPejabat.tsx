import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
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
  isPejabat: boolean;
  bawahanList?: string[];
}

const KonfirmasiCetakDialog: React.FC<KonfirmasiCetakDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isPejabat,
  bawahanList = [],
}) => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());
  const [selectedAO, setSelectedAO] = React.useState<string>("all");

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title">
      <DialogTitle id="alert-dialog-title">
        {"Pilih Tanggal Cetak Laporan"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Silakan pilih rentang tanggal laporan yang akan dicetak:
        </DialogContentText>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2} marginTop={3}>
            <DatePicker
              label="Tanggal Mulai"
              value={startDate}
              onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
            />
            <DatePicker
              label="Tanggal Akhir"
              value={endDate}
              onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
            />
            {isPejabat && (
              <Select
                value={selectedAO}
                onChange={(e) => setSelectedAO(e.target.value)}
                displayEmpty
              >
                <MenuItem value="all">Semua Karyawan</MenuItem>
                {bawahanList.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
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
            if (startDate && endDate) {
              onConfirm(
                startDate.format("YYYY-MM-DD"),
                endDate.format("YYYY-MM-DD"),
                isPejabat ? selectedAO : undefined
              );
            } else {
              console.error("Tanggal belum dipilih!");
            }
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
