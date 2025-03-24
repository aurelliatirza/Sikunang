"use client";

import React from "react";
import MarketingHeader from "../components/Header/HeaderPejabat/MarketingHeader";
import Sidebar from "../components/Sidebar/SidebarPejabat";
import MarketingTable from "../components/Table/marketingTable";
import Footer from "../components/Footers";
import withAuth from "../../lib/withAuth";


const MarketingPage = () => {
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
          isSidebarOpen ? "ml-48 sm:ml-48 lg:ml-48" : "ml-0"
        }`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-gray-50 shadow-md">
          <MarketingHeader onSidebarToggle={handleSidebarToggle} />
        </div>

        {/* Wrapper untuk tabel dengan overflow-x-auto */}
        <div className="flex-grow overflow-hidden relative">
          <div className="overflow-x-auto w-full mt-4">
            <MarketingTable />
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

export default withAuth(MarketingPage);