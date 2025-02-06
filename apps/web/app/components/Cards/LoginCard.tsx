import React from "react";
import Link from "next/link";

const LoginCard = () => {
    return (
        <div className="bg-blue-100 p-6 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-center font-bold text-xl text-gray-700">Login</h2>
            <form className="mt-5 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Username</label>
                    <input 
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none" 
                        type="text" 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Password</label>
                    <input 
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none" 
                        type="password" 
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
                <Link href="/register">
                    <span className="text-blue-500 hover:text-blue-700 font-semibold">Register</span>
                </Link>
            </div>
        </div>
    );
};

export default LoginCard;
