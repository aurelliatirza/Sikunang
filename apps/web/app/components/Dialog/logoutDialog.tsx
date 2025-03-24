'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useRouter } from 'next/navigation';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({ open, onClose }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include', // Kirim cookie dalam request
      });
  
      if (response.ok) {
        onClose(); // Tutup dialog
        router.push('/login'); // Arahkan ke halaman login
      } else {
        console.error('Gagal logout');
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat logout:', error);
    }
  };
  

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="logout-dialog-description"
    >
      <DialogTitle>Konfirmasi Logout</DialogTitle>
      <DialogContent>
        <DialogContentText id="logout-dialog-description">
          Apakah Anda yakin ingin logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Batal
        </Button>
        <Button onClick={handleLogout} color="secondary">
          Iya
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LogoutDialog;
