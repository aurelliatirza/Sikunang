import React, { useState, useEffect, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import ConfirmationDialog from "../Dialog/alertKonfirmasiKreditDialog";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import TablePagination from "@mui/material/TablePagination";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Chip } from "@mui/material";

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
    nik_kacab?: number;
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
    jenis_kantor: string;
  };
}

interface VisitKredit {
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
}

interface UserProfile {
  id: number;
  namaKaryawan: string;
  nik: number;
  jabatan: "marketing" | "spv" | "kabag" | "kacab" | "direkturBisnis";
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
]

const VisitTable: React.FC = () => {
    const router = useRouter();
    const [kreditData, setKreditData] = useState<VisitKredit[]>([]);
    const [karyawanData, setKaryawanData] = useState<Karyawan[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [filteredData, setFilteredData] = useState<VisitKredit[]>([]);
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
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

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

  //Fungsi Get Nama Karyawan
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

  //Fetch data kredit visit
  useEffect(() => {
    const fetchKreditPengajuan = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kredit/filter/visitTable`);
        if (!response.ok) throw new Error("Gagal mengambil Data");
        const data: VisitKredit[] = await response.json();
        let filteredData: VisitKredit[] = [];
        let bawahanNames: string[] = [];
  
        if (userProfile?.jabatan === "marketing") {
          // Jika user adalah marketing, hanya melihat pengajuan dirinya sendiri
          filteredData = data.filter((item) => item.nasabah.karyawan.nik === userProfile.nik);
        } else {
          // Jika user adalah atasan, ambil data dari bawahannya
          if (userProfile?.jabatan === "spv") {
            filteredData = data.filter((item) => item.nasabah.karyawan.nik_SPV === userProfile.nik);
          } else if (userProfile?.jabatan === "kabag") {
            filteredData = data.filter((item) => item.nasabah.karyawan.nik_kabag === userProfile.nik);
          } else if (userProfile?.jabatan === "kacab") {
            filteredData = data.filter((item) => item.nasabah.karyawan.nik_kacab === userProfile.nik);
          } else if (userProfile?.jabatan === "direkturBisnis") {
            filteredData = data.filter((item) => item.nasabah.karyawan.nik_direkturBisnis === userProfile.nik);
          }
  
          // Kumpulkan nama bawahan dari hasil filter
          bawahanNames = [...new Set(filteredData.map((item) => item.nasabah.karyawan.namaKaryawan))];
          setBawahanList(bawahanNames);
        }
  
        // Jika ada AO (bawahan) dipilih, filter lagi berdasarkan nama AO
        if (selectedBawahan) {
          filteredData = filteredData.filter((item) => item.nasabah.karyawan.namaKaryawan === selectedBawahan);
        }
  
        setKreditData(filteredData);
      } catch (error) {
        console.error("Error fetching kredit data: ", error);
      }
    };
  
    fetchKreditPengajuan();
    const interval = setInterval(fetchKreditPengajuan, 5000); // Update setiap 5 detik
  
    return () => clearInterval(interval);
  }, [userProfile, selectedBawahan]); // Fetch ulang jika jabatan atau pilihan AO berubah

    // Fetch data user profile
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
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
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/karyawan`);
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

      let filtered: VisitKredit[] = [];

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
  

  //TODO: pastikan yang berhak update itu sesuai limit
  const berhakACCVisit = (id_kredit: number, nominal_pengajuan: number, jenis_kantor: string, nasabah: any) => {
    console.log("🔍 Memeriksa Hak ACC untuk Kredit ID:", id_kredit);

    const limitKabag = 50000000; // Untuk kantor Pusat
    const limitKacab = 75000000; // Untuk kantor Cabang

    const { nik_SPV, nik_kabag, nik_kacab, nik_direkturBisnis } = nasabah.karyawan;

    let accUser = null;

    if (nominal_pengajuan <= 25000000) {
        accUser = { level: "SPV", nik: nik_SPV };
    } else if (jenis_kantor === "Pusat" && nominal_pengajuan <= limitKabag) {
        accUser = { level: "Kabag", nik: nik_kabag };
    } else if (jenis_kantor === "Cabang" && nominal_pengajuan <= limitKacab) {
        accUser = { level: "Kacab", nik: nik_kacab };
    } else {
        accUser = { level: "Direktur", nik: nik_direkturBisnis };
    }

    if (accUser?.nik) {
        console.log(`✅ Kredit ID ${id_kredit} → ${accUser.level} - ${accUser.nik}`);
        return { id_kredit, level: accUser.level, nik: accUser.nik };
    }

    return { id_kredit, level: null, nik: null };
};

// Hitung daftar hak ACC berdasarkan **setiap kredit**
const hakACCList = useMemo(() => {
    return kreditData.map(item => {
        const karyawanPengajuan = karyawanData.find(k => k.nik === item.id_karyawan_pengajuan);
        const jenis_kantor = karyawanPengajuan?.kantor?.jenis_kantor ?? "";

        return berhakACCVisit(item.id_kredit, item.nominal_pengajuan, jenis_kantor, item.nasabah);
    });
}, [kreditData]);

useEffect(() => {
    console.log("🔍 hakACCList setelah dihitung:", hakACCList);
}, [hakACCList]);

// Mapping hak akses berdasarkan user login
const hakACCMap = useMemo(() => {
    if (!userProfile) return {};

    return kreditData.reduce((acc, item) => {
        const hakACC = hakACCList.find(hak => hak.id_kredit === item.id_kredit);

        const userLevel = userProfile.jabatan?.toLowerCase();
        const userNik = userProfile.nik;

        const hasPermission = hakACC?.nik === userNik && hakACC?.level?.toLowerCase() === userLevel;

        acc[item.id_kredit] = hasPermission;
        return acc;
    }, {} as Record<number, boolean>);
}, [hakACCList, userProfile?.nik, userProfile?.jabatan]);

useEffect(() => {
    console.log("🔍 hakACCMap (Siapa yang berhak per kredit):", hakACCMap);
}, [hakACCMap]);

  const handleAction = (id_kredit: number, action: "setuju" | "tolak" | "batalkan") => {
    setSelectedId(id_kredit);
    setDialogAction(action);
    setIsDialogOpen(true);
  };  
  const onConfirmAction = () => {
    console.log("onConfirmAction dipanggil");
    console.log("selectedId:", selectedId);
    console.log("dialogAction:", dialogAction);
  
    if (!selectedId || !dialogAction) {
      console.error("selectedId atau dialogAction tidak tersedia");
      return;
    }
  
    const statusMap = {
      setuju: "setuju",
      tolak: "tolak",
      batalkan: "belum_dilakukan",
    };
  
    console.log("Mengupdate status visit ke:", statusMap[dialogAction as "setuju" | "tolak" | "batalkan"]);
  
    updateStatusVisit(statusMap[dialogAction as "setuju" | "tolak" | "batalkan"]);
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
  const searchedData = filteredData.filter((item) =>
    item.nasabah.namaNasabah.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
    const paginatedData = searchedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    setPage(0); // Reset ke halaman pertama setiap filter berubah
  }, [searchQuery, startDate, endDate, selectedBawahan]);
  
  //Update
  const updateStatusVisit = async (status: string) => {
    if (!selectedId || !userProfile) {
      console.error("selectedId atau userProfile tidak tersedia");
      return;
    }
  
    console.log(`Mengirim request ke API: status=${status}, id_kredit=${selectedId}`);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kredit/${selectedId}/visit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_visitNasabah: status, id_karyawan_visitNasabah: userProfile.nik }),
      });
  
      console.log("Response API:", response);
      if (!response.ok) throw new Error("Gagal memperbarui status Visit");
  
      setKreditData((prevData) =>
        prevData.map((item) =>
          item.id_kredit === selectedId
            ? { ...item, status_visitNasabah: status, id_karyawan_visitNasabah: userProfile.nik }
            : item
        )
      );
  
      console.log("Status Visit berhasil diperbarui!");
      setSnackbarMessage("Status Visit berhasil diperbarui");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error(`Gagal memperbarui status Visit: ${error}`);
      setSnackbarMessage("Gagal mengupdate status Visit");
      setSnackbarSeverity("error");
    } finally {
      setOpenSnackbar(true);
      setIsDialogOpen(false);
    }
  };  


  return (
    <>
    <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full gap-4">
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
        }} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex gap-4">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
            format="DD/MM/YYYY"
            slotProps={{ textField: { size: "small", fullWidth: true } }} />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
            format="DD/MM/YYYY"
            slotProps={{ textField: { size: "small", fullWidth: true } }} />
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
    <div className="overflow-x-auto w-full">
        <table className="min-w-[1200px] text-sm border-collapse border border-gray-300 mt-2">
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
              {/* Hanya tampilkan kolom "Aksi" jika jabatan adalah spv, kabag, atau direkturBisnis */}
              {["spv", "kacab" ,"kabag", "direkturBisnis"].includes(jabatan ?? "") ? (
                <>
                  <th className="px-6 py-3 text-center border-l border-white">Visitor</th>
                  <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Aksi</th>
                </>
              ) : (
                <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Visitor</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 &&
              paginatedData
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((item, index) => {
                  const isBerhakACC = hakACCMap[item.id_kredit] ?? false;

                  console.log(
                    `🔍 Kredit ${item.id_kredit}: isBerhakACC =`,
                    isBerhakACC,
                    "Jabatan User:",
                    userProfile?.jabatan,
                    "Hak ACC Kredit:",
                    hakACCList.find((h) => h.id_kredit === item.id_kredit) ?? "Tidak ada"
                  );

                  return (
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
                      <td className="px-6 py-4">
                        <Chip
                          label={getStatusPengajuanLabel(item.status_pengajuan)}
                          color={item.status_pengajuan == "sedang_diajukan" ? "primary" : "error"}
                          variant="filled" />
                      </td>
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
                      <td className="px-6 py-4">
                        <Chip
                          label={getStatusSlikLabel(item.status_Slik)}
                          color={item.status_Slik == "belum_ditinjau" ? "primary" : "success"}
                          variant="filled" />
                      </td>
                      <td className="px-6 py-4">{getNamaKaryawanSlik(item.id_karyawan_slik, karyawanData)}</td>
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
                      <td className="px-6 py-4">
                        <Chip
                          label={getStatusAnalisisLabel(item.status_analisisSlik)}
                          color={item.status_analisisSlik === "belum_dianalisis"
                            ? "primary"
                            : item.status_analisisSlik === "setuju"
                              ? "success"
                              : "error"}
                          variant="filled" // Bisa diganti "outlined" jika ingin tanpa background
                        />
                      </td>
                      <td className="px-6 py-4">{getNamaKaryawanAnalisis(item.id_karyawan_analisisSlik, karyawanData)}</td>
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
                      <td className="px-6 py-4">
                        <Chip
                          label={getStatusVisitLabel(item.status_visitNasabah)}
                          color={item.status_visitNasabah === "belum_dilakukan"
                            ? "primary"
                            : item.status_visitNasabah === "setuju"
                              ? "success"
                              : "error"}
                          variant="filled" // Bisa diganti "outlined" jika ingin tanpa background
                        />
                      </td>
                      <td className="px-6 py-4">{getNamaKaryawanVisit(item.id_karyawan_visitNasabah, karyawanData)}</td>
                      {["spv", "kabag", "kacab", "direkturBisnis"].includes(jabatan ?? "") && (
                        <td className="px-6 py-4 flex space-x-2">
                          <div className="flex justify-center gap-4">
                            {item.status_visitNasabah === "belum_dilakukan" ? (
                              <>
                                <button
                                  className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                  onClick={() => handleAction(item.id_kredit, "setuju")}
                                  disabled={!isBerhakACC}
                                >
                                  Setujui
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                  onClick={() => handleAction(item.id_kredit, "tolak")}
                                  disabled={!isBerhakACC}
                                >
                                  Tolak
                                </button>
                              </>
                            ) : (
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                onClick={() => handleAction(item.id_kredit, "batalkan")}
                                disabled={!isBerhakACC || item.status_proposalKredit !== "belum_diajukan"}
                              >
                                Batalkan
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
          </tbody>
        </table>
        <div className="flex justify-end py-2">
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={() => { } } // 🔹 Dinonaktifkan agar tidak muncul lagi
            rowsPerPageOptions={[]} // 🔹 Hilangkan dropdown "Rows per page" di bawah
            labelRowsPerPage=""
            labelDisplayedRows={({ page, count }) => `Halaman ${page + 1} dari ${Math.ceil(count / rowsPerPage)}`}
            sx={{
              display: "flex", // 🔹 Pastikan flexbox aktif
              justifyContent: "flex-end", // 🔹 Pindahkan ke kanan
              ".MuiTablePagination-spacer": { display: "none" },
              ".MuiTablePagination-selectLabel": { display: "none" }, // 🔹 Hilangkan "Rows per page" bawah
              ".MuiTablePagination-input": { display: "none" }, // 🔹 Hilangkan dropdown bawah
            }} />
        </div>
        <ConfirmationDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={onConfirmAction}
          title={dialogAction === "batalkan" ? "Batalkan Visit Kredit" : "Konfirmasi Aksi"}
          message={`Apakah Anda yakin ingin ${dialogAction} kredit ini?`}
          confirmText={dialogAction === "batalkan" ? "Ya, Batalkan" : "Ya"}
          cancelText="Batal" />
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
      </div></>
  );
};

export default VisitTable;