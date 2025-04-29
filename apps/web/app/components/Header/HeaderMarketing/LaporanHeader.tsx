import React, { useEffect, useState } from "react";
import CardStats from "../../Cards/CardStats";
import Navbar from "../../Navbar/laporanNavbar";
import AddLaporanButton from "../../Buttons/addLaporanbutton";


interface LaporanHeaderProps {
  onSidebarToggle: () => void;
}

interface Karyawan {
  nik: number;
  namaKaryawan: string;
  jabatan: "kacab"| "marketing" | "spv" | "kabag" | "direkturBisnis";
  nik_SPV?: number;
  nik_kabag?: number;
  nik_kacab?: number;
  nik_direkturBisnis?: number;
}

interface UserProfile extends Karyawan {}

const LaporanHeader = ({ onSidebarToggle }: LaporanHeaderProps) => {
    const [totalKunjungan, setTotalKunjungan] = React.useState(0);
    const [totalPengajuan, setTotalPengajuan] = React.useState(0);
    const [totalNominalDisetujui, setTotalNominalDisetujui] = React.useState(0);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [jabatan, setJabatan] = useState<string | null>(null);
    
    //Fetch data yang login
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
  
    //Fetch data dari API untuk total pengajuan
    useEffect(() => {
      if (!userProfile) return;
      console.log("User yang sedang login:", userProfile);
    
      const fetchTotalPengajuan = async () => {
        try {
          console.log("Fetching total pengajuan untuk NIK:", userProfile.nik);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kredit/aplikasiKreditBulanan`, {
            method: "GET",
            credentials: "include",
          });
    
          console.log("Response status:", response.status);
    
          if (!response.ok) throw new Error("Gagal mengambil data pengajuan");
    
          const data = await response.json();
          console.log("Data Pengajuan:", data);
    
          // Filter data untuk mendapatkan total pengajuan sesuai NIK user yang login
          const userData = data.find((item: { nik: number }) => item.nik === userProfile.nik);
    
          if (userData) {
            setTotalPengajuan(userData.jumlah_pengajuan);  // ✅ Gunakan jumlah_pengajuan dari API
          } else {
            setTotalPengajuan(0); // Jika tidak ditemukan, set 0
          }
    
        } catch (error) {
          console.error("Error fetching total pengajuan:", error);
        }
      };
    
      fetchTotalPengajuan();
    }, [userProfile]);
    
  
  
    //Fetch data dari API untuk total kunjungan
    useEffect(() => {
      if (!userProfile) return;
      console.log("User yang sedang login:", userProfile);
    
      const fetchTotalKunjungan = async () => {
        try {
          console.log("Fetching total kunjungan untuk NIK:", userProfile.nik);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kunjungan/kunjunganBulanan`, {
            method: "GET",
            credentials: "include",
          });
    
          console.log("Response status:", response.status);
    
          if (!response.ok) throw new Error("Gagal mengambil data kunjungan");
    
          const data = await response.json();
          console.log("Data kunjungan:", data);
    
          // Filter data untuk mendapatkan total kunjungan sesuai NIK user yang login
          const userData = data.find((item: { nik: number }) => item.nik === userProfile.nik);
    
          if (userData) {
            setTotalKunjungan(userData.totalKunjungan);
          } else {
            setTotalKunjungan(0); // Jika tidak ditemukan, set 0
          }
    
        } catch (error) {
          console.error("Error fetching total kunjungan:", error);
        }
      };
    
      fetchTotalKunjungan();
    }, [userProfile]);
  
    //Fetch data dari API untuk total nominal disetujui
    useEffect(() => {
      if (!userProfile) return;
      console.log("User yang sedang login:", userProfile);
    
      const fetchTotalNominalPersetujuan = async () => {
        try {
          console.log("Fetching total nominal disetujui untuk NIK:", userProfile.nik);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kredit/kreditSetujuBulanan`, {
            method: "GET",
            credentials: "include",
          });
    
          console.log("Response status:", response.status);
    
          if (!response.ok) throw new Error("Gagal mengambil data nominal disetujui");
    
          const data = await response.json();
          console.log("Data Nominal Persetujuan:", data);
    
          // Ambil data sesuai dengan NIK user yang sedang login
          const userData = data.find((item: { nik: number }) => item.nik === userProfile.nik);
    
          if (userData) {
            setTotalNominalDisetujui(userData.total_nominal_disetujui);  // ✅ Gunakan total_nominal_disetujui
          } else {
            setTotalNominalDisetujui(0); // Jika tidak ditemukan, set 0
          }
    
        } catch (error) {
          console.error("Error fetching total nominal disetujui:", error);
        }
      };
    
      fetchTotalNominalPersetujuan();
    }, [userProfile]);
  return (
    <>
      {/* Oper properti onSidebarToggle ke Navbar */}
      <Navbar onSidebarToggle={onSidebarToggle} />
      <div className="flex flex-wrap bg-blue-400 items-center justify-between gap-4 px-4 py-4 md:grid md:grid-cols-3 md:gap-6">
        <CardStats statTitle="Jumlah Pengajuan" statAngka={totalPengajuan} statDesc="Bulan Ini" />
        <CardStats statTitle="Total Kunjungan" statAngka={totalKunjungan} statDesc="Bulan Ini" />
        <div className="flex items-end justify-end w-full md:w-auto">
          <AddLaporanButton />
        </div>
      </div>
      
    </>
  );
};

export default LaporanHeader;