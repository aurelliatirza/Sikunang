"use client";
import React from "react";
import NasabahTable from "../components/Table/nasabahTable";
import Sidebar from "../components/Sidebar/SidebarPejabat";
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
