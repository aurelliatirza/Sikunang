import React, { useState } from "react";
import PersetujuanSatuTable from "./persetujuanSatuTable";
import PersetujuanDuaTable from "./persetujuanDuaTable";
import PersetujuanTigaTable from "./persetujuanTigaTable";

const PersetujuanTable = () => {
    const [activeSubTable, setActiveSubTable] = useState("persetujuanSatu");

    const menuItems = [
        { name: "Persetujuan Satu", table: "persetujuanSatu" },
        { name: "Persetujuan Dua", table: "persetujuanDua" },
        { name: "Persetujuan Tiga", table: "persetujuanTiga" },
    ];

    return (
        <div className="p-4">
            {/* Button Group untuk memilih sub-tabel */}
            <div className="bg-white grid grid-cols-3 gap-4 p-4">
                {menuItems.map((item) => (
                    <button
                        key={item.table}
                        onClick={() => setActiveSubTable(item.table)}
                        className={`text-white font-semibold py-5 w-full rounded-lg shadow-md transition duration-300 
                            ${activeSubTable === item.table ? "bg-blue-300" : "bg-blue-200 hover:bg-blue-300"}`}
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            {/* Render tabel sesuai pilihan */}
            <div className="mt-4">
                {activeSubTable === "persetujuanSatu" && <PersetujuanSatuTable />}
                {activeSubTable === "persetujuanDua" && <PersetujuanDuaTable />}
                {activeSubTable === "persetujuanTiga" && <PersetujuanTigaTable />}
            </div>
        </div>
    );
};

export default PersetujuanTable;
