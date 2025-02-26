import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Konfirmasi Perubahan Data</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Apakah Anda yakin ingin menyimpan perubahan data ini?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Batal
        </Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Ya, Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
