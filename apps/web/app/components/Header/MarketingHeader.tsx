import React from "react";
import CardStats from "../Cards/CardStats";
import Navbar from "../Navbar/marketingNavbar";
import AddLaporanButton from "../Buttons/addLaporanbutton";

interface DashboardHeaderProps {
  onSidebarToggle: () => void;
}

const MarketingHeader = ({ onSidebarToggle }: DashboardHeaderProps) => {
  return (
    <>
      {/* Oper properti onSidebarToggle ke Navbar */}
      <Navbar onSidebarToggle={onSidebarToggle} />
      <div className="flex flex-wrap bg-blue-400 items-center justify-between gap-4 px-4 py-4 md:grid md:grid-cols-3 md:gap-6">
        <CardStats statTitle="Total Kunjungan" statAngka={1200} statDesc="users" />
        <CardStats statTitle="Total Orders" statAngka={1800} statDesc="orders" />
        <div className="flex items-end justify-end w-full md:w-auto">
          <AddLaporanButton />
        </div>
      </div>
      
    </>
  );
};

export default MarketingHeader;