"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "../../../lib/type";
import { z } from "zod";
import router from "next/router";

type RegisterFormInputs = z.infer<typeof RegisterSchema>;

const RegisterCard = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(RegisterSchema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: RegisterFormInputs) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
    
            if (!response.ok) {
                const errorBody = await response.json();
                console.error("Error Response:", errorBody);
                throw new Error("Registration failed");
            }
    
            const result = await response.json();
            console.log("Registration Success:", result);
        } catch (error) {
            console.error("Error during registration:", error);
        }
    };
    
    
      
      

    return (
        <div className="bg-blue-100 p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto sm:p-8">
            <h2 className="text-center font-bold text-xl text-gray-700">Register</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">NIK</label>
                    <input
                        {...register("nik")}
                        className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        type="text"
                    />
                    {errors.nik && <p className="text-red-500 text-sm">{errors.nik.message as string}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Username</label>
                    <input
                        {...register("username")}
                        className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                        type="text"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message as string}</p>}
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-600">Password</label>
                    <input
                        {...register("password")}
                        className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:ring-2 focus:ring-blue-300 focus:outline-none pr-10"
                        type={showPassword ? "text" : "password"}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg w-full mt-2 transition duration-200"
                >
                    Register
                </button>
            </form>
            <div className="text-center mt-4">
                <span className="text-gray-600">Sudah punya akun? </span>
                <Link href="/auth/login">
                    <span className="text-blue-500 hover:text-blue-700 font-semibold">Login</span>
                </Link>
            </div>
        </div>
    );
};

export default RegisterCard;