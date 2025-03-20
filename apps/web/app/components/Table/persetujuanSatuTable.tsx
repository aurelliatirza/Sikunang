import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ConfirmationDialog from "../Dialog/alertKonfirmasiKreditDialog";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import PersetujuanKreditDialog from "../Dialog/persetujuanKreditSatuDialog";
import TablePagination from "@mui/material/TablePagination";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Nasabah {
  id_nasabah: number;
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
  };
}

interface Persetujuan1Kredit {
  id_kredit: number;
  nasabah: Nasabah;
  nominal_pengajuan: number;
  tenor_pengajuan: number;
  status_pengajuan: string;
  id_karyawan_pengajuan: number;
  status_Slik: string;
  id_karyawan_slik: number;
  updatedAtSlik: string;
  createdAt: string;
  status_analisisSlik: string;
  id_karyawan_analisisSlik: number;
  updatedAtAnalisisSlik: string;
  status_visitNasabah: string;
  id_karyawan_visitNasabah: number;
  updatedAtVisitNasabah: string;
  status_proposalKredit: string;
  id_karyawan_proposalKredit: number;
  updatedAtProposalKredit: string;
  status_persetujuansatu: string;
  id_karyawan_persetujuansatu: number;
  updatedAtPersetujuansatu: string;
  status_persetujuandua: string;
  nominal_disetujui: number;
  tenor_disetujui: number;
}

interface UserProfile {
  id: number;
  namaKaryawan: string;
  nik: number;
  jabatan: "marketing" | "spv" | "kabag" | "direkturBisnis";
}

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const statusSlikOptions = [
  { label: "Belum Ditinjau", value: "belum_ditinjau" },
  { label: "Lanjut", value: "lanjut" },
];

const statusPengajuanOptions = [
  { label: "Sedang Diajukan", value: "sedang_diajukan" },
];

const statusAnalisisOptions = [
  { label: "Belum Dianalisis", value: "belum_dianalisis" },
  { label: "Tolak", value: "tolak" },
  { label: "Setuju", value: "setuju" },
];

const statusVisitOptions = [
  { label: "Belum Dilakukan", value: "belum_dilakukan" },
  { label: "Tolak", value: "tolak" },
  { label: "Setuju", value: "setuju" },
];

const statusProposalOptions = [
  { label: "Belum Diajukan", value: "belum_diajukan" },
  { label: "Lanjut", value: "lanjut" },
]

const statusPersetujuan1Options = [
    { label: "Belum Disetujui", value: "belum_disetujui" },
    { label: "Setuju", value: "setuju" },
    { label: "Tolak", value: "tolak" },
]

const PersetujuanSatuTable: React.FC = () => {
    const [kreditData, setKreditData] = useState<Persetujuan1Kredit[]>([]);
    const [karyawanData, setKaryawanData] = useState<Karyawan[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [filteredData, setFilteredData] = useState<Persetujuan1Kredit[]>([]);
    const [bawahanList, setBawahanList] = useState<string[]>([]);
    const [selectedBawahan, setSelectedBawahan] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [jabatan, setJabatan] = useState<string | null>(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogAction, setDialogAction] = useState<string | null>(null);
    const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [isPersetujuanDialogOpen, setIsPersetujuanDialogOpen] = useState(false);
    const [selectedKredit, setSelectedKredit] = useState<Persetujuan1Kredit | null>(null);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
  
    const handlePersetujuanDialogClose = () => {
      setIsPersetujuanDialogOpen(false);
      setSelectedKredit(null);
    };

    //Get Status
    const getStatusPengajuanLabel = (status_pengajuan: string) => {
        const option = statusPengajuanOptions.find((option) => option.value === status_pengajuan);
        return option ? option.label : status_pengajuan;
        };
    
    const getStatusSlikLabel = (status_Slik: string) => {
        const option = statusSlikOptions.find((option) => option.value === status_Slik);
        return option ? option.label : status_Slik;
    };

    const getStatusAnalisisLabel = (status_analisisSlik: string) => {
        const option = statusAnalisisOptions.find((option) => option.value === status_analisisSlik);
        return option ? option.label : status_analisisSlik;
    };

    const getStatusVisitLabel = (status_visitNasabah: string) => {
        const option = statusVisitOptions.find((option) => option.value === status_visitNasabah);
        return option ? option.label: status_visitNasabah;
    }

    const getProposalLabel = (status_proposalKredit: string) => {
        const option = statusProposalOptions.find((option) => option.value === status_proposalKredit);
        return option? option.label: status_proposalKredit;
    }

    const getPersetujuan1Label = (status_persetujuansatu: string) => {
        const option = statusPersetujuan1Options.find((option) => option.value === status_persetujuansatu);
        return option? option.label: status_persetujuansatu;
    }
    
    //Fungsi get nama karyawan dari setiap tahap
    const getNamaKaryawanPengajuan = (id_karyawan_pengajuan: number, karyawanData: Karyawan[]): string => {
      const karyawan = karyawanData.find((k) => k.nik === id_karyawan_pengajuan);
      return karyawan ? karyawan.namaKaryawan : "Tidak Diketahui";
    };

    const getNamaKaryawanSlik = (id_karyawan_slik: number, karyawanData: Karyawan[]): string => {
      const karyawan = karyawanData.find((k) => k.nik === id_karyawan_slik);
      return karyawan ? karyawan.namaKaryawan : "Tidak Diketahui";
    };

    const getNamaKaryawanAnalisis = (id_karyawan_analisisSlik: number, karyawanData: Karyawan[]): string => {
      const karyawan = karyawanData.find((k) => k.nik === id_karyawan_analisisSlik);
      return karyawan ? karyawan.namaKaryawan : "Tidak Diketahui";
    };

    const getNamaKaryawanVisit = (id_karyawan_visitNasabah: number, karyawanData: Karyawan[]): string => {
      const karyawan = karyawanData.find((k) => k.nik === id_karyawan_visitNasabah);
      return karyawan ? karyawan.namaKaryawan : "Tidak Diketahui";
    };

    const getNamaKaryawanProposal = (id_karyawan_proposalKredit: number, karyawanData: Karyawan[]): string => {
      const karyawan = karyawanData.find((k) => k.nik === id_karyawan_proposalKredit);
      return karyawan ? karyawan.namaKaryawan : "Tidak Diketahui";
    };

    const getNamaKaryawanPersetujuan1 = (id_karyawan_persetujuansatu: number, karyawanData: Karyawan[]): string => {
        const karyawan = karyawanData.find((k) => k.nik === id_karyawan_persetujuansatu);
        return karyawan ? karyawan.namaKaryawan : "Tidak Diketahui";
      };

    // Fetch data kredit proposal
    useEffect(() => {
      const fetchKreditPersetujuan = async () => {
        try {
          const response = await fetch("http://localhost:8000/kredit/filter/Persetujuan1Table");
          if (!response.ok) throw new Error("Gagal mengambil Data");
          const data = await response.json();
          setKreditData(data);
        } catch (error) {
          console.error("Error fetching kredit data: ", error);
        }
      };
      fetchKreditPersetujuan();
      const interval = setInterval(fetchKreditPersetujuan, 3000); // Update setiap 5 detik
  
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
  
    // Fetch data karyawan
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

      let filtered: Persetujuan1Kredit[] = [];

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

    //Update
    const handlePersetujuanDialogSave = (nominal_disetujui: number, tenor_disetujui: number) => {
        if (!selectedId || !userProfile) {
          console.error("❌ Error: Tidak ada selectedId atau userProfile", { selectedId, userProfile });
          return;
        }
      
        const payload = {
          status_persetujuansatu: "setuju",
          id_karyawan_persetujuansatu: userProfile.nik,
          nominal_disetujui,
          tenor_disetujui,
        };
      
        console.log("✅ Memanggil updatePersetujuan1 dengan payload:", payload);
      
        updatePersetujuan1(payload);
    };
      
    
    const updatePersetujuan1 = async (payload: any) => {
        if (!selectedId || !userProfile) {
            console.error("❌ Error: selectedId atau userProfile tidak tersedia", { selectedId, userProfile });
            return;
        }
    
        // Pastikan payload memiliki status_persetujuansatu
        const cleanPayload = {
            ...payload,
            status_persetujuansatu: payload.status_persetujuansatu ?? "belum_disetujui",
            id_karyawan_persetujuansatu: payload.id_karyawan_persetujuansatu ?? userProfile.nik
        };
    
        console.log("📤 Mengirim Payload:", JSON.stringify(cleanPayload, null, 2));
    
        try {
            const response = await fetch(`http://localhost:8000/kredit/${selectedId}/persetujuan?step=satu`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cleanPayload),
            });
    
            const responseData = await response.json();
            console.log("🔄 Respon API:", responseData);
            console.log("🔍 Memanggil API dengan ID:", selectedId);
            console.log("🔍 URL yang dipanggil:", `http://localhost:8000/kredit/${selectedId}/persetujuan?step=satu`);

    
            if (!response.ok) {
                console.error("❌ API Error:", response.status, responseData);
                throw new Error(responseData.message || "Gagal memperbarui status persetujuan");
            }
    
            setKreditData((prevData) =>
                prevData.map((item) =>
                    item.id_kredit === selectedId
                        ? { ...item, ...cleanPayload }
                        : item
                )
            );
    
            setSnackbarMessage("Status persetujuan berhasil diperbarui");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Gagal memperbarui status persetujuan:", error);
            setSnackbarMessage("Gagal mengupdate status persetujuan");
            setSnackbarSeverity("error");
        } finally {
            setOpenSnackbar(true);
            setIsDialogOpen(false);
            setIsPersetujuanDialogOpen(false);
        }
    };
  
    const handleAction = (id_kredit: number, action: "setuju" | "tolak" | "batalkan") => {
      const selectedKredit = kreditData.find((item) => item.id_kredit === id_kredit);
      if (!selectedKredit) return;
  
      setSelectedId(id_kredit);
      setDialogAction(action);
  
      if (action === "setuju") {
          // Hanya buka Persetujuan Dialog jika nominal <= 25 juta
          if (selectedKredit.nominal_pengajuan <= 25000000) {
              setSelectedKredit(selectedKredit);
              setIsPersetujuanDialogOpen(true);
          } else {
              setIsDialogOpen(true);
          }
      } else {
          // Jika action bukan "setuju", langsung buka ConfirmationDialog
          setIsDialogOpen(true);
      }
    };
    
    const onConfirmAction = () => {
        if (!selectedId || !dialogAction) return;
      
        const selectedKredit = kreditData.find((item) => item.id_kredit === selectedId);
        if (!selectedKredit) return;
      
        const statusMap = {
          setuju: "setuju",
          tolak: "tolak",
          batalkan: "belum_disetujui"
        };
      
        const payload = {
          status_persetujuansatu: statusMap[dialogAction as "setuju" | "tolak" | "batalkan"],
          nominal_disetujui: dialogAction === "batalkan" ? selectedKredit.nominal_disetujui : 0,
          tenor_disetujui: dialogAction === "batalkan" ? selectedKredit.tenor_disetujui : 0
        };
      
        updatePersetujuan1(payload);
    };
      
    // Debugging perubahan kreditData
    useEffect(() => {
      console.log("Kredit data updated:", kreditData);
    }, [kreditData]);   

    // Search filter
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setPage(0);
    };
  
    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    };
  
    // Filter berdasarkan search query
    const searchedData = filteredData.filter((item) =>
      item.nasabah.namaNasabah.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Pagination
    const paginatedData = searchedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    setPage(0); // Reset ke halaman pertama setiap filter berubah
  }, [searchQuery, startDate, endDate, selectedBawahan]);
  

  return (
    <div className="overflow-x-auto w-full">
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
            <th className="px-6 py-3 text-center border-l border-white">Nama Admin Slik</th>
            {/* Langkah Ketiga */}
            <th className="px-6 py-3 text-center border-l border-white">Waktu Analisis</th>
            <th className="px-6 py-3 text-center border-l border-white">Status Analisis</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama Analisis</th>
            {/* Langkah Keempat */}
            <th className="px-6 py-3 text-center border-l border-white">Waktu Visit</th>
            <th className="px-6 py-3 text-center border-l border-white">Status Visit</th>
            <th className="px-6 py-3 text-center border-l border-white">Visitor</th>
            {/* Langkah Kelima */}
            <th className="px-6 py-3 text-center border-l border-white">Waktu Proposal</th>
            <th className="px-6 py-3 text-center border-l border-white">Status Proposal</th>
            <th className="px-6 py-3 text-center border-l border-white">Penulis Proposal</th>
            {/* Langkah Keenam */}
            <th className="px-6 py-3 text-center border-l border-white">Waktu Persetujuan Satu</th>
            <th className="px-6 py-3 text-center border-l border-white">Status Persetujuan Satu</th>
            {["spv"].includes(jabatan ?? "") ? (
              <>
                <th className="px-6 py-3 text-center border-l border-white">Approvers 1</th>
                <th className="px-6 py-3 text-center border-l border-white">Nominal Disetujui</th>
                <th className="px-6 py-3 text-center border-l border-white">Tenor Disetujui</th>
                <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Aksi</th>
              </>
            ) : (
                <>
                <th className="px-6 py-3 text-center border-l border-white">Approvers 1</th>
                <th className="px-6 py-3 text-center border-l border-white">Nominal Disetujui</th>
                <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Tenor Disetujui</th>
                </>
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
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
                      item.nominal_pengajuan
                    )}
                  </td>
                  <td className="px-6 py-4">{getStatusPengajuanLabel(item.status_pengajuan)}</td>
                  <td className="px-6 py-4">{item.tenor_pengajuan}</td>
                  <td className="px-6 py-4">{getNamaKaryawanPengajuan(item.id_karyawan_pengajuan, karyawanData)}</td>
                  {/* Langkah kedua */}
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
                  {/* Langkah Ketiga */}
                  <td className="px-6 py-4">
                    {new Date(item.updatedAtAnalisisSlik).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">{getStatusAnalisisLabel(item.status_analisisSlik)}</td>
                  <td className="px-6 py-4">{getNamaKaryawanAnalisis(item.id_karyawan_analisisSlik, karyawanData)}</td>
                  {/* Langkah Keempat */}
                  <td className="px-6 py-4">
                    {new Date(item.updatedAtVisitNasabah).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">{getStatusVisitLabel(item.status_visitNasabah)}</td>
                  <td className="px-6 py-4">{getNamaKaryawanVisit(item.id_karyawan_visitNasabah, karyawanData)}</td>
                  {/* Langkah Kelima */}
                  <td className="px-6 py-4">
                    {new Date(item.updatedAtProposalKredit).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">{getProposalLabel(item.status_proposalKredit)}</td>
                  <td className="px-6 py-4">{getNamaKaryawanProposal(item.id_karyawan_proposalKredit, karyawanData)}</td>
                  {/* Langkah Keenam */}
                  <td className="px-6 py-4">
                    {new Date(item.updatedAtPersetujuansatu).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4">{getPersetujuan1Label(item.status_persetujuansatu)}</td>
                  <td className="px-6 py-4">{getNamaKaryawanPersetujuan1(item.id_karyawan_persetujuansatu, karyawanData)}</td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
                      item.nominal_disetujui
                    )}
                  </td>
                  <td className="px-6 py-4">{item.tenor_disetujui}</td>
                  {["spv"].includes(jabatan ?? "") && (
                    <td className="px-6 py-4 flex space-x-2">
                      <div className="flex justify-center gap-4">
                        {item.status_persetujuansatu === "belum_disetujui" ? (
                          <>
                            <button
                              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                              onClick={() => handleAction(item.id_kredit, "setuju")}
                            >
                              Setujui
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                              onClick={() => handleAction(item.id_kredit, "tolak")}
                            >
                              Tolak
                            </button>
                          </>
                        ) : (
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                            onClick={() => handleAction(item.id_kredit, "batalkan")}
                            disabled={String(item.status_persetujuandua).trim() !== "belum_disetujui"}
                          >
                            Batalkan
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
          }
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
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={onConfirmAction}
        title={dialogAction === "batalkan" ? "Batalkan Pengajuan Kredit" : "Konfirmasi Aksi"}
        message={`Apakah Anda yakin ingin ${dialogAction} kredit ini?`}
        confirmText={dialogAction === "batalkan" ? "Ya, Batalkan" : "Ya"}
        cancelText="Batal"
      />
    {selectedKredit && (
        <PersetujuanKreditDialog
        open={isPersetujuanDialogOpen}
        onClose={handlePersetujuanDialogClose}
        onSave={handlePersetujuanDialogSave}
        kredit={{
            id_kredit: selectedKredit.id_kredit,
            nasabah: selectedKredit.nasabah,
            nominal_disetujui: selectedKredit.nominal_pengajuan,
            tenor_disetujui: selectedKredit.tenor_pengajuan,
        }}
        nominal_pengajuan={selectedKredit.nominal_pengajuan} // Kirim nominal_pengajuan
        jenisPersetujuan="satu"
        />
    )}
    <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
        </Alert>
    </Snackbar>
    </div>
  );
};

export default PersetujuanSatuTable;