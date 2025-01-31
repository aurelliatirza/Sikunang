"use client";
import React from "react";
import LoginCard from "../../components/Cards/LoginCard";
import Footer from "../../components/Footers";  

const LoginPage = () => {
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

      {/* Content: LoginCard di tengah */}
      <div className="flex flex-1 items-center justify-center relative z-10">
        <LoginCard />
      </div>

      {/* Footer di bagian bawah */}
      <Footer />
    </div>
  );
};

export default LoginPage;