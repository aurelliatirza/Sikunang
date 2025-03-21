import React from "react";
import KreditNavbar from "../Navbar/kreditNavbar";

interface KreditHeaderProps {
    onSidebarToggle: () => void;
    setActiveTable: (tableName: string) => void;
    activeTable: string;
}

const KreditHeader = ({ onSidebarToggle, setActiveTable, activeTable }: KreditHeaderProps) => {
    const menuItems = [
        { name: "Pengajuan", table: "pengajuan" },
        { name: "SLIK", table: "slik" },
        { name: "Analisis SLIK", table: "analisisSlik" },
        { name: "Visit", table: "visit" },
        { name: "Proposal", table: "proposal" },
        { name: "Persetujuan", table: "persetujuan" }
    ];

    return (
        <>
            <KreditNavbar onSidebarToggle={onSidebarToggle} />
            <div className="bg-blue-400 grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                {menuItems.map((item) => (
                    <button
                        key={item.table}
                        onClick={() => setActiveTable(item.table)}
                        className={`text-white font-semibold py-5 w-full rounded-lg shadow-md transition duration-300 
                            ${activeTable === item.table ? "bg-yellow-300" : "bg-yellow-200 hover:bg-yellow-300"}`}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </>
    );
};

export default KreditHeader;