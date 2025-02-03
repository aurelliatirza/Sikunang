import React from "react";
import CardStats from "../../Cards/CardStats";
import KaryawanNavbar from "../../Navbar/karyawanNavbar";

interface KaryawanHeaderProps {
    onSidebarToggle: () => void;
}

const KaryawanHeader = ({ onSidebarToggle }: KaryawanHeaderProps) => {
    return (
        <>
            {/* oper properti onSidebarToggle ke Navbar */}
            <KaryawanNavbar onSidebarToggle={onSidebarToggle} />
            <div className="flex flex-wrap bg-blue-400 items-center justify-between gap-4 px-4 py-4 md:grid md:grid-cols-3 md:gap-6">
                <CardStats statTitle="Total Karyawan Aktif" statAngka={10} statDesc="karyawan aktif"/>
                <CardStats statTitle="Jumlah Marketing" statAngka={4} statDesc="marketing aktif"/>
                <CardStats statTitle="Jumlah SPV" statAngka={2} statDesc="SPV aktif"/>
            </div>
        </>
    );
};

export default KaryawanHeader;