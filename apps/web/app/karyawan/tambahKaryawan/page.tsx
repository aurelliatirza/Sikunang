"use client";

import React from "react";
import KaryawanNavbar from "../../components/Navbar/karyawanNavbar";
import SidebarHRD from "../../components/Sidebar/SidebarHRD";
import AddKaryawanCard from "../../components/Cards/addKaryawan";
import Footer from "../../components/Footers";
// import TrackHistory from "../../TrackHistory";



const buatLaporanPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    
    const handleSidebarToggle = () => {
        setIsSidebarOpen((prev) => !prev);
    };
    
    return (
        <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
        {/* <TrackHistory /> */}
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
            <KaryawanNavbar onSidebarToggle={handleSidebarToggle} />
            </div>
    
            {/* Wrapper untuk tabel dengan overflow-x-auto */}
            <div className="flex-grow overflow-hidden relative">
            <div className="overflow-x-auto w-full mt-4">
                <AddKaryawanCard />
            </div>
            </div>
    
            {/* Sticky Footer */}
            <div className="sticky bottom-0 z-50 bg-gray-50 shadow-md">
            <Footer />
            </div>
        </main>
        </div>
    );
    };
export default buatLaporanPage;