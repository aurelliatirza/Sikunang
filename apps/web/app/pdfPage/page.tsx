"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface Nasabah {
  id_nasabah: number;
  namaNasabah: string;
  alamat: string;
  namaUsaha: string;
  no_telp: string;
  karyawan: { namaKaryawan: string };
  desa: {
    nama: string;
    Kecamatan: {
      nama: string;
      KabupatenKota: { nama: string };
    };
  };
}

interface Kunjungan {
  id_kunjungan: number;
  hasilKunjungan: string;
  createdAt: string;
  nasabah: Nasabah;
}

export default function LaporanKunjungan() {
  const searchParams = useSearchParams();
  const tanggalMulai = searchParams.get("startDate");
  const tanggalSelesai = searchParams.get("endDate");
  const selectedBawahan = searchParams.get("selectedBawahan"); // Ambil nama bawahan jika supervisor memilih

  const [kunjunganData, setKunjunganData] = useState<Kunjungan[]>([]);
  const [namaKaryawan, setNamaKaryawan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jabatan, setJabatan] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/auth/profile", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Gagal mengambil data user: ${response.statusText}`);
        }

        const data = await response.json();
        setNamaKaryawan(data.name);
        setJabatan(data.jabatan);
      } catch (err) {
        setError("Gagal mengambil data user.");
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!tanggalMulai || !tanggalSelesai || !namaKaryawan) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8000/kunjungan");
        if (!response.ok) {
          throw new Error(`Gagal mengambil data kunjungan: ${response.statusText}`);
        }

        const data = await response.json();

        let filteredData = data.filter((item: Kunjungan) => {
          const tanggalKunjungan = dayjs(item.createdAt);
          const withinDateRange =
            tanggalKunjungan.isSameOrAfter(dayjs(tanggalMulai), "day") &&
            tanggalKunjungan.isSameOrBefore(dayjs(tanggalSelesai), "day");

          if (jabatan === "marketing") {
            return withinDateRange;
          } else {
            // Supervisor atau role lain → filter berdasarkan nama bawahan
            return withinDateRange && item.nasabah.karyawan.namaKaryawan === selectedBawahan;
          }
        });

        setKunjunganData(filteredData);
      } catch (err) {
        setError("Gagal mengambil data kunjungan.");
        console.error("Error fetching kunjungan data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (namaKaryawan && jabatan) {
      fetchData();
    }
  }, [tanggalMulai, tanggalSelesai, namaKaryawan, jabatan, selectedBawahan]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <style>{`@media print { @page { size: landscape; } }`}</style>

      <h1 className="text-2xl font-bold mb-4 text-center">Laporan Kunjungan</h1>

      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p className="mb-2"><strong>Nama Karyawan:</strong> {namaKaryawan}</p>
          <p className="mb-2"><strong>Tanggal Mulai:</strong> {tanggalMulai}</p>
          <p className="mb-2"><strong>Tanggal Selesai:</strong> {tanggalSelesai}</p>
          {jabatan !== "marketing" && (
            <p className="mb-4"><strong>Nama Ao:</strong> {selectedBawahan || "Tidak ada bawahan dipilih"}</p>
          )}

          {kunjunganData.length > 0 ? (
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">No</th>
                  <th className="border p-2">Nama Nasabah</th>
                  <th className="border p-2">Alamat</th>
                  <th className="border p-2">Nama Usaha</th>
                  <th className="border p-2">No. Telp/HP</th>
                  <th className="border p-2">Nama AO</th>
                  <th className="border p-2">Hasil Kunjungan</th>
                  <th className="border p-2">Waktu Kunjungan</th>
                </tr>
              </thead>
              <tbody>
                {kunjunganData.map((item, index) => (
                  <tr key={item.id_kunjungan} className="text-center">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.nasabah.namaNasabah}</td>
                    <td className="border p-2">
                      {item.nasabah.alamat}, Kel. {item.nasabah.desa.nama}, 
                      Kec. {item.nasabah.desa.Kecamatan.nama}, 
                      {item.nasabah.desa.Kecamatan.KabupatenKota.nama}
                    </td>
                    <td className="border p-2">{item.nasabah.namaUsaha}</td>
                    <td className="border p-2">{item.nasabah.no_telp}</td>
                    <td className="border p-2">{item.nasabah.karyawan.namaKaryawan}</td>
                    <td className="border p-2">{item.hasilKunjungan}</td>
                    <td className="border p-2">{dayjs(item.createdAt).format("DD MMMM YYYY, HH:mm")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mt-4">Tidak ada data kunjungan pada periode ini.</p>
          )}

          <button
            onClick={() => window.print()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Cetak Laporan
          </button>
        </>
      )}
    </div>
  );
}

