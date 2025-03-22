"use client";
import React, { useState } from "react";
import KreditHeader from "../../components/Header/kreditHeader";
import Sidebar from "../../components/Sidebar/SidebarPejabat";
import PengajuanTable from "../../components/Table/PengajuanTable";
import SlikTable from "../../components/Table/SlikTable";
import AnalisisSlikTable from "../../components/Table/AnalisisSlikTable";
import VisitTable from "../../components/Table/VisitTable";
import ProposalTable from "../../components/Table/ProposalTable";
import PersetujuanTable from "../../components/Table/PersetujuanTable";
import Footer from "../../components/Footers";

const KreditMarketingPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const userProfile = {}; // Replace with actual user profile data or fetch it dynamically
    const [activeTable, setActiveTable] = useState("pengajuan"); // Default: Pengajuan

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
                    isSidebarOpen ? "ml-48 sm:ml-48 lg:ml-48" : "ml-0"
                }`}
            >
                {/* Sticky Header */}
                <div className="sticky top-0 z-50 bg-gray-50 shadow-md">
                    <KreditHeader 
                        onSidebarToggle={handleSidebarToggle} 
                        setActiveTable={setActiveTable} 
                        activeTable={activeTable} // Kirim sebagai props
                    />
                </div>

                {/* Wrapper untuk tabel dengan overflow-x-auto */}
                <div className="flex-grow overflow-hidden relative p-4">
                    <div className="overflow-x-auto w-full mt-4">
                        {activeTable === "pengajuan" && <PengajuanTable />}
                        {activeTable === "slik" && <SlikTable />}
                        {activeTable === "analisisSlik" && <AnalisisSlikTable />}
                        {activeTable === "visit" && <VisitTable />}
                        {activeTable === "proposal" && <ProposalTable />}
                        {activeTable === "persetujuan" && <PersetujuanTable userProfile={userProfile} />}
                    </div>
                </div>

                {/* Sticky Footer */}
                <div className="fixed bottom-0 left-0 w-full bg-gray-50 shadow-md">
                    <Footer />
                </div>
            </main>
        </div>
    );
};

export default KreditMarketingPage;
