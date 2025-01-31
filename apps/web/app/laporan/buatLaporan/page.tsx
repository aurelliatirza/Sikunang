"use client";

import React from "react";
import LaporanNavbar from "../../components/Navbar/laporanNavbar";
import Sidebar from "../../components/Sidebar/SidebarMarketing";
import AddLaporanCard from "../../components/Cards/addLaporanCard";
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
        <Sidebar isSidebarOpen={isSidebarOpen} />
    
        {/* Main Content */}
        <main
            className={`flex flex-col flex-1 bg-gray-50 overflow-auto transition-all duration-300 ${
            isSidebarOpen ? "ml-48 sm:ml-48 lg:ml-48" : "ml-0"
            }`}
        >
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-gray-50 shadow-md">
            <LaporanNavbar onSidebarToggle={handleSidebarToggle} />
            </div>
    
            {/* Wrapper untuk tabel dengan overflow-x-auto */}
            <div className="flex-grow overflow-hidden relative">
            <div className="overflow-x-auto w-full mt-4">
                <AddLaporanCard />
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