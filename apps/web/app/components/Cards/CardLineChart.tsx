"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Karyawan {
  nik: number;
  namaKaryawan: string;
  jabatan: "kacab" | "marketing" | "spv" | "kabag" | "direkturBisnis";
  nik_SPV?: number;
  nik_kabag?: number;
  nik_kacab?: number;
  nik_direkturBisnis?: number;
}

interface UserProfile extends Karyawan {}

const KunjunganChart = ({ initialUserProfile, initialKunjunganData }: { initialUserProfile: UserProfile; initialKunjunganData: any[] }) => {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [] as { label: string; data: number[]; fill: boolean; borderColor: string; backgroundColor: string; borderWidth: number }[],
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialUserProfile);
  const [kunjunganData, setKunjunganData] = useState<any[]>(initialKunjunganData || []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:8000/auth/profile", { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Gagal mengambil data user");

        const data = await response.json();
        setUserProfile(data);
        localStorage.setItem("userProfile", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching user profile:", error);
        const cachedProfile = localStorage.getItem("userProfile");
        if (cachedProfile) {
          setUserProfile(JSON.parse(cachedProfile));
        } else {
          setUserProfile(null);
        }
      }
    };

    const fetchKunjunganData = async () => {
      try {
        const response = await fetch("http://localhost:8000/kunjungan/kunjunganSemuaBulananKaryawan", { method: "GET", credentials: "include" });

        if (!response.ok) throw new Error("Gagal mengambil data kunjungan");

        const data = await response.json();
        if (Array.isArray(data)) {
          setKunjunganData(data);
        } else {
          console.error("Format data tidak sesuai:", data);
          setKunjunganData([]);
        }
      } catch (error) {
        console.error("Error fetching kunjungan data:", error);
        setKunjunganData([]);
      }
    };

    fetchUserProfile();
    fetchKunjunganData();
  }, []);

  useEffect(() => {
    if (!userProfile || !Array.isArray(kunjunganData) || kunjunganData.length === 0) return;

    const months: string[] = [];
    for (let i = 11; i >= 0; i--) {
      months.push(moment().subtract(i, "months").format("MMM YYYY")); // Mengubah ke format 'Feb 2024'
    }

    let datasets = [];

    if (userProfile.jabatan === "marketing") {
      const kunjunganPerBulan = months.map((month) => {
        const filteredData = kunjunganData.filter(
          (item) => item.nik === userProfile.nik && moment(item.monthYear, "YYYY-MM").format("MMM YYYY") === month
        );
        return filteredData.reduce((sum, item) => sum + (item.totalKunjungan || 0), 0);
      });

      datasets.push({
        label: userProfile.namaKaryawan,
        data: kunjunganPerBulan,
        fill: false,
        borderColor: "rgb(255, 165, 0)",
        backgroundColor: "rgb(255, 165, 0)",
        borderWidth: 2,
      });
    } else {
      const bawahan = kunjunganData
        .filter(
          (item) =>
            item.nik_SPV === userProfile.nik ||
            item.nik_kabag === userProfile.nik ||
            item.nik_kacab === userProfile.nik ||
            item.nik_direkturBisnis === userProfile.nik
        )
        .map((item) => item.nik)
        .filter((value, index, self) => self.indexOf(value) === index);

        datasets = bawahan.map((nik, idx) => {
          const marketing = kunjunganData.find((item) => item.nik === nik) || { namaKaryawan: `Marketing ${idx + 1}` };
          const kunjunganPerBulan = months.map((month) => {
            const filteredData = kunjunganData.filter(
              (item) => item.nik === nik && moment(item.monthYear, "YYYY-MM").format("MMM YYYY") === month
            );
            return filteredData.reduce((sum, item) => sum + (item.totalKunjungan || 0), 0);
          });

        return {
          label: marketing ? marketing.namaKaryawan : `Marketing ${idx + 1}`,
          data: kunjunganPerBulan,
          fill: false,
          borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
          backgroundColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
          borderWidth: 2,
        };
      });
    }

    setChartData({ labels: months, datasets });
  }, [userProfile, kunjunganData]);

  return (
    <div className="bg-blue-500 shadow-md rounded-lg p-4 w-full h-[500px] text-white">
      <h2 className="text-center font-bold mb-2">Grafik Kunjungan per Bulan</h2>
      <div style={{ position: "relative", width: "100%", height: "80%" }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                labels: { color: "white" },
                display: userProfile?.jabatan === "marketing" ? false : true, 
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || "";
                    const value = context.raw || 0;
                    return ` ${label}: ${value} kunjungan`;
                  },
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "white" },
                grid: { color: "rgba(255, 255, 255, 0.3)" },
              },
              y: {
                ticks: { color: "white" },
                grid: { color: "rgba(255, 255, 255, 0.3)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default KunjunganChart;
