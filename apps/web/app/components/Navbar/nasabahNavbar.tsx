import React from "react";
import { FaUserCircle, FaSearch, FaBars } from "react-icons/fa";

interface NavbarProps {
  onSidebarToggle: () => void;
}

const nasabahNavbar = ({ onSidebarToggle }: NavbarProps) => {
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
        <h1 className="text-white text-lg uppercase font-semibold">Nasabah</h1>
      </div>

      {/* Bagian kanan: Search dan Profil */}
      <div className="flex items-center space-x-4">

        {/* Ikon Profil */}
        <div className="relative flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 md:w-14 md:h-14 max-w-full rounded-full bg-blue-400 overflow-hidden text-white text-xs sm:text-sm md:text-lg">
          <FaUserCircle size={32} />
        </div>
      </div>
    </div>
  );
};

export default nasabahNavbar;
