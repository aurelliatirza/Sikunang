import React, { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
import { FaSearch } from "react-icons/fa";
import PengajuanKreditDialog from "../Dialog/pengajuanKreditDialog";

interface Karyawan {
  nik: number;
  namaKaryawan: string;
  jabatan: "kacab"| "marketing" | "spv" | "kabag" | "direkturBisnis";
  nik_SPV?: number;
  nik_kabag?: number;
  nik_kacab?: number;
  nik_direkturBisnis?: number;
}

interface NasabahWithCount {
  id_nasabah: number;
  namaNasabah: string;
  alamat: string;
  no_telp: string;
  jumlahKunjungan: number;
  nik: number;
  karyawan: Karyawan;
}

interface UserProfile extends Karyawan {}

const NasabahTable: React.FC = () => {
  const [jabatan, setJabatan] = useState<string | null>(null);
  const [data, setData] = useState<NasabahWithCount[]>([]);
  const [filteredNasabahData, setFilteredNasabahData] = useState<NasabahWithCount[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedBawahan, setSelectedBawahan] = useState<string | null>(null);
  const [bawahanList, setBawahanList] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedNasabah, setSelectedNasabah] = useState<NasabahWithCount | null>(null);


  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (nasabah: NasabahWithCount) => {
    setSelectedNasabah(nasabah);
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedNasabah(null);
  };
  

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nasabah/kunjungan`);
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }
  , []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Gagal mengambil data user");

        const data = await response.json();
        console.log("Data user:", data);
        setUserProfile(data);
        setJabatan(data.jabatan);
        
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
  
  // Filtering data sesuai dengan user yang login
  useEffect(() => {
    if (!userProfile) return;

    console.log("User yang sedang login:", userProfile);
    console.log("Data nasabah sebelum filtering:", data);

    let filtered: NasabahWithCount[] = [];

    if (userProfile.jabatan === "marketing") {
      console.log("Filtering berdasarkan nik:", userProfile.nik);
      filtered = data.filter((item) => item.nik === userProfile.nik);
    } else {
      filtered = data.filter((item) => {
        if (userProfile.jabatan === "spv") {
          return item.karyawan.nik_SPV === userProfile.nik;
        } else if (userProfile.jabatan === "kabag") {
          return item.karyawan.nik_kabag === userProfile.nik;
        } else if (userProfile.jabatan === "kacab") {
          return item.karyawan.nik_kacab === userProfile.nik;
        } else if (userProfile.jabatan === "direkturBisnis") {
          return item.karyawan.nik_direkturBisnis === userProfile.nik;
        }
        return false;
      });

      // Ambil daftar nama bawahan
      const bawahanNames = [...new Set(filtered.map((item) => item.karyawan.namaKaryawan))];
      setBawahanList(bawahanNames);

      if (selectedBawahan) {
        filtered = filtered.filter((item) => item.karyawan.namaKaryawan === selectedBawahan);
      }
    }

    console.log("Data yang sudah difilter:", filtered);
    setFilteredNasabahData(filtered);
  }, [userProfile, data, selectedBawahan]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset ke halaman pertama saat mencari
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  
  const filteredData = data.filter((item) =>
    item.namaNasabah.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-full"> {/* Wrapper untuk memastikan overflow scroll berfungsi */}
        {/* Filter Bawahan */}
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
        {/* Pagination di atas hanya untuk menampilkan teks "Rows per page" */}
        <div className="flex justify-between items-center py-2">
        <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            labelRowsPerPage="Rows per page"
            labelDisplayedRows={() => ""} // 🔹 Hilangkan informasi halaman di sini
            sx={{
              ".MuiTablePagination-spacer": { display: "none" },
              ".MuiTablePagination-displayedRows": { display: "none" }, // 🔹 Hilangkan info halaman
              ".MuiTablePagination-actions": { display: "none" }, // 🔹 Hilangkan navigasi halaman
            }}
          />
          <form className="flex items-center " onSubmit={handleSearchSubmit}>
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
            <th className="border px-4 py-2 rounded-tl-2xl">No</th>
            <th className="border px-4 py-2">Nama</th>
            <th className="border px-4 py-2">Alamat</th>
            <th className="border px-4 py-2">No. Telepon</th>
            <th className="border px-4 py-2">Jumlah Kunjungan</th>
            <th className="border px-4 py-2">AO</th>
            { (jabatan === "marketing" || jabatan === "spv") && (
              <th className="border px-4 py-2">Aksi Pengajuan</th>
            )}
            {(jabatan !== "marketing") && (
              <th className="border px-4 py-2 rounded-tr-2xl">Aksi Kunjungan</th>
            ) }
          </tr>
        </thead>
        <tbody>
          {filteredNasabahData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              <td className="px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{item.namaNasabah}</td>
              <td className="border px-4 py-2">{item.alamat}</td>
              <td className="border px-4 py-2">{item.no_telp}</td>
              <td className="border px-4 py-2 text-center">{item.jumlahKunjungan}</td>
              <td className="border px-4 py-2">{item.karyawan.namaKaryawan}</td>
              
              {/* Hanya tampilkan kolom aksi pengajuan jika user marketing atau spv */}
              { (jabatan === "marketing" || jabatan === "spv") && (
                <td className="border px-4 py-2">
                  <button 
                    onClick={() => handleOpenModal(item)} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Ajukan
                  </button>
                </td>
              )}
              
              {(jabatan !== "marketing") && (
                <td className="border px-4 py-2">
                <Link href={`/nasabah/${item.id_nasabah}`}>
                  <button className="text-blue-500 hover:text-blue-700 hover:underline">
                    Lihat Selengkapnya
                  </button>
                </Link>
              </td>
              )}
            </tr>
          ))}
        </tbody>

        </table>
        <div className="flex justify-end py-2">
            <TablePagination
              component="div"
              count={data.length}
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
            <PengajuanKreditDialog
              open={openModal}
              onClose={handleCloseModal}
              onsave={(createdKredit) => {
                console.log("Kredit yang diajukan:", createdKredit);
                handleCloseModal();
              }}
              nasabah={{
                id_nasabah: selectedNasabah?.id_nasabah ?? 0,
                namaNasabah: selectedNasabah?.namaNasabah ?? "",
                alamat: selectedNasabah?.alamat ?? "",
                namaUsaha: "", // Sesuaikan dengan data yang tersedia
                no_telp: selectedNasabah?.no_telp ?? "",
                nik: undefined,
                desaKelurahanId: undefined,
                karyawan: {
                  namaKaryawan: selectedNasabah?.karyawan.namaKaryawan ?? "",
                },
                desa: {
                  nama: "",
                  Kecamatan: {
                    nama: "",
                    KabupatenKota: {
                      nama: "",
                    },
                  },
                },
              }}
            />
          </div>
      </div>
    </div>
  );
};

export default NasabahTable;