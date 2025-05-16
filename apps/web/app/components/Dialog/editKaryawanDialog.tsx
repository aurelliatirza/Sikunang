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
  status: string;
  kantor: { id_kantor: number; jenis_kantor: string };
  supervisor?: { nik: number; namaKaryawan: string } | null;
  kepalaBagian?: { nik: number; namaKaryawan: string } | null;
  kepalaCabang?: { nik: number; namaKaryawan: string } | null;
  direkturBisnis?: { nik: number; namaKaryawan: string } | null;
  direkturUtama?: { nik: number; namaKaryawan: string } | null;
}

interface Kantor {
  id_kantor: number;
  jenis_kantor: string;
}

interface EditKaryawanModalProps {
  open: boolean;
  onClose: () => void;
  karyawan: Karyawan | null;
  onSave: (updatedKaryawan: Karyawan) => Promise<void>;
}

const jabatanOptions = [
  { label: "HRD", value: "hrd" },
  { label: "Admin Slik", value: "adminSlik" },
  { label: "Marketing", value: "marketing" },
  { label: "SPV", value: "spv" },
  { label: "Kepala Bagian", value: "kabag" },
  { label: "Kepala Cabang", value: "kacab" },
  { label: "Direktur Bisnis", value: "direkturBisnis" },
  { label: "Direktur Utama", value: "direkturUtama" },
];

const statusOption = [
  { label: "AKTIF", value: "AKTIF" },
  { label: "NON AKTIF", value: "NON AKTIF" },
];

const EditKaryawanDialog: React.FC<EditKaryawanModalProps> = ({
  open,
  onClose,
  karyawan,
  onSave,
}) => {
  const [formData, setFormData] = useState<Karyawan | null>(null);
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [kantorList, setKantorList] = useState<Kantor[]>([]);

  // Saat menerima data karyawan, pastikan field opsional di-set secara eksplisit
  useEffect(() => {
    if (karyawan) {
      setFormData({
        ...karyawan,
        status: karyawan.status || "AKTIF",
        supervisor: karyawan.supervisor ?? null,
        kepalaBagian: karyawan.kepalaBagian ?? null,
        direkturBisnis: karyawan.direkturBisnis ?? null,
        kepalaCabang: karyawan.kepalaCabang ?? null,
        direkturUtama: karyawan.direkturUtama ?? null,
      });
    }
  }, [karyawan]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resKaryawan = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/karyawan`);
        const resKantor = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kantor`);

        if (!resKaryawan.ok || !resKantor.ok) {
          throw new Error("Gagal mengambil data");
        }

        setKaryawanList(await resKaryawan.json());
        setKantorList(await resKantor.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field: keyof Karyawan, value: any) => {
    setFormData((prev) => ({ ...prev!, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData) return;

    // Bangun payload update secara eksplisit, termasuk field opsional
    const payload: Karyawan = {
      nik: formData.nik,
      namaKaryawan: formData.namaKaryawan,
      jabatan: formData.jabatan,
      status: formData.status,
      kantor: formData.kantor,
      supervisor: formData.supervisor ?? null,
      kepalaBagian: formData.kepalaBagian ?? null,
      kepalaCabang: formData.kepalaCabang ?? null,
      direkturBisnis: formData.direkturBisnis ?? null,
      direkturUtama: formData.direkturUtama ?? null,
    };

    // Jika field relasi null, gunakan null untuk key update
    const updatePayload = {
      namaKaryawan: payload.namaKaryawan,
      jabatan: payload.jabatan,
      status: payload.status,
      nik_SPV: payload.supervisor ? payload.supervisor.nik : null,
      nik_kabag: payload.kepalaBagian ? payload.kepalaBagian.nik : null,
      nik_kacab: payload.kepalaCabang ? payload.kepalaCabang.nik : null,
      nik_direkturBisnis: payload.direkturBisnis ? payload.direkturBisnis.nik : null,
      nik_direkturUtama: payload.direkturUtama ? payload.direkturUtama.nik : null,
      id_kantor: payload.kantor.id_kantor,
    };

    console.log("Data yang dikirim saat simpan:", updatePayload);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/karyawan/${payload.nik}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      if (!response.ok) throw new Error("Gagal menyimpan data");
      onSave(payload);
      onClose();
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: "#E4F1FC",
          },
        },
      }}
    >
      <DialogTitle sx={{ bgcolor: "#0F3A7C", color: "white", fontWeight: "bold" }}>
        Edit Karyawan
      </DialogTitle>
      <DialogContent sx={{ marginTop: 3 }}>
        {/* Nama Karyawan */}
        <TextField
          label="Nama Karyawan"
          fullWidth
          sx={{ bgcolor: "white" }}
          margin="dense"
          value={formData?.namaKaryawan || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("namaKaryawan", e.target.value)
          }
        />

        {/* Jabatan */}
        <TextField
          label="Jabatan"
          fullWidth
          sx={{ bgcolor: "white" }}
          margin="dense"
          select
          value={formData?.jabatan || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange("jabatan", e.target.value)
          }
        >
          {jabatanOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Status */}
        <TextField
          label="Status"
          fullWidth
          sx={{ bgcolor: "white" }}
          margin="dense"
          select
          value={formData?.status || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            console.log("Status changed to:", e.target.value);
            handleChange("status", e.target.value);
          }}
        >
          {statusOption.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        {/* Kantor */}
        <TextField
          label="Kantor"
          fullWidth
          sx={{ bgcolor: "white" }}
          margin="dense"
          select
          value={formData?.kantor?.id_kantor || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(
              "kantor",
              e.target.value
                ? kantorList.find(
                    (k) => k.id_kantor === parseInt(e.target.value)
                  )
                : null
            )
          }
        >
          <MenuItem value="">Tidak Ada</MenuItem>
          {kantorList.map((kantor) => (
            <MenuItem key={kantor.id_kantor} value={kantor.id_kantor}>
              {kantor.jenis_kantor}
            </MenuItem>
          ))}
        </TextField>

        {/* SPV */}
        <TextField
          label="SPV"
          fullWidth
          sx={{ bgcolor: "white" }}
          margin="dense"
          select
          value={
            formData?.supervisor?.nik
              ? formData.supervisor.nik.toString()
              : ""
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === "Tidak ada") {
              handleChange("supervisor", null);
            } else {
              handleChange(
                "supervisor",
                karyawanList.find((k) => k.nik === parseInt(value)) || null
              );
            }
          }}
        >
          <MenuItem value="Tidak ada">Tidak Ada</MenuItem>
          {karyawanList
            .filter((k) => k.jabatan === "spv")
            .map((spv) => (
              <MenuItem key={spv.nik} value={spv.nik.toString()}>
                {spv.namaKaryawan}
              </MenuItem>
            ))}
        </TextField>

        {/* Kepala Bagian */}
        <TextField
          label="Kepala Bagian"
          fullWidth
          sx={{ bgcolor: "white" }}
          margin="dense"
          select
          value={
            formData?.kepalaBagian?.nik
              ? formData.kepalaBagian.nik.toString()
              : ""
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === "Tidak ada") {
              handleChange("kepalaBagian", null);
            } else {
              handleChange(
                "kepalaBagian",
                karyawanList.find((k) => k.nik === parseInt(value)) || null
              );
            }
          }}
        >
          <MenuItem value="Tidak ada">Tidak Ada</MenuItem>
          {karyawanList
            .filter((k) => k.jabatan === "kabag")
            .map((kabag) => (
              <MenuItem key={kabag.nik} value={kabag.nik.toString()}>
                {kabag.namaKaryawan}
              </MenuItem>
            ))}
        </TextField>

        {/* Kepala Cabang */}
        <TextField
          label="Kepala Cabang"
          fullWidth
          sx={{ bgcolor: "white" }}
          margin="dense"
          select
          value={
            formData?.kepalaCabang?.nik
              ? formData.kepalaCabang.nik.toString()
              : ""
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === "Tidak ada") {
              handleChange("kepalaCabang", null);
            } else {
              handleChange(
                "kepalaCabang",
                karyawanList.find((k) => k.nik === parseInt(value)) || null
              );
            }
          }}
        >
          <MenuItem value="Tidak ada">Tidak Ada</MenuItem>
          {karyawanList
            .filter((k) => k.jabatan === "kacab")
            .map((kacab) => (
              <MenuItem key={kacab.nik} value={kacab.nik.toString()}>
                {kacab.namaKaryawan}
              </MenuItem>
            ))}
        </TextField>

        {/* Direktur Bisnis */}
        <TextField
          label="Direktur Bisnis"
          fullWidth
          sx={{ bgcolor: "white" }}
          margin="dense"
          select
          value={
            formData?.direkturBisnis?.nik
              ? formData.direkturBisnis.nik.toString()
              : ""
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === "Tidak ada") {
              handleChange("direkturBisnis", null);
            } else {
              handleChange(
                "direkturBisnis",
                karyawanList.find((k) => k.nik === parseInt(value)) || null
              );
            }
          }}
        >
          <MenuItem value="Tidak ada">Tidak Ada</MenuItem>
          {karyawanList
            .filter((k) => k.jabatan === "direkturBisnis")
            .map((direktur) => (
              <MenuItem key={direktur.nik} value={direktur.nik.toString()}>
                {direktur.namaKaryawan}
              </MenuItem>
            ))}
        </TextField>

        {/* Direktur Bisnis */}
        <TextField
          label="Direktur Utama"
          fullWidth
          sx={{ bgcolor: "white" }}
          margin="dense"
          select
          value={
            formData?.direkturUtama?.nik
              ? formData.direkturUtama.nik.toString()
              : ""
          }
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === "Tidak ada") {
              handleChange("direkturUtama", null);
            } else {
              handleChange(
                "direkturUtama",
                karyawanList.find((k) => k.nik === parseInt(value)) || null
              );
            }
          }}
        >
          <MenuItem value="Tidak ada">Tidak Ada</MenuItem>
          {karyawanList
            .filter((k) => k.jabatan === "direkturUtama")
            .map((direktur) => (
              <MenuItem key={direktur.nik} value={direktur.nik.toString()}>
                {direktur.namaKaryawan}
              </MenuItem>
            ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            bgcolor: "#FF0000 !important",
            color: "white !important",
            "&:hover": { bgcolor: "#A52A2A !important" },
          }}
        >
          Batal
        </Button>
        <Button
          onClick={handleSave}
          sx={{
            bgcolor: "#4CAF50 !important",
            color: "white !important",
            "&:hover": { bgcolor: "#388E3C !important" },
          }}
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditKaryawanDialog;
