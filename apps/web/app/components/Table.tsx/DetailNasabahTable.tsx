import React from "react";

const DetailNasabahTable: React.FC = () => {
    const data = [
        { no: 1, waktuKunjungan: "2021-08-12 12:00:00", HasilKunjungan: "Belum Tertarik", foto: "/bpr.png" },
        { no: 2, waktuKunjungan: "2021-08-12 11:00:00", HasilKunjungan: "Sedikit Tertarik", foto: "/bpr.png" },
        { no: 3, waktuKunjungan: "2021-08-12 10:00:00", HasilKunjungan: "Tertarik", foto: "/bpr.png" },
        { no: 4, waktuKunjungan: "2021-08-12 09:00:00", HasilKunjungan: "Tertarik", foto: "/bpr.png" },
    ];

    return (
        <div className="overflow-x-auto w-full">
            <div className="min-w-full overflow-hidden rounded-2xl border border-gray-300">
                <table className="min-w-[1200px] text-sm border-collapse w-full">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                        <th className="border border-gray-300 px-4 py-2 rounded-tl-2xl text-center" style={{ width: "80px" }}>No</th>
                        <th className="border border-gray-300 px-4 py-2 text-center" style={{ width: "180px" }}>Waktu Kunjungan</th>
                        <th className="border border-gray-300 px-4 py-2 text-center" style={{ width: "180px" }}>Hasil Kunjungan</th>
                        <th className="border border-gray-300 px-4 py-2 rounded-tr-2xl text-center" style={{ width: "300px" }}>Foto Kunjungan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                            <td className="border border-gray-300 px-4 py-2 text-center">{item.no}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{item.waktuKunjungan}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{item.HasilKunjungan}</td>
                            <td className={`border border-gray-300 px-4 py-2 text-center ${index === data.length - 1 ? "rounded-br-2xl" : ""}`}>
                            <div className="w-full h-40 overflow-hidden">
                                <img
                                src={item.foto} // Accessing the image from the public folder
                                alt="Foto Kunjungan"
                                className="w-full h-full object-contain"
                                />
                            </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    );
};

export default DetailNasabahTable;
