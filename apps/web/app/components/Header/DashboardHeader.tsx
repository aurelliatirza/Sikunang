import React from "react";
import CardStats from "../Cards/CardStats";
import DashboardNavbar from "../Navbar/dashboardnavbar";


interface DashboardHeaderProps {
  onSidebarToggle: () => void;
}

const DashboardHeader = ({ onSidebarToggle }: DashboardHeaderProps) => {
  return (
    <>
      {/* Oper properti onSidebarToggle ke Navbar */}
      <DashboardNavbar onSidebarToggle={onSidebarToggle} />
      <div className="flex flex-wrap bg-blue-400 items-center justify-between gap-4 px-4 py-4 md:grid md:grid-cols-3 md:gap-6">
        <CardStats statTitle="Total Kunjungan" statAngka={1200} statDesc="users" />
        <CardStats statTitle="Total Orders" statAngka={1800} statDesc="orders" />
        <CardStats statTitle="Total Sales" statAngka={2000} statDesc="sales" />
      </div>
    </>
  );
};

export default DashboardHeader;