import React from "react";

interface NominalCardProps {
  namaKaryawan: string;
  nominal_pengajuan: number;
  nominal_disetujui: number;
}

const NominalCard: React.FC<NominalCardProps> = ({ namaKaryawan, nominal_pengajuan, nominal_disetujui }) => {
    return (
      <div className="flex flex-col items-center rounded-lg w-full bg-white bg-clip-border shadow-md dark:!bg-navy-800 dark:text-white p-4">
        <div className="w-full bg-gray-100 dark:bg-navy-700 rounded-lg p-3">
          <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-white">Nama Karyawan:</p>
          <p className="text-sm md:text-lg font-bold text-navy-700 dark:text-white">{namaKaryawan}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full mt-3">
          <div className="flex flex-col items-center bg-white dark:bg-navy-700 rounded-lg p-3 shadow">
            <p className="text-[8px] sm:text-xs md:text-sm text-gray-600">Total Pengajuan</p>
            <p className="text-[10px] sm:text-sm md:text-base font-semibold text-green-600 dark:text-green-400">
              Rp {nominal_pengajuan.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="flex flex-col items-center bg-white dark:bg-navy-700 rounded-lg p-3 shadow">
            <p className="text-[8px] sm:text-xs md:text-sm text-gray-600">Total Disetujui</p>
            <p className="text-[10px] sm:text-sm md:text-base font-semibold text-blue-600 dark:text-blue-400">
              Rp {nominal_disetujui.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>
    );
  };
  

export default NominalCard;
