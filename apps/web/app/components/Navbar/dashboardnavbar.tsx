import React from "react";
import { FaUserCircle, FaSearch, FaBars } from "react-icons/fa";

interface NavbarProps {
  onSidebarToggle: () => void;
}

const dashboardNavbar = ({ onSidebarToggle }: NavbarProps) => {
  return (
    <div className="h-24 bg-blue-400 w-full mx-auto items-center flex justify-between flex-wrap md:flex-nowrap md:px-6 px-4">
      {/* Bagian kiri: Tombol hamburger */}
      <div className="flex items-center space-x-2">
        <button
          className="text-white text-2xl" // Tombol hamburger selalu terlihat
          onClick={onSidebarToggle}
        >
          ☰
        </button>
        <h1 className="text-white text-lg uppercase font-semibold">Dashboard</h1>
      </div>

      {/* Bagian kanan: Search dan Profil */}
      <div className="flex items-center space-x-4">
        {/* Kotak Search */}
        <form className="flex items-center">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="text-gray-500 text-sm sm:text-base md:text-lg" />
            </div>
            <input
              type="text"
              placeholder="Search here..."
              className="border px-3 py-2 pl-10 rounded shadow outline-none focus:ring w-32 sm:w-40 md:w-48 text-sm sm:text-base md:text-lg"
            />
          </div>
        </form>

        {/* Ikon Profil */}
        <div className="relative flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 md:w-14 md:h-14 max-w-full rounded-full bg-blue-400 overflow-hidden text-white text-xs sm:text-sm md:text-lg">
          <FaUserCircle size={32} />
        </div>
      </div>
    </div>
  );
};

export default dashboardNavbar;
