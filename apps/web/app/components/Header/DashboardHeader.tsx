import React, { useEffect, useState } from "react";
import CardStats from "../Cards/CardStats";
import DashboardNavbar from "../Navbar/dashboardnavbar";

interface DashboardHeaderProps {
  onSidebarToggle: () => void;
}

interface Karyawan {
  nik: number;
  namaKaryawan: string;
  jabatan: "kacab" | "marketing" | "spv" | "kabag" | "direkturBisnis" | "direkturUtama";
  nik_SPV?: number;
  nik_kabag?: number;
  nik_kacab?: number;
  nik_direkturBisnis?: number;
  nik_direkturUtama?: number;
}

interface UserProfile extends Karyawan {}

const DashboardHeader = ({ onSidebarToggle }: DashboardHeaderProps) => {
  const [totalKunjungan, setTotalKunjungan] = useState(0);
  const [totalPengajuan, setTotalPengajuan] = useState(0);
  const [totalNominalDisetujui, setTotalNominalDisetujui] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Fetch data user yang login
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
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch total kunjungan, total pengajuan, dan total nominal disetujui
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
          method: "GET",
          credentials: "include",
        });
  
        if (!response.ok) throw new Error("Gagal mengambil data user");
  
        const data = await response.json();
        console.log("Profil User yang Login:", data);
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
  
    fetchUserProfile();
  }, []);
  
  useEffect(() => {
    if (!userProfile) return;
  
    const fetchData = async () => {
      try {
        const [kunjunganRes, pengajuanRes, persetujuanRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/kunjungan/kunjunganBulanan`, { credentials: "include" }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/kredit/aplikasiKreditBulanan`, { credentials: "include" }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/kredit/kreditSetujuBulanan`, { credentials: "include" }),
        ]);
  
        if (!kunjunganRes.ok || !pengajuanRes.ok || !persetujuanRes.ok) {
          throw new Error("Gagal mengambil data");
        }
  
        const [kunjunganData, pengajuanData, persetujuanData] = await Promise.all([
          kunjunganRes.json(),
          pengajuanRes.json(),
          persetujuanRes.json(),
        ]);
  
        console.log("Data Kunjungan:", kunjunganData);
        console.log("Data Pengajuan:", pengajuanData);
        console.log("Data Persetujuan:", persetujuanData);
  
        let totalKunjunganCount = 0;
        let totalPengajuanCount = 0;
        let totalNominalDisetujuiCount = 0;
  
        if (userProfile.jabatan === "marketing") {
          console.log("User adalah marketing, memproses data sendiri.");
          totalKunjunganCount = kunjunganData.find((item: any) => item.nik === userProfile.nik)?.totalKunjungan || 0;
          totalPengajuanCount = pengajuanData.find((item: any) => item.nik === userProfile.nik)?.jumlah_pengajuan || 0;
          totalNominalDisetujuiCount = persetujuanData.find((item: any) => item.nik === userProfile.nik)?.total_nominal_disetujui || 0;
        } else {
          console.log("User bukan marketing, menghitung data bawahannya.");
          const filterByBawahan = (item: any) => {
            return (
              item.nik_SPV === userProfile.nik ||
              item.nik_kabag === userProfile.nik ||
              item.nik_kacab === userProfile.nik ||
              item.nik_direkturBisnis === userProfile.nik ||
              item.nik_direkturUtama === userProfile.nik
            );
          };
  
          totalKunjunganCount = kunjunganData.filter(filterByBawahan).reduce((sum: number, item: any) => sum + item.totalKunjungan, 0);
          totalPengajuanCount = pengajuanData.filter(filterByBawahan).reduce((sum: number, item: any) => sum + item.jumlah_pengajuan, 0);
          totalNominalDisetujuiCount = persetujuanData.filter(filterByBawahan).reduce((sum: number, item: any) => sum + item.total_nominal_disetujui, 0);
        }
  
        console.log("Total Kunjungan:", totalKunjunganCount);
        console.log("Total Pengajuan:", totalPengajuanCount);
        console.log("Total Nominal Disetujui:", totalNominalDisetujuiCount);
  
        setTotalKunjungan(totalKunjunganCount);
        setTotalPengajuan(totalPengajuanCount);
        setTotalNominalDisetujui(totalNominalDisetujuiCount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [userProfile]);

  return (
    <>
      <DashboardNavbar onSidebarToggle={onSidebarToggle} />
      <div className="flex flex-wrap bg-blue-400 items-center justify-between gap-4 px-4 py-4 md:grid md:grid-cols-3 md:gap-6">
        <CardStats statTitle="Jumlah Pengajuan" statAngka={totalPengajuan} statDesc="Bulan Ini" />
        <CardStats statTitle="Total Kunjungan" statAngka={totalKunjungan} statDesc="Bulan Ini" />
        <CardStats
          statTitle="Total Nominal Disetujui"
          statAngka={new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalNominalDisetujui)}
          statDesc="Bulan Ini"
        />
      </div>
    </>
  );
};

export default DashboardHeader;
