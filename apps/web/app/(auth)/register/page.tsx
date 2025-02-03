"use client";
import React from "react";
import RegisterCard from "../../components/Table.tsx/RegisterCard";
import Footer from "../../components/Footers";

const RegisterPage = () => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background dengan opacity */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bpr.png')" }}
      >
        {/* Overlay untuk menurunkan opacity gambar */}
        <div className="absolute inset-0 bg-white opacity-60"></div>
      </div>

      {/* Content: RegisterCard di tengah */}
      <div className="flex flex-1 items-center justify-center relative z-10">
        <RegisterCard />
      </div>

      {/* Footer di bagian bawah */}
      <Footer />
    </div>
  );
};

export default RegisterPage;
