// "use client";

// import { useEffect } from "react";
// import { usePathname } from "next/navigation";

// const TrackHistory = () => {
//   const pathname = usePathname();

//   useEffect(() => {
//     const history = JSON.parse(sessionStorage.getItem("history") || "[]");

//     // Hanya simpan path tanpa query string
//     const cleanPath = pathname.split('?')[0];

//     // Cek apakah path sudah ada dalam history
//     if (history[history.length - 1] !== cleanPath) {
//       // Tambahkan path yang unik
//       history.push(cleanPath);
//       sessionStorage.setItem("history", JSON.stringify(history)); // Simpan kembali ke sessionStorage
//     }
//   }, [pathname]);

//   return null;
// };

// export default TrackHistory;