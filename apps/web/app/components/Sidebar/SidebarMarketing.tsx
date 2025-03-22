"use client";

import { usePathname} from "next/navigation";
import Link from "next/link";
import { FaDesktop, FaFileAlt , FaCoins, FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";

interface SidebarProps {
  isSidebarOpen: boolean;
}

const SidebarMarketing = ({ isSidebarOpen }: SidebarProps) => {
    const pathname = usePathname();

    const links = [
        { href: "/dashboardMarketing", label: "Dashboard", icon: <FaDesktop /> },
        { href: "/laporan", label: "Laporan", icon: <FaFileAlt /> },
        { href: "/nasabah", label: "Nasabah", icon: <FaUser /> },
        { href: "/kreditMarketing", label: "Kredit", icon: <FaCoins /> },
    ];

    const bottomLinks = [
        { href: "/profil", label: "Profil", icon: <FaUserCircle /> },
        { href: "/logout", label: "Logout", icon: <FaSignOutAlt />, isLogout: true },
    ];

    // Periksa apakah berada di jalur laporan atau turunannya
    const isLaporanPage = pathname.startsWith("/laporan");

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
                                pathname === link.href || (link.href === "/laporan" && isLaporanPage)
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
                {bottomLinks.map((link) => (
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
        </div>
    );
};

export default SidebarMarketing;