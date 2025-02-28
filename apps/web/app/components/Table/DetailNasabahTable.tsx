import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface DetailNasabah {
    id_kunjungan: number;
    createdAt: string;
    hasilKunjungan: string;
    foto_kunjungan: string;
}

const DetailNasabahTable: React.FC = () => {
    const [detailNasabah, setDetailNasabah] = useState<DetailNasabah[]>([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchDetailNasabah = async () => {
            if (!id) return;
            try {
                const response = await fetch(`http://localhost:8000/nasabah/kunjungan/${id}`);
                if (!response.ok) throw new Error("Gagal mengambil data");
                const data = await response.json();
                console.log("Data kunjungan:", data);

                // Pastikan bahwa data.kunjungan adalah array
                if (Array.isArray(data.kunjungan)) {
                    setDetailNasabah(data.kunjungan);
                } else {
                    console.error("Format data tidak sesuai:", data);
                }
            } catch (error) {
                console.error("Error fetching nasabah data:", error);
            }
        };

        fetchDetailNasabah();
    }, [id]);

    return (
        <div className="overflow-x-auto w-full">
            <div className="min-w-full overflow-hidden rounded-2xl border border-gray-300">
                <table className="min-w-[1200px] text-sm border-collapse w-full">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border border-gray-300 px-4 py-2 rounded-tl-2xl text-center" style={{ width: "50px" }}>No</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" style={{ width: "120px" }}>Waktu Kunjungan</th>
                            <th className="border border-gray-300 px-4 py-2 text-center" style={{ width: "120px" }}>Hasil Kunjungan</th>
                            <th className="border border-gray-300 px-4 py-2 rounded-tr-2xl text-center" style={{ width: "500px" }}>Foto Kunjungan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailNasabah.length > 0 ? (
                            detailNasabah.map((item, index) => (
                                <tr key={item.id_kunjungan} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{new Date(item.createdAt).toLocaleString()}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">{item.hasilKunjungan}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <div className="w-full h-96 overflow-hidden">
                                            <img
                                                src={`http://localhost:8000/nasabah/kunjungan/foto/${item.foto_kunjungan}`}
                                                alt="Foto Kunjungan"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="border border-gray-300 px-4 py-2 text-center">
                                    Tidak ada data kunjungan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailNasabahTable;
