"use client";
import React, { useEffect, useState } from "react";
import NasabahTable from "../components/Table/nasabahTable";
import SidebarPejabat from "../components/Sidebar/SidebarPejabat";
import SidebarMarketing from "../components/Sidebar/SidebarMarketing";
import Footer from "../components/Footers";
import NasabahNavbar from "../components/Navbar/nasabahNavbar";

interface UserProfile {
    id: number;
    namaKaryawan: string;
    nik: number;
    jabatan:"marketing" | "spv" | "kabag" | "kacab" | "direkturBisnis";
}

const NasabahPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

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

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
        {/* Sidebar */}
        {userProfile?.jabatan === "marketing" ? (
        <SidebarMarketing isSidebarOpen={isSidebarOpen} />
      ) : (
        <SidebarPejabat isSidebarOpen={isSidebarOpen} />
      )}

        {/* Main Content */}
        <main
            className={`flex flex-col flex-1 bg-gray-50 overflow-auto transition-all duration-300 ${
                isSidebarOpen ? "ml-48" : "ml-0"
            }`}
        >
            {/* Navbar */}
            <NasabahNavbar onSidebarToggle={handleSidebarToggle} />

            {/* Wrapper konten utama */}
            <div className="flex flex-col flex-grow px-4 py-4">
                {/* Detail Nasabah */}
                <div className="overflow-x-auto w-full flex-grow">
                    <div className="min-w-[1200px]"> {/* Set lebar minimum */}
                        <NasabahTable />
                    </div>
                </div>
            </div>

            {/* Wrapper untuk footer */}
            <div className="mt-auto w-full">
                {/* Sticky Footer */}
                <div className="sticky bottom-0 w-full bg-gray-50 shadow-md">
                    <Footer />
                </div>
            </div>
        </main>
    </div>
  );
};

export default NasabahPage;
