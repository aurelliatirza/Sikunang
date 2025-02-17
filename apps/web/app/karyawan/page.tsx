"use client";

import React from "react";
import KaryawanHeader from "../components/Header/HeaderHRD/karyawanHeader";
import SidebarHRD from "../components/Sidebar/SidebarHRD";
import Footer from "../components/Footers";
import KaryawanTable from "../components/Table/KaryawanTable";
import AddKaryawanButton from "../components/Buttons/addKaryawanButton";

const KaryawanPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    }

    return (
        <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
        {/* Sidebar */}
        <SidebarHRD isSidebarOpen={isSidebarOpen} />
  
        {/* Main Content */}
        <main
          className={`flex flex-col flex-1 bg-gray-50 overflow-auto transition-all duration-300 ${
            isSidebarOpen ? "ml-48 sm:ml-48 lg:ml-48" : "ml-0"
          }`}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-50 bg-gray-50 shadow-md">
            <KaryawanHeader onSidebarToggle={handleSidebarToggle} />
          </div>
  
          {/* Wrapper untuk tabel dengan overflow-x-auto */}
          <div className="flex-grow overflow-hidden relative p-4">
            <div className="overflow-x-auto w-full mt-4">
              <KaryawanTable />
            </div>
          </div>

        {/* Tombol Tambah Karyawan */}
        <div className="flex items-end justify-end w-full md:w-auto p-4">
            <AddKaryawanButton />
        </div>
  
          {/* Sticky Footer */}
          <div className="sticky bottom-0 z-50 bg-gray-50 shadow-md">
              <Footer />
          </div>
        </main>
      </div>
    );
};

export default KaryawanPage;