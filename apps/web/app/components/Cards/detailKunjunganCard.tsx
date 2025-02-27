import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Nasabah {
    namaNasabah: string;
    alamat: string;
    namaUsaha: string;
    no_telp: string;
    karyawan: {
        namaKaryawan: string;
    };
    desa: {
        nama: string;
        Kecamatan: {
            nama: string;
            KabupatenKota: {
                nama: string;
            };
        };
    };
}

interface Kunjungan {
    id_kunjungan: number;
    hasilKunjungan: string;
    foto_kunjungan: string;
    createdAt: string;
    nasabah: Nasabah;
}

const DetailKunjunganCard = () => {
    const [kunjunganData, setKunjunganData] = useState<Kunjungan | null>(null);
    const { id } = useParams();
    console.log("ID dari URL:", id);

    useEffect(() => {
        const fetchDetailKunjungan = async () => {
            if (!id) return; // Jika id belum ada, hentikan proses fetch
            try {
                const response = await fetch(`http://localhost:8000/kunjungan/${id}`);
                if (!response.ok) throw new Error("Gagal mengambil data");
                const data = await response.json();
                console.log("Data kunjungan:", data);
                setKunjunganData(data);
            } catch (error) {
                console.error("Error fetching kunjungan data:", error);
            }
        };
        fetchDetailKunjungan();
    }, [id]); // Menjalankan efek jika id berubah

    if (!kunjunganData) return <p>Memuat data...</p>;


    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6">
            <div className="bg-blue-100 p-4 rounded-xl shadow-md w-full">
                {/* Judul Card */}
                <h2 className="text-xl font-semibold text-center text-gray-700 mb-4 sm:text-2xl md:text-3xl lg:text-4xl">
                    Detail Kunjungan
                </h2>

                {/* Data Nasabah */}
                <div className="space-y-3 text-gray-700">
                    <p><strong>Nama:</strong> {kunjunganData.nasabah.namaNasabah}</p>
                    <p><strong>Alamat:</strong> {kunjunganData.nasabah.alamat}</p>
                    <p><strong>Kelurahan:</strong> {kunjunganData.nasabah.desa.nama}</p>
                    <p><strong>Kecamatan:</strong> {kunjunganData.nasabah.desa.Kecamatan.nama}</p>
                    <p><strong>Kota:</strong> {kunjunganData.nasabah.desa.Kecamatan.KabupatenKota.nama}</p>
                    <p><strong>Nama Usaha:</strong> {kunjunganData.nasabah.namaUsaha}</p>
                    <p><strong>Waktu Kunjungan:</strong> {new Date(kunjunganData.createdAt).toLocaleString("id-ID")}</p>
                    <p><strong>Hasil Kunjungan:</strong> {kunjunganData.hasilKunjungan}</p>
                    <p><strong>Nama AO:</strong> {kunjunganData.nasabah.karyawan.namaKaryawan}</p>
                </div>

                {/* Foto Kunjungan */}
                <div className="mt-4">
                    <p className="font-semibold">Foto Kunjungan:</p>
                    <img 
                        src={`http://localhost:8000/kunjungan/foto/${kunjunganData.foto_kunjungan}`} 
                        alt="Foto Kunjungan" 
                        className="mt-2 w-full rounded-lg shadow-md" 
                    />
                </div>

                {/* Foto nanti setelah dihostingin di server
                <div className="mt-4">
                    <p className="font-semibold">Foto Kunjungan:</p>
                    <img 
                        src={kunjunganData.foto_kunjungan} 
                        alt="Foto Kunjungan" 
                        className="mt-2 w-full rounded-lg shadow-md" 
                    />
                </div> */}


                {/* Tombol Kembali */}
                <div className="flex justify-between mt-4">
                    <Link href="/marketing">
                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 ease-in-out"
                        >
                            KEMBALI
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DetailKunjunganCard;
