import React, { useEffect, useState, useCallback } from "react";
import PersetujuanSatuTable from "./persetujuanSatuTable";
import PersetujuanDuaTable from "./persetujuanDuaTable";
import PersetujuanTigaTable from "./persetujuanTigaTable";
import NominalCard from "../Cards/NominalAjuSetuju";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface KreditKaryawanData {
    namaKaryawan: string;
    total_pengajuan: number;
    total_disetujui: number;
    createdAt: string;
}

const PersetujuanTable = ({ userProfile }: { userProfile: any }) => {
    const [activeSubTable, setActiveSubTable] = useState("persetujuanSatu");
    const [kreditData, setKreditData] = useState<KreditKaryawanData[]>([]);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const menuItems = [
        { name: "Persetujuan Satu", table: "persetujuanSatu" },
        { name: "Persetujuan Dua", table: "persetujuanDua" },
        { name: "Persetujuan Tiga", table: "persetujuanTiga" },
    ];

    const fetchKreditPersetujuan = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/kredit/kreditKaryawan?startDate=${startDate ? startDate.format("YYYY-MM-DD") : ""}&endDate=${endDate ? endDate.format("YYYY-MM-DD") : ""}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Gagal mengambil data kredit");

            let data: KreditKaryawanData[] = await response.json();
            if (userProfile) {
                if (userProfile.jabatan === "marketing") {
                    data = data.filter((item) => item.namaKaryawan === userProfile.nama);
                }
            }
            setKreditData(data);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate, userProfile]);

    useEffect(() => {
        fetchKreditPersetujuan();
    }, [fetchKreditPersetujuan]);

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className="flex gap-4">
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue: Dayjs | null) => setStartDate(newValue)}
                        format="DD/MM/YYYY"
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue: Dayjs | null) => setEndDate(newValue)}
                        format="DD/MM/YYYY"
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                    />
                </div>
            </LocalizationProvider>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    kreditData.map((data) => (
                        <NominalCard
                            key={data.namaKaryawan}
                            namaKaryawan={data.namaKaryawan}
                            nominal_pengajuan={data.total_pengajuan}
                            nominal_disetujui={data.total_disetujui}
                        />
                    ))
                )}
            </div>

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
        </>
    );
};

export default PersetujuanTable;
