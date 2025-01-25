"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/Header/DashboardHeader";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export const DashboardWrapper = ({ children }: DashboardWrapperProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        {/* Oper fungsi handleSidebarToggle ke DashboardHeader */}
        <DashboardHeader onSidebarToggle={handleSidebarToggle} />
        <div className="px-4">{children}</div>
      </main>
    </div>
  );
};
