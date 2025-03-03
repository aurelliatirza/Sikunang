import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";

interface KonfirmasiCetakDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
}

const KonfirmasiCetakDialog: React.FC<KonfirmasiCetakDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs());

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
                onConfirm(startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD"));
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
