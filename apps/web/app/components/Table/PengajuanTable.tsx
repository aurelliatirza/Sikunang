import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import ConfirmationDialog from "../Dialog/alertKonfirmasiKreditDialog";
import Snackbar from "@mui/material/Snackbar";
import { useRouter } from "next/navigation";
import { Alert } from "@mui/material";
import EditPengajuanDialog from "../Dialog/editPengajuanDialog";
import TablePagination from "@mui/material/TablePagination";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

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
}

interface KreditPengajuan {
  id_kredit: number;
  nasabah: Nasabah;
  nominal_pengajuan: number;
  tenor_pengajuan: number;
  status_pengajuan: string;
  id_karyawan_pengajuan: number;
  createdAt: string;
  status_persetujuansatu: string;
}

interface UserProfile {
  id: number;
  namaKaryawan: string;
  nik: number;
  jabatan: "marketing" | "spv" | "kabag" | "direkturBisnis";
}

const statusPengajuanOptions = [
  { label: "Sedang Diajukan", value: "sedang_diajukan"},
  { label: "Dibatalkan", value: "dibatalkan"},
]

const PengajuanTable: React.FC = () => {
  const router = useRouter();
  const [kreditData, setKreditData] = useState<KreditPengajuan[]>([]);
  const [karyawanData, setKaryawanData] = useState<Karyawan[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [filteredData, setFilteredData] = useState<KreditPengajuan[]>([]);
  const [bawahanList, setBawahanList] = useState<string[]>([]);
  const [selectedBawahan, setSelectedBawahan] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [jabatan, setJabatan] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  //untuk Edit
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedKreditPengajuan, setSelectedKreditPengajuan] = useState<KreditPengajuan | null>(null);

  const getStatusPengajuanLabel = (status_pengajuan: string) => {
    const option = statusPengajuanOptions.find((option) => option.value === status_pengajuan);
    return option? option.label : status_pengajuan;
  }

 // Fungsi untuk mendapatkan nama karyawan berdasarkan ID karyawan pengajuan
 const getNamaKaryawan = (id_karyawan_pengajuan: number, karyawanData: Karyawan[]): string => {
  const karyawan = karyawanData.find(k => k.nik === id_karyawan_pengajuan);
  return karyawan ? karyawan.namaKaryawan : "Tidak Diketahui";
};

  // Fetch data kredit pengajuan
  useEffect(() => {
    const fetchKreditPengajuan = async () => {
      try {
        const response = await fetch("http://localhost:8000/kredit");
        if (!response.ok) throw new Error("Gagal mengambil Data");
        const data = await response.json();
        setKreditData(data);
      } catch (error) {
        console.error("Error fetching kredit data: ", error);
      }
    };
    fetchKreditPengajuan();
    const interval = setInterval(fetchKreditPengajuan, 3000); // Update setiap 5 detik

    return () => clearInterval(interval); // Bersihkan interval saat unmount
  }, []);

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

  //Fetch data karyawan
  useEffect(() => {
    const fetchKaryawan = async () => {
      try {
        const response = await fetch("http://localhost:8000/karyawan");
        if (!response.ok) throw new Error("Gagal mengambil data");

        const data = await response.json();
        setKaryawanData(data);
      } catch (error) {
        console.error("Error fetching karyawan:", error);
      }
    };

    fetchKaryawan();
  }, []);

    // Filter data berdasarkan jabatan user yang login
    useEffect(() => {
      if (!userProfile) return;

      let filtered: KreditPengajuan[] = [];

      if (userProfile.jabatan === "marketing") {
        filtered = kreditData.filter((item) => item.nasabah.karyawan.nik === userProfile.nik);
      } else {
        let bawahanNames: string[] = [];

        if (userProfile.jabatan === "spv") {
          bawahanNames = kreditData
            .filter((item) => item.nasabah.karyawan.nik_SPV === userProfile.nik)
            .map((item) => item.nasabah.karyawan.namaKaryawan);
        } else if (userProfile.jabatan === "kabag") {
          bawahanNames = kreditData
            .filter((item) => item.nasabah.karyawan.nik_kabag === userProfile.nik)
            .map((item) => item.nasabah.karyawan.namaKaryawan);
        } else if (userProfile.jabatan === "direkturBisnis") {
          bawahanNames = kreditData
            .filter((item) => item.nasabah.karyawan.nik_direkturBisnis === userProfile.nik)
            .map((item) => item.nasabah.karyawan.namaKaryawan);
        }

        setBawahanList([...new Set(bawahanNames)]);

        if (selectedBawahan) {
          filtered = kreditData.filter((item) => item.nasabah.karyawan.namaKaryawan === selectedBawahan);
        } else {
          filtered = kreditData;
        }
      }

      // Filter berdasarkan tanggal setelah filter jabatan dan bawahan diterapkan
      filtered = filtered.filter((item) => {
        const createdAtDate = dayjs(item.createdAt).startOf("day");

        if (startDate && endDate) {
          return (
            createdAtDate.isSameOrAfter(startDate, "day") &&
            createdAtDate.isSameOrBefore(endDate, "day")
          );
        } else if (startDate) {
          return createdAtDate.isSameOrAfter(startDate, "day");
        } else if (endDate) {
          return createdAtDate.isSameOrBefore(endDate, "day");
        }
        return true;
      });

      setFilteredData(filtered);
    }, [userProfile, kreditData, startDate, endDate, selectedBawahan]);

    const handleChangePage = (_: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  const handleCancel = async () => {
    if (!selectedId) return;
  
    try {
      const response = await fetch(`http://localhost:8000/kredit/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_pengajuan: "dibatalkan" }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Gagal membatalkan pengajuan");
      }
  
      setSnackbarMessage("Data Pengajuan berhasil dibatalkan.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setTimeout(
        () => router.push(userProfile?.jabatan === "marketing" ? "/kreditMarketing" : "/kreditPejabat"),
        1000
      );
      // Update state untuk memperbarui tampilan
      setKreditData((prevData) =>
        prevData.map((item) =>
          item.id_kredit === selectedId ? { ...item, status_pengajuan: "dibatalkan" } : item
        )
      );
  
      setIsCancelDialogOpen(false);
    } catch (error) {
      console.error("Error", error);
      const errorMessage = error instanceof Error? error.message: "Terjadi kesalahan saat memproses data.";
      setAlert({ type: "error", message: errorMessage});
    }
  };
  
  
  // Search filter
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };
  
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  // Fungsi untuk membuka dialog edit kunjungan
  const handleEditClick = (kreditPengajuan: KreditPengajuan) => {
    console.log("Edit data:", kreditPengajuan); // Cek apakah data lengkap
    setSelectedKreditPengajuan(kreditPengajuan);
    setOpenEditDialog(true);
  };
  

  // Filter berdasarkan search query
  const searchedData = filteredData.filter((item) =>
    item.nasabah.namaNasabah.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const paginatedData = searchedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="w-full p-4">
        <div className="flex justify-between items-center w-full">
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page"
          labelDisplayedRows={() => ""} // 🔹 Hilangkan informasi halaman di sini
          sx={{
            ".MuiTablePagination-spacer": { display: "none" },
            ".MuiTablePagination-displayedRows": { display: "none" }, // 🔹 Hilangkan info halaman
            ".MuiTablePagination-actions": { display: "none" }, // 🔹 Hilangkan navigasi halaman
          }}
        />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex gap-4">
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{ textField: { size: "small", fullWidth: true } }}
              />
              </div>
          </LocalizationProvider>
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
                    placeholder="Search nasabah"
                    className="border px-3 py-2 pl-10 rounded shadow outline-none focus:ring w-32 sm:w-40 md:w-48 text-sm sm:text-base md:text-lg"
                    value={searchQuery}
                    onChange={handleSearch} // 🔥 Filter data saat mengetik
                />
                </div>
            </form>

            {/* Filter Bawahan (Posisi di kanan) */}
            {userProfile && userProfile.jabatan !== "marketing" && (
                <select
                value={selectedBawahan || ""}
                onChange={(e) => setSelectedBawahan(e.target.value || null)}
                className="border px-4 py-2 rounded-lg"
                >
                <option value="">AO</option>
                {bawahanList.map((bawahan, index) => (
                    <option key={index} value={bawahan}>
                    {bawahan}
                    </option>
                ))}
                </select>
            )}
        </div>
      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-300">
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
            <th className="px-6 py-3 text-center border-l border-white">Status Pengajuan</th>
            <th className="px-6 py-3 text-center border-l border-white">Waktu Pengajuan</th>
            <th className="px-6 py-3 text-center border-l border-white">Tenor Pengajuan (bln)</th>
            {["marketing", "spv"].includes(userProfile?.jabatan ?? "") ? (
              <>
                <th className="px-6 py-3 text-center border-l border-white ">Nama Pengaju</th>
                <th className="px-6 py-3  min-w-40 text-center border-l border-white rounded-tr-2xl">Aksi</th>
              </>
            ) : (
              <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Nama Pengaju</th>
            )}
          </tr>
        </thead>
          <tbody>
          {paginatedData.length > 0 && 
            paginatedData
              .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
              .map((item, index) => (
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
                <td className="px-6 py-4">{getStatusPengajuanLabel(item.status_pengajuan)}</td>

                {/* tanpa ada ,00 dibelakang */}
                <td className="px-6 py-4">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.nominal_pengajuan)}
                </td>
                <td className="px-6 py-4">{item.tenor_pengajuan}</td>
                <td className="px-6 py-4">
                  {getNamaKaryawan(item.id_karyawan_pengajuan, karyawanData)}
                </td>
                {["marketing", "spv"].includes(jabatan ?? "") && (
                  <td className="px-6 py-4 min-w-56">
                    <div className="flex justify-center gap-4">
                    <button
                        key={item.id_kredit}
                        className={`px-4 py-2 w-24 rounded-md text-white ${
                          item.status_persetujuansatu !== "belum_disetujui"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                        onClick={() => handleEditClick(item)}
                        disabled={item.status_persetujuansatu !== "belum_disetujui"}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 w-24 rounded-md"
                        onClick={() => {
                          setSelectedId(item.id_kredit);
                          setIsCancelDialogOpen(true);
                        }}
                      >
                        Batalkan
                      </button>
                    </div>
                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end py-2">
        <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={() => {}} // 🔹 Dinonaktifkan agar tidak muncul lagi
            rowsPerPageOptions={[]} // 🔹 Hilangkan dropdown "Rows per page" di bawah
            labelRowsPerPage=""
            labelDisplayedRows={({ page, count }) =>
              `Halaman ${page + 1} dari ${Math.ceil(count / rowsPerPage)}`
            }
            sx={{
              display: "flex", // 🔹 Pastikan flexbox aktif
              justifyContent: "flex-end", // 🔹 Pindahkan ke kanan
              ".MuiTablePagination-spacer": { display: "none" },
              ".MuiTablePagination-selectLabel": { display: "none" }, // 🔹 Hilangkan "Rows per page" bawah
              ".MuiTablePagination-input": { display: "none" }, // 🔹 Hilangkan dropdown bawah
            }}
        />
      </div>
          <ConfirmationDialog
            open={isCancelDialogOpen}
            onClose={() => setIsCancelDialogOpen(false)}
            onConfirm={handleCancel}
            title="Batalkan Proses Pengajuan"
            message="Apakah Anda yakin ingin membatalkan pengajuan ini?"
            confirmText="Ya, Batalkan"
            cancelText="Batal"
          />
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%", color: "green"}}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <EditPengajuanDialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
            kreditPengajuan={selectedKreditPengajuan}
            onSave={async (updatedData) => {
              setKreditData((prev) =>
                prev.map((item) =>
                  item.id_kredit === updatedData.id_kredit
                    ? { ...item, ...updatedData } // Hanya update yang berubah
                    : item
                )
              );
            }}            
          />
      </div>
    </div>
  );
};

export default PengajuanTable;
