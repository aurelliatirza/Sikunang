import React, { useEffect, useState } from "react";

interface NavbarProps {
  onSidebarToggle: () => void;
}

const laporanNavbar = ({ onSidebarToggle }: NavbarProps) => {
    const [namaKaryawan, setNamaKaryawan] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch("http://localhost:8000/auth/profile", {
            method: "GET",
            credentials: "include", // ✅ Wajib untuk mengirim cookie!
          });
    
          console.log("Response Status:", response.status, response.statusText); // ✅ Debugging status
    
          if (!response.ok) {
            if (response.status === 401) {
              console.error("Unauthorized: Token mungkin tidak terkirim atau invalid.");
            }
            throw new Error(`Gagal mengambil data user: ${response.statusText}`);
          }
    
          const data = await response.json();
          console.log("User Data:", data); // ✅ Debugging data yang diterima
          setNamaKaryawan(data.name); // Simpan nama user dari response
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
    
      fetchUserProfile();
    }, []);

  return (
    <div className="h-24 bg-blue-400 w-full mx-auto items-center flex justify-between flex-wrap md:flex-nowrap md:px-6 px-4">
      {/* Bagian kiri: Tombol hamburger */}
      <div className="flex items-center space-x-2">
        <button
          className="text-white text-2xl" // Tombol hamburger selalu terlihat
          onClick={onSidebarToggle}
        >
          ☰
        </button>
        <h1 className="text-white text-lg uppercase font-semibold">Laporan</h1>
      </div>

      {/* Bagian kanan: Search dan Profil */}
      <div className="flex items-center space-x-4">

        {/* Nama Karyawan */}
        <div className="bg-white px-4 py-2 rounded-full text-blue-600 font-semibold shadow">
          {namaKaryawan || "Loading..."}
        </div>
      </div>
    </div>
  );
};

export default laporanNavbar;
