import Link from "next/link";
import React, { useEffect, useState } from "react";

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
  const [kunjunganData, setKunjunganData] = useState<Kunjungan[]>([]);
  const [filteredKunjungan, setFilteredKunjungan] = useState<Kunjungan[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

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

  setFilteredKunjungan(filteredData);
}, [userProfile, kunjunganData]);


  return (
    <div className="overflow-x-auto w-full">
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
          {filteredKunjungan.length > 0 ? (
            filteredKunjungan
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="px-6 py-3 text-center">{index + 1}</td>
                <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.namaNasabah}</td>
                <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.alamat}</td>
                <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.desa.nama}</td>
                <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.desa.Kecamatan.nama}</td>
                <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.desa.Kecamatan.KabupatenKota.nama}</td>
                <td className="px-6 py-3 text-center border-l border-white">{item.nasabah.namaUsaha}</td>
                <td className="px-6 py-3 text-center border-l border-white">
                  {new Date (item.createdAt).toLocaleString("id-ID", {
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
    </div>
  );
};

export default MarketingTable;

