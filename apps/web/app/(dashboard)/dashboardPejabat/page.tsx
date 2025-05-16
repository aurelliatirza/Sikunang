"use client";
import React, { useEffect, useState } from "react";
import withAuth from "../../../lib/withAuth";
import { DashboardWrapper } from "../../components/DashboardWrapper/dashboardWrapperPejabat";
import CardLineChart from "../../components/Cards/CardLineChart";
import Footer from "../../components/Footers/index";

interface Karyawan {
    nik: number;
    namaKaryawan: string;
    jabatan: "kacab" | "marketing" | "spv" | "kabag" | "direkturBisnis" | "direkturUtama";
    nik_SPV?: number;
    nik_kabag?: number;
    nik_kacab?: number;
    nik_direkturBisnis?: number;
    nik_direkturUtama?: number;
}

interface UserProfile extends Karyawan {}

const DashboardPage = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [kunjunganData, setKunjunganData] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Gagal mengambil data user");

                const data = await response.json();
                setUserProfile(data);

                // Simpan ke localStorage sebagai cache
                localStorage.setItem("userProfile", JSON.stringify(data));
            } catch (error) {
                console.error("Error fetching user profile:", error);

                // Ambil data dari localStorage jika ada
                const cachedProfile = localStorage.getItem("userProfile");
                if (cachedProfile) {
                    setUserProfile(JSON.parse(cachedProfile));
                } else {
                    setUserProfile(null); // Tidak ada fallback
                }
            }
        };

        fetchUserProfile();
    }, []);
    

    return (
        <div>
            <DashboardWrapper>
                <div></div>
                {userProfile ? (
                    <CardLineChart initialUserProfile={userProfile} initialKunjunganData={kunjunganData} />
                ) : (
                    <p>Memuat data pengguna...</p> // Placeholder saat data belum tersedia
                )}
            </DashboardWrapper>
            <Footer />
        </div>
    );
};

export default withAuth(DashboardPage);
