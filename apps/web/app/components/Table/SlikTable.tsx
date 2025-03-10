import React, {useState, useEffect, useMemo} from "react";
import { FaSearch } from "react-icons/fa";
import ConfirmationDialog from "../Dialog/alertKonfirmasiKreditDialog";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";


interface Nasabah {
  namaNasabah: string;
  alamat: string;
  namaUsaha: string;
  no_telp: string;
  karyawan: {
    namaKaryawan: string;
    nik: number;
    nik_SPV?: number;
    nik_kabag?: number;
    nik_direkturBisnis?: number;
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
interface Karyawan {
  nik: number;
  namaKaryawan: string;
  kantor: {
    id_kantor: number;
    jenis_kantor: String;
  }
}

interface KreditPengajuan {
  id_kredit: number;
  nasabah: Nasabah;
  nominal_pengajuan: number;
  tenor_pengajuan: number;
  status_pengajuan: string;
  id_karyawan_pengajuan: number;
  status_Slik: string
  id_karyawan_slik: number;    
  updatedAtSlik: string;
  createdAt: string;
  status_analisisSlik: string;
}

interface UserProfile {
  id: number;
  namaKaryawan: string;
  nik: number;
  jabatan: "marketing" | "spv" | "kabag" | "direkturBisnis";
}
const statusSlikOptions = [
  { label: "Belum Ditinjau", value: "belum_ditinjau"},
  { label: "Lanjut", value: "lanjut"},
]
const statusPengajuanOptions = [
  { label: "Sedang Diajukan", value: "sedang_diajukan"},
]
const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SlikTable: React.FC = () => {
    const [kreditData, setKreditData] = useState<KreditPengajuan[]>([]);
    const [karyawanData, setKaryawanData] = useState<Karyawan[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [filteredData, setFilteredData] = useState<KreditPengajuan[]>([]);
    const [jabatan, setJabatan] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedKantor, setSelectedKantor] = useState<number | null>(null);
    const [open, setOpen] = React.useState(false);
    const [statusSlik, setStatusSlik] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openKonfirmasiCetakDialog, setOpenKonfirmasiCetakDialog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  
    const getStatusSlikLabel = (status_Slik: string) => {
      const option = statusSlikOptions.find((option) => option.value === status_Slik);
      return option? option.label : status_Slik;
    }
    const getStatusPengajuanLabel = (status_pengajuan: string) => {
      const option = statusPengajuanOptions.find((option) => option.value === status_pengajuan);
      return option? option.label : status_pengajuan;
    }

     // Fungsi untuk mendapatkan nama karyawan berdasarkan ID karyawan pengajuan
    const getNamaKaryawanPengajuan = (id_karyawan_pengajuan: number, karyawanData: Karyawan[]): string => {
      const karyawan = karyawanData.find(k => k.nik === id_karyawan_pengajuan);
      return karyawan ? karyawan.namaKaryawan : "Tidak Diketahui";
    };
    const getNamaKaryawanSlik = (id_karyawan_slik: number, karyawanData: Karyawan[]): string => {
      const karyawan = karyawanData.find(k => k.nik === id_karyawan_slik);
      return karyawan ? karyawan.namaKaryawan : "Tidak Diketahui";
    };

    // Fetch data kredit pengajuan
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [kreditRes, karyawanRes] = await Promise.all([
            fetch("http://localhost:8000/kredit/filter/slikTable"),
            fetch("http://localhost:8000/karyawan"),
          ]);
    
          if (!kreditRes.ok || !karyawanRes.ok) throw new Error("Gagal mengambil data");
    
          const kreditData = await kreditRes.json();
          const karyawanData = await karyawanRes.json();
    
          setKreditData(kreditData);
          setKaryawanData(karyawanData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      fetchData();
    }, []); // hanya fetch sekali saat mount

    // Fetch data user profile
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch("http://localhost:8000/auth/profile", {
            method: "GET",
            credentials: "include",
          });
  
          if (!response.ok) throw new Error("Gagal mengambil data user");
  
          const data = await response.json();
          setUserProfile(data);
          setJabatan(data.jabatan);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
  
      fetchUserProfile();
    }, []);
    
    // Filter data kredit berdasarkan kantor
    const filteredKreditData = useMemo(() => {
      if (!karyawanData.length) return kreditData; // Jika data belum ada, tampilkan semua
    
      return kreditData.filter((item) => {
        const karyawanPengaju = karyawanData.find((k) => k.nik === item.id_karyawan_pengajuan);
        return karyawanPengaju && (!selectedKantor || karyawanPengaju.kantor.id_kantor === selectedKantor);
      });
    }, [kreditData, karyawanData, selectedKantor]);
    
    const handleConfirm = async () => {
      if (!selectedId) return;
      try {
        const response = await fetch(`http://localhost:8000/kredit/${selectedId}/slik-check`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status_Slik: "lanjut", id_karyawan_slik: userProfile?.nik }),
        });
    
        if (!response.ok) throw new Error("Gagal memperbarui status SLIK");
    
        const updatedData = kreditData.map((item) =>
          item.id_kredit === selectedId ? { ...item, status_Slik: "lanjut", id_karyawan_slik: userProfile?.nik ?? 0 } : item
        );
    
        setKreditData(updatedData);
        setOpenDialog(false);
        setSnackbarMessage("Status Slik berhasil diperbarui");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Gagal memperbarui status SLIK:", error);
        setSnackbarMessage("Gagal mengupdate status Slik");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };   

  const handleCancel = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(`http://localhost:8000/kredit/${selectedId}/slik-check`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_Slik: "belum_ditinjau", id_karyawan_slik: null }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Gagal membatalkan status SLIK");
      }

      setSnackbarMessage("Berhasil membatalkan status slik");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Update state untuk memperbarui tampilan
      setKreditData((prevData) =>
        prevData.map((item) =>
          item.id_kredit === selectedId ? { ...item, status_Slik: "belum_ditinjau" } : item
        )
      );

      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error("Gagal membatalkan status SLIK:", error);
      setSnackbarMessage("Gagal membatalkan slik");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
    
    // Search filter
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setPage(0);
    };
    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    };
  
    // Filter berdasarkan search query
    const searchedData = filteredKreditData.filter((item) =>
      item.nasabah.namaNasabah.toLowerCase().includes(searchQuery.toLowerCase())
    );
    

    // Pagination
    const paginatedData = searchedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

  return (
    <div className="overflow-x-auto w-full">
      {/* Search Box */}
      <form className="flex items-center" onSubmit={handleSearchSubmit}>
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 text-sm sm:text-base md:text-lg">
              <FaSearch />
            </span>
          </div>
          <input
            type="text"
            placeholder="Search here..."
            className="border px-3 py-2 pl-10 rounded shadow outline-none focus:ring w-32 sm:w-40 md:w-48 text-sm sm:text-base md:text-lg"
            value={searchQuery}
            onChange={handleSearch} // 🔥 Filter data saat mengetik
          />
        </div>
      </form>
      {/* Select Kantor */}
      <select
        className="border px-3 py-2 rounded shadow outline-none focus:ring"
        value={selectedKantor || ""}
        onChange={(e) => setSelectedKantor(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">Semua Kantor</option>
        {Array.from(new Set(karyawanData.map(k => k.kantor.id_kantor))).map(id_kantor => (
          <option key={id_kantor} value={id_kantor}>
            Kantor {id_kantor}
          </option>
        ))}
      </select>


      <table className="min-w-[1200px] text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-6 py-3 text-center rounded-tl-2xl">No</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Nasabah</th>
            <th className="px-6 py-3 text-center border-l border-white">Alamat</th>
            <th className="px-6 py-3 text-center border-l border-white">Kelurahan</th>
            <th className="px-6 py-3 text-center border-l border-white">Kecamatan</th>
            <th className="px-6 py-3 text-center border-l border-white">Kota</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Usaha</th>
            <th className="px-6 py-3 text-center border-l border-white">Waktu Pengajuan</th>
            <th className="px-6 py-3 text-center border-l border-white">Nominal Pengajuan</th>
            <th className="px-6 py-3 text-center border-l border-white">Status Pengajuan</th>
            <th className="px-6 py-3 text-center border-l border-white">Tenor Pengajuan (bln)</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Pengaju</th>
            {/* Langkah Kedua */}
            <th className="px-6 py-3 text-center border-l border-white">Waktu Slik</th>
            <th className="px-6 py-3 text-center border-l border-white">Status Slik</th>
            {jabatan === "adminSlik" ? (
              <>
                <th className="px-6 py-3 text-center border-l border-white">Nama Admin Slik</th>
                <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Aksi</th>
              </>
            ) : (
              <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Nama Admin Slik</th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={item.id_kredit} className="text-center">
              <td className="px-6 py-4">{index + 1}</td>
              <td className="px-6 py-4">{item.nasabah.namaNasabah}</td>
              <td className="px-6 py-4">{item.nasabah.alamat}</td>
              <td className="px-6 py-4">{item.nasabah.desa.nama}</td>
              <td className="px-6 py-4">{item.nasabah.desa.Kecamatan.nama}</td>
              <td className="px-6 py-4">{item.nasabah.desa.Kecamatan.KabupatenKota.nama}</td>
              <td className="px-6 py-4">{item.nasabah.namaUsaha}</td>
              <td className="px-6 py-4">
                {new Date(item.createdAt).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
              <td className="px-6 py-4">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
                  item.nominal_pengajuan
                )}
              </td>
              <td className="px-6 py-4">{getStatusPengajuanLabel(item.status_pengajuan)}</td>
              <td className="px-6 py-4">{item.tenor_pengajuan}</td>
              <td className="px-6 py-4">{getNamaKaryawanPengajuan(item.id_karyawan_pengajuan, karyawanData)}</td>
              <td className="px-6 py-4">
                {new Date(item.updatedAtSlik).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </td>
              <td className="px-6 py-4">{getStatusSlikLabel(item.status_Slik)}</td>
              <td className="px-6 py-4">{getNamaKaryawanSlik(item.id_karyawan_slik, karyawanData)}</td>

              {/* Tombol Aksi */}
              {jabatan === "adminSlik" && (
                <td className="px-6 py-4">
                  {item.status_Slik === "lanjut" ? (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                      onClick={() => {
                        setSelectedId(item.id_kredit);
                        setIsCancelDialogOpen(true);
                      }}
                      disabled={item.status_analisisSlik !== "belum_dianalisis"}
                    >
                      Batalkan
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        setSelectedId(item.id_kredit);
                        setOpenDialog(true);
                      }}
                    >
                      Lanjut
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>

      </table>
        {/* Reusable Dialog */}
        <ConfirmationDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={handleConfirm}
          title="Konfirmasi SLIK"
          message="Apakah Anda yakin ingin melanjutkan pemeriksaan SLIK?"
          confirmText="Ya, Lanjutkan"
          cancelText="Batal"
        />

        {/* Dialog Konfirmasi Pembatalan */}
        <ConfirmationDialog
          open={isCancelDialogOpen}
          onClose={() => setIsCancelDialogOpen(false)}
          onConfirm={handleCancel}
          title="Batalkan Proses SLIK"
          message="Apakah Anda yakin ingin membatalkan pemeriksaan SLIK?"
          confirmText="Ya, Batalkan"
          cancelText="Batal"
        />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </div>
  );
};

export default SlikTable;