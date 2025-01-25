"use client";
import React from "react";
import NasabahTable from "../components/Cards/nasabahTable";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footers";
import CetakButton from "../components/Buttons/cetakButton";
import NasabahNavbar from "../components/Navbar/nasabahNavbar";

const NasabahPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content */}
      <main
        className={`flex flex-col flex-1 bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-48" : "ml-0"
        }`}
      >
        {/* Navbar */}
    
        <NasabahNavbar onSidebarToggle={handleSidebarToggle} />

        {/* Wrapper konten utama */}
        <div className="flex flex-col flex-grow px-4 py-4">
          {/* Tabel Nasabah */}
          <div className="overflow-x-auto w-full">
            <NasabahTable />
          </div>

          {/* Tombol Cetak */}
          <div className="mt-3 flex justify-end">
            <CetakButton />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default NasabahPage;
