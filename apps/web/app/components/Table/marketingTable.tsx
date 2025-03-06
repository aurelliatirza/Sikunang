import Link from "next/link";
import React, { useEffect, useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import { FaSearch } from "react-icons/fa";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Autocomplete, TextField } from "@mui/material";
import KonfirmasiCetakDialog from "../Dialog/konfirmasiCetakDialog";
import { useRouter } from "next/navigation";


dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Nasabah {
  namaNasabah: string;
  alamat: string;
  namaUsaha: string;
  no_telp: string;
  karyawan: {
    namaKaryawan: string;
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

interface Kunjungan {
  id_kunjungan: number;
  hasilKunjungan: string;
  createdAt: string;
  nasabah: Nasabah;
}

interface UserProfile {
  id: number;
  namaKaryawan: string;
  nik: number;
  jabatan: "spv" | "kabag" | "direkturBisnis";
}

const MarketingTable: React.FC = () => {
  const router = useRouter();
  const [openKonfirmasiCetakDialog, setOpenKonfirmasiCetakDialog] = useState(false);
  const [jabatan, setJabatan] = useState<string | null>(null);
  const [kunjunganData, setKunjunganData] = useState<Kunjungan[]>([]);
  const [filteredKunjungan, setFilteredKunjungan] = useState<Kunjungan[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [bawahanList, setBawahanList] = useState<string[]>([]);
  const [selectedBawahan, setSelectedBawahan] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    const fetchKunjungan = async () => {
      try {
        const response = await fetch("http://localhost:8000/kunjungan");
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        console.log("Data kunjungan:", data);
        setKunjunganData(data);
      } catch (error) {
        console.error("Error fetching kunjungan data:", error);
      }
    };

    fetchKunjungan();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Gagal mengambil data user");

        const data = await response.json();
        console.log("Data user:", data);
        setUserProfile(data);
        
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!userProfile) return;

    let bawahanNames: string[] = [];

    if (userProfile.jabatan === "spv") {
      bawahanNames = kunjunganData
        .filter((item) => item.nasabah.karyawan.nik_SPV === userProfile.nik)
        .map((item) => item.nasabah.karyawan.namaKaryawan);
    } else if (userProfile.jabatan === "kabag") {
      bawahanNames = kunjunganData
        .filter((item) => item.nasabah.karyawan.nik_kabag === userProfile.nik)
        .map((item) => item.nasabah.karyawan.namaKaryawan);
    } else if (userProfile.jabatan === "direkturBisnis") {
      bawahanNames = kunjunganData
        .filter((item) => item.nasabah.karyawan.nik_direkturBisnis === userProfile.nik)
        .map((item) => item.nasabah.karyawan.namaKaryawan);
    }

    // Hilangkan nama yang duplikat
    setBawahanList([...new Set(bawahanNames)]);
  }, [userProfile, kunjunganData]);

  // Filter data berdasarkan jabatan dan ID pengguna yang login
  useEffect(() => {
    if (!userProfile) return;

    let filteredData: Kunjungan[] = [];

    if (userProfile.jabatan === "spv") {
      filteredData = kunjunganData.filter(
        (item) => item.nasabah.karyawan.nik_SPV === userProfile.nik
      );
    } else if (userProfile.jabatan === "kabag") {
      filteredData = kunjunganData.filter(
        (item) => item.nasabah.karyawan.nik_kabag === userProfile.nik
      );
    } else if (userProfile.jabatan === "direkturBisnis") {
      filteredData = kunjunganData.filter(
        (item) => item.nasabah.karyawan.nik_direkturBisnis === userProfile.nik
      );
    } else {
      filteredData = kunjunganData; // Untuk AO atau jabatan lainnya, tampilkan semua
    }

    // Filter data berdasarkan tanggal
    filteredData = filteredData.filter((item) => {
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

    // Filter data berdasarkan nama bawahan yang dipilih
    if (selectedBawahan) {
      filteredData = filteredData.filter(
        (item) => item.nasabah.karyawan.namaKaryawan === selectedBawahan
      );
    }

    setFilteredKunjungan(filteredData);
  }, [userProfile, kunjunganData, startDate, endDate, selectedBawahan]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const filteredData = filteredKunjungan
    .filter((item) =>
      item.nasabah.namaNasabah.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((item) => {
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

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    setPage(0); // Reset ke halaman pertama setiap filter berubah
  }, [searchQuery, startDate, endDate, selectedBawahan]);

  return (
    <div className="overflow-x-auto w-full">
      <div className="flex justify-between items-center py-2">
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
        <Autocomplete
          options={bawahanList}
          value={selectedBawahan}
          onChange={(_, newValue) => setSelectedBawahan(newValue)}
          renderInput={(params) => <TextField {...params} label="AO" size="small" />}
          className="w-40"
        />
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
            <th className="px-6 py-3 text-center border-l border-white">Waktu Kunjungan</th>
            <th className="px-6 py-3 text-center border-l border-white">Hasil Kunjungan</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama AO</th>
            <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-6 py-3 text-center">{page * rowsPerPage + index + 1}</td>
                  <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.namaNasabah}</td>
                  <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.alamat}</td>
                  <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.desa.nama}</td>
                  <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.desa.Kecamatan.nama}</td>
                  <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.desa.Kecamatan.KabupatenKota.nama}</td>
                  <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.namaUsaha}</td>
                  <td className="px-6 py-3 text-center border-l border-white">
                    {new Date(item.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-3 text-center border-l border-white">{item.hasilKunjungan}</td>
                  <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.karyawan.namaKaryawan}</td>
                  <td className="px-6 py-4 text-center border-l border-white">
                    <Link href={`/marketing/${item.id_kunjungan}`}>
                      <button className="text-blue-500 hover:text-blue-700 hover:underline">
                        Lihat Selengkapnya
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={11} className="px-6 py-3 text-center">Tidak ada data kunjungan.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-end py-2">
        <TablePagination
          component="div"
          count={filteredKunjungan.length}
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
        <button
          className="bg-blue-200 hover:bg-blue-300 text-white font-semibold py-5 px-8 w-52 h-27 rounded-lg shadow-md transition duration-300"
          onClick={() => setOpenKonfirmasiCetakDialog(true)}
        >
          Cetak
        </button>
        {jabatan === "marketing" ? (
        <KonfirmasiCetakDialog
          open={openKonfirmasiCetakDialog}
          onClose={() => setOpenKonfirmasiCetakDialog(false)}
          onConfirm={(startDate, endDate) => {
            console.log("Tanggal mulai:", startDate);
            console.log("Tanggal akhir:", endDate);
            setOpenKonfirmasiCetakDialog(false);
            router.push(`/pdfPageMarketing?startDate=${startDate}&endDate=${endDate}`);
          }}
          jabatan={jabatan} // Pastikan ini dikirim
        />
      ) : (
        <KonfirmasiCetakDialog
          open={openKonfirmasiCetakDialog}
          onClose={() => setOpenKonfirmasiCetakDialog(false)}
          onConfirm={(startDate, endDate, selectedBawahan) => {
            console.log("Tanggal mulai:", startDate);
            console.log("Tanggal akhir:", endDate);
            console.log("Bawahan yang dipilih:", selectedBawahan);
            setOpenKonfirmasiCetakDialog(false);
            router.push(
              `/pdfPage?startDate=${startDate}&endDate=${endDate}&selectedBawahan=${selectedBawahan}`
            );
          }}
          jabatan={jabatan as "spv" | "kabag" | "direktur_bisnis"}
          bawahanList={bawahanList} // Pastikan data bawahan dikirim
        />
)}
      </div>
    </div>
  );
};

export default MarketingTable;
