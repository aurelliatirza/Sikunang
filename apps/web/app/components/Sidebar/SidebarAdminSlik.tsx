"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import LogoutDialog from "../Dialog/logoutDialog";
import { FaDesktop, FaSignOutAlt, FaUserCircle, FaCoins } from "react-icons/fa";

interface SidebarProps{
    isSidebarOpen: boolean;
}

const SidebarHRD = ({isSidebarOpen}: SidebarProps)=> {
    const pathname = usePathname();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const links = [
        { href: "/dashboardAdminSlik", label: "Dashboard", icon: <FaDesktop /> },
        { href: "/kreditAdminSlik", label: "Kredit", icon: <FaCoins /> },
    ];

    const bottomLinks = [
        { href: "/profil", label: "Profil", icon: <FaUserCircle /> },
        // { href: "/logout", label: "Logout", icon: <FaSignOutAlt/> }
    ];

    //periksa apakah berada di jalur karyawan atau turunanannya
    const isKaryawanPage = pathname.startsWith("/karyawan");

    return (
        <div
            className={`${
                isSidebarOpen ? "w-48 sm:w-48 lg:w-48" : "w-0"
            } flex flex-col bg-white text-gray-800 fixed inset-y-0 left-0 top-0 overflow-y-auto shadow-md transition-all duration-300 z-50`}
        >
            {/* Header */}
            <div className="flex items-center justify-between h-20 bg-gray-100 border-b border-gray-200 px-4">
                <h1 className="text-2xl font-semibold">SIKUNANG</h1>
            </div>

            {/* Navigation */}
            <div className="flex flex-col mt-4">
                {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <div
                            className={`${
                                pathname === link.href
                                    ? "text-blue-600 bg-gray-100"
                                    : "text-gray-500 hover:text-blue-600"
                            } flex items-center px-4 py-3 rounded-md cursor-pointer transition-all`}
                        >
                            <span className="mr-4">{link.icon}</span>
                            {link.label}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Separator */}
            <hr className="my-4 border-gray-200" />

            {/* Bottom Menu */}
            <div className="flex flex-col mt-4">
                <Link href="/profil">
                <div
                className={`${
                    pathname === "/profil"
                    ? "text-blue-600 bg-gray-100"
                    : "text-gray-500 hover:text-blue-600"
                } flex items-center px-4 py-3 rounded-md cursor-pointer transition-all`}
                >
                <span className="mr-4"><FaUserCircle /></span>
                Profil
                </div>
            </Link>

            {/* Logout Button (Memunculkan Dialog) */}
            <button
                onClick={() => setIsLogoutDialogOpen(true)}
                className="flex items-center px-4 py-3 rounded-md text-gray-500 hover:text-blue-600 transition-all cursor-pointer w-full text-left"
            >
                <span className="mr-4"><FaSignOutAlt /></span>
                Logout
            </button>
            </div>
            
            {/* Logout Dialog */}
            <LogoutDialog open={isLogoutDialogOpen} onClose={() => setIsLogoutDialogOpen(false)} />
        </div>
    );
};

export default SidebarHRD;