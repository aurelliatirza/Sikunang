"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import { DashboardWrapper } from "../../components/DashboardWrapper/dashboardWrapperPejabat";
import CardLineChart from "../../components/Cards/CardLineChart";
import Footer from "../../components/Footers/index";

const DashboardPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch("http://localhost:8000/auth/session", {
                    credentials: "include", // Kirim cookies ke backend
                });

                if (!res.ok) {
                    throw new Error("Session tidak valid");
                }

                const data = await res.json();
                console.log("User session:", data.user);
                setLoading(false);
            } catch (error) {
                console.log("Session tidak ditemukan, redirect ke login.");
                router.push("/auth/login");
            }
        };

        checkSession();
    }, []);

    if (loading) return <p>Loading...</p>; // Hindari flicker page

    return (
        <div>
            <DashboardWrapper>
                <CardLineChart />
            </DashboardWrapper>
            <Footer />
        </div>
    );
};

export default DashboardPage;
