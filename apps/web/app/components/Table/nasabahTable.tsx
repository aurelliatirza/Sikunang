import React, { useState } from "react";
import Link from "next/link";
import { useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";
import { FaSearch } from "react-icons/fa";

interface NasabahWithCount {
  id_nasabah: number;
  namaNasabah: string;
  alamat: string;
  no_telp: string;
  jumlahKunjungan: number;
  karyawan: {
    namaKaryawan: string;
  };
}

const NasabahTable: React.FC = () => {
  const [data, setData] = React.useState<NasabahWithCount[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/nasabah/kunjungan");
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }
  , []);

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
              <th className="border px-4 py-2 rounded-tr-2xl">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.namaNasabah}</td>
                <td className="border px-4 py-2">{item.alamat}</td>
                <td className="border px-4 py-2">{item.no_telp}</td>
                <td className="border px-4 py-2">{item.jumlahKunjungan}</td>
                <td className="border px-4 py-2">{item.karyawan.namaKaryawan}</td>
                <td className="border px-4 py-2">
                  <Link href={`/nasabah/${item.id_nasabah}`}>
                    <button className="text-blue-500 hover:text-blue-700 hover:underline">
                      Lihat Selengkapnya
                    </button>
                  </Link>
                </td>
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
          </div>
      </div>
    </div>
  );
};

export default NasabahTable;