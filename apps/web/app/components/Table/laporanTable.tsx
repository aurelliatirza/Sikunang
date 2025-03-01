import { useEffect, useState } from "react";
import { MdEditSquare } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import AlertDialog from "../Dialog/alertHapusDialog";
import EditKunjunganDialog from "../Dialog/editKunjunganDialog";
import Link from "next/link";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import TablePagination from "@mui/material/TablePagination";

interface Nasabah {
  id_nasabah: number;
  namaNasabah: string;
  alamat: string;
  namaUsaha: string;
  no_telp: string;
  karyawan: {
    namaKaryawan: string;
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

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const LaporanTable: React.FC = () => {
  const [kunjunganData, setKunjunganData] = useState<Kunjungan[]>([]);
  const [namaKaryawan, setNamaKaryawan] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedKunjungan, setSelectedKunjungan] = useState<Kunjungan | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

        if (!response.ok) {
          if (response.status === 401) {
            console.error("Unauthorized: Token mungkin tidak terkirim atau invalid.");
          }
          throw new Error(`Gagal mengambil data user: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("User Data:", data);
        setNamaKaryawan(data.name);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Fungsi untuk membuka modal konfirmasi hapus
  const handleOpenModal = (id_kunjungan: number) => {
    setSelectedId(id_kunjungan);
    setOpenModal(true);
  };

  // Fungsi untuk menutup modal hapus
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedId(null);
  };

  // Fungsi untuk membuka dialog edit kunjungan
  const handleEditClick = (kunjungan: Kunjungan) => {
    setSelectedKunjungan(kunjungan); // Set kunjungan langsung tanpa manipulasi manual
    setOpenEditDialog(true);
  };

  // Fungsi untuk menutup dialog edit kunjungan
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedKunjungan(null);
  };

  // Fungsi untuk menyimpan perubahan kunjungan
  const handleSaveEdit = async (updatedKunjungan: Partial<Kunjungan>) => {
    try {
      // Update tabel Kunjungan
      if (updatedKunjungan.id_kunjungan) {
        const responseKunjungan = await fetch(
          `http://localhost:8000/kunjungan/${updatedKunjungan.id_kunjungan}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              hasilKunjungan: updatedKunjungan.hasilKunjungan,
              createdAt: updatedKunjungan.createdAt,
            }),
          }
        );

        if (!responseKunjungan.ok) {
          throw new Error("Gagal memperbarui data kunjungan");
        }
      }

      // Update tabel Nasabah
      if (updatedKunjungan.nasabah?.id_nasabah) {
        const responseNasabah = await fetch(
          `http://localhost:8000/nasabah/${updatedKunjungan.nasabah.id_nasabah}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              namaNasabah: updatedKunjungan.nasabah.namaNasabah,
              alamat: updatedKunjungan.nasabah.alamat,
              namaUsaha: updatedKunjungan.nasabah.namaUsaha,
              no_telp: updatedKunjungan.nasabah.no_telp,
            }),
          }
        );

        if (!responseNasabah.ok) {
          throw new Error("Gagal memperbarui data nasabah");
        }
      }

      // 🔹 Ambil data terbaru dari API untuk memperbarui state setelah update Nasabah
      const responseUpdated = await fetch("http://localhost:8000/kunjungan");
      if (!responseUpdated.ok) throw new Error("Gagal mengambil data terbaru");

      const updatedData = await responseUpdated.json();
      setKunjunganData(updatedData); // 🔹 Perbarui state dengan data terbaru

      setSnackbarMessage("Laporan Anda berhasil diperbarui");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      handleCloseEditDialog(); // Tutup dialog setelah sukses
    } catch (error) {
      console.error("Error updating data:", error);
      setSnackbarMessage("Gagal memperbarui laporan");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  // Fungsi untuk menghapus kunjungan setelah konfirmasi
  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      const response = await fetch(`http://localhost:8000/kunjungan/${selectedId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data kunjungan");
      }

      setKunjunganData((prevData) =>
        prevData.filter((item) => item.id_kunjungan !== selectedId)
      );

      setSnackbarMessage("Laporan Anda berhasil dihapus");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error deleting kunjungan data:", error);
      setSnackbarMessage("Gagal menghapus laporan");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      handleCloseModal();
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="overflow-x-auto w-full">
      {/* Pagination di atas hanya untuk menampilkan teks "Rows per page" */}
      <div className="flex justify-between items-center py-2">
      <TablePagination
          component="div"
          count={kunjunganData.length}
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

      </div>

      {/* Tabel */}
      <table className="min-w-[1200px] text-sm border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="px-6 py-3 text-center rounded-tl-2xl" style={{ width: "50px" }}>No</th>
            <th className="px-6 py-3 text-center border-l border-white" style={{ width: "250px" }}>Nama Nasabah</th>
            <th className="px-6 py-3 text-center border-l border-white" style={{ width: "250px" }}>Alamat</th>
            <th className="px-6 py-3 text-center border-l border-white">Kelurahan</th>
            <th className="px-6 py-3 text-center border-l border-white">Kecamatan</th>
            <th className="px-6 py-3 text-center border-l border-white">Kota</th>
            <th className="px-6 py-3 text-center border-l border-white" style={{ width: "250px" }}>Nama Usaha</th>
            <th className="px-6 py-3 text-center border-l border-white">Waktu Kunjungan</th>
            <th className="px-6 py-3 text-center border-l border-white" style={{ width: "250px" }}>Hasil Kunjungan</th>
            <th className="px-6 py-3 text-center border-l border-white">Nama AO</th>
            <th className="px-6 py-3 text-center border-l border-white rounded-tr-2xl" style={{ width: "180px" }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {kunjunganData.length > 0 ? (
            kunjunganData
              .filter(item => item.nasabah.karyawan.namaKaryawan === namaKaryawan)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item, index) => (
                <tr key={item.id_kunjungan} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-6 py-3 text-center">{index + 1 + page * rowsPerPage}</td>
                  <td className="px-6 py-3 text-center border-l border-white whitespace-nowrap">
                    <Link href={`/laporan/${item.id_kunjungan}`} className="text-blue-900 hover:underline">
                      {item.nasabah.namaNasabah}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-center border-l border-white whitespace-nowrap">
                    {item.nasabah.alamat}
                  </td>
                  <td className="px-6 py-3 text-center border-l border-white whitespace-nowrap">
                    {item.nasabah.desa.nama}
                  </td>
                  <td className="px-6 py-3 text-center border-l border-white whitespace-nowrap">
                    {item.nasabah.desa.Kecamatan.nama}
                  </td>
                  <td className="px-6 py-3 text-center border-l border-white whitespace-nowrap">
                    {item.nasabah.desa.Kecamatan.KabupatenKota.nama}
                  </td>
                  <td className="px-6 py-3 text-center border-l border-white whitespace-nowrap">
                    {item.nasabah.namaUsaha}
                  </td>
                  <td className="px-6 py-3 text-center border-l border-white whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td className="px-6 py-3 text-center border-l border-white whitespace-nowrap">
                    {item.hasilKunjungan}
                  </td>
                  <td className="px-6 py-3 text-center border-l border-white whitespace-nowrap">
                    {item.nasabah.karyawan.namaKaryawan}
                  </td>
                  <td className="px-6 py-4 text-center border-l border-white whitespace-nowrap">
                    <div className="flex justify-center space-x-2">
                      <button className="text-yellow-500 hover:text-yellow-600" onClick={() => handleEditClick(item)}>
                        <MdEditSquare size={36} />
                      </button>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleOpenModal(item.id_kunjungan)}>
                        <RiDeleteBin6Fill size={36} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={11} className="text-center py-6 text-gray-500">Tidak ada data kunjungan yang tersedia.</td>
            </tr>
          )}
        </tbody>
      </table>

          <AlertDialog
            open={openModal}
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
          />
          {/* Komponen EditKunjunganDialog */}
          {selectedKunjungan && (
            <EditKunjunganDialog
              open={openEditDialog}
              onClose={handleCloseEditDialog}
              kunjungan={selectedKunjungan ?? null} // Pastikan null jika belum ada data
              onsave={handleSaveEdit}
            />
          )}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <div className="flex justify-end py-2">
            <TablePagination
              component="div"
              count={kunjunganData.length}
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
        </div>
  );
};

export default LaporanTable;