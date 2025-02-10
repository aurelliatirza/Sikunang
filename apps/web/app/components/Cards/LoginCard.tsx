"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginCard = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter(); // Untuk redirect setelah login sukses

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Reset error state
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",  // ✅ Pastikan cookie diterima
                body: JSON.stringify({ username, password }),
            });
    
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login gagal");
    
            // ✅ Redirect berdasarkan jabatan
            switch (data.jabatan) {
                case "marketing":
                    router.push("/dashboardMarketing");
                    break;
                case "adminSlik":
                    router.push("/dashboardAdminSlik");
                    break;
                case "hrd":
                    router.push("/dashboardHRD");
                    break;
                default:
                    router.push("/dashboardPejabat");
                    break;
            }
        } catch (err: any) {
            setError(err.message);
        }
    };
    

    return (
        <div className="bg-blue-100 p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-center font-bold text-xl text-gray-700">Login</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Username</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Password</label>
                    <input
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg w-full mt-2 transition duration-200"
                >
                    Login
                </button>
            </form>
            <div className="text-center mt-4">
                <span className="text-gray-600">Belum punya akun? </span>
                <Link href="/register" className="text-blue-500 hover:text-blue-700 font-semibold">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default LoginCard;
