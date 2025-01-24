"use client";
import React, { useRef, useEffect } from "react";
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

// Mendaftarkan elemen-elemen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CardBarChart = () => {
  const chartRef = useRef<ChartJS<"line"> | null>(null); // Ref untuk chart dengan tipe ChartJS

  const data = {
    labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    type: "line",
    datasets: [
      {
        label: "Sales",
        data: [3, 2, 2, 1, 5, 2],
        fill: false,
        backgroundColor: "rgb(255, 165, 0)",
        borderColor: "rgb(255, 165, 0)", // Warna garis menjadi oranye
        borderWidth: 2, // Mengatur ketebalan garis
        barThickness: 8,
      },
      {
        label: "Orders",
        data: [1, 3, 2, 2, 3, 1],
        fill: false,
        backgroundColor: "rgb(255, 255, 255)",
        borderColor: "rgb(255, 255, 255)", // Warna garis menjadi putih
        borderWidth: 2, // Mengatur ketebalan garis
        barThickness: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Pastikan aspek rasio tetap saat ukuran berubah
    scales: {
      x: {
        ticks: {
          color: "white", // Mengubah warna angka di sumbu X menjadi putih
        },
        grid: {
          color: "rgba(255, 255, 255, 0.3)", // Mengubah warna grid pada sumbu X menjadi putih
        },
      },
      y: {
        beginAtZero: true,
        type: "linear" as const,
        ticks: {
          color: "white", // Mengubah warna angka di sumbu Y menjadi putih
        },
        grid: {
          color: "rgba(255, 255, 255, 0.3)", // Mengubah warna grid pada sumbu Y menjadi putih
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white", // Mengubah warna teks legenda menjadi putih
        },
      },
      tooltip: {
        titleColor: "white", // Mengubah warna judul tooltip menjadi putih
        bodyColor: "white",  // Mengubah warna isi tooltip menjadi putih
      },
    },
  };

  // Menambahkan event listener untuk resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.update(); // Memanggil method update pada ChartJS instance
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="bg-blue-500 shadow-md rounded-lg p-4 w-full h-[500px] text-white">
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default CardBarChart;
