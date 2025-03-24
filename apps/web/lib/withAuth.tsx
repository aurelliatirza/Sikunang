"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.FC) => {
  return (props: any) => {
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
          router.push("/login");
        }
      };

      checkSession();
    }, []);

    if (loading) return <p>Loading...</p>; // Hindari flicker page

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
