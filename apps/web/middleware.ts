import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    // Ambil cookies dari request
    const token = req.cookies.get("session")?.value;
    console.log("Token:", token);

    // Jika tidak ada token, redirect ke login
    if (!token) {
        console.log("Token tidak ditemukan. Redirect ke login.");
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
        // Pastikan JWT_SECRET tidak undefined
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        // Dekode dan verifikasi token menggunakan `jose`
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // Ambil jabatan dari payload dan normalisasi menggunakan mapping
        const { jabatan } = payload as { jabatan: string };
        console.log("Payload token:", payload);
        console.log("Jabatan dari payload:", jabatan);

        // Mapping jabatan agar sesuai dengan accessControl
        const jabatanMapping: Record<string, string> = {
            AdminSlik: "adminSlik",
            HRD: "hrd",
            Marketing: "marketing",
            SPV: "spv",
            Kabag: "kabag",
            DirekturBisnis: "direkturBisnis", // ✅ Pastikan ini ada!
        };

        const normalizedJabatan = jabatanMapping[jabatan] ?? jabatan;
        console.log("Normalized Jabatan:", normalizedJabatan);

        // Jika jabatan tidak valid, redirect ke halaman not authorized
        if (!normalizedJabatan) {
            console.log(`Jabatan "${jabatan}" tidak valid. Redirect ke notAuthorized.`);
            return NextResponse.redirect(new URL("/notAuthorized", req.url));
        }

        // Ambil path yang sedang diakses
        const pathname = req.nextUrl.pathname;

        // Atur hak akses berdasarkan jabatan
        const accessControl: Record<string, string[]> = {
            adminSlik: ["/dashboardAdminSlik", "/kreditAdminSlik"],
            hrd: ["/dashboardHRD", "/karyawan"],
            marketing: ["/dashboardMarketing", "/laporan", "/kreditMarketing", "/pdfPage", "/nasabah"],
            spv: ["/dashboardPejabat", "/marketing", "/nasabah", "/kreditPejabat","/pdfPage"],
            kabag: ["/dashboardPejabat", "/marketing", "/nasabah", "/kreditPejabat", "/pdfPage"],
            direkturBisnis: ["/dashboardPejabat", "/marketing", "/nasabah", "/kreditPejabat", "/pdfPage"],
        };

        // Periksa apakah jabatan memiliki akses ke URL yang diakses
        const allowedPaths = accessControl[normalizedJabatan];
        console.log("Allowed paths:", allowedPaths);

        if (
            !allowedPaths ||
            !allowedPaths.some((path) => pathname.startsWith(path))
        ) {
            console.log("Akses tidak diizinkan. Redirect ke notAuthorized.");
            return NextResponse.redirect(new URL("/notAuthorized", req.url));
        }

        // Jika lolos verifikasi, lanjutkan ke halaman tujuan
        return NextResponse.next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        const loginUrl = new URL("/auth/login", req.url);
        console.log("Token tidak valid. Redirect ke login.");
        return NextResponse.redirect(loginUrl);
    }
}

// Tentukan route yang harus diperiksa session dan jabatan
export const config = {
    matcher: [
        "/dashboardAdminSlik/:path*",
        "/kreditAdminSlik/:path*",
        "/dashboardHRD/:path*",
        "/karyawan/:path*",
        "/dashboardMarketing/:path*",
        "/laporan/:path*",
        "/kreditMarketing/:path*",
        "/dashboardPejabat/:path*",
        "/marketing/:path*",
        "/nasabah/:path*",
        "/kreditPejabat/:path*",
    ],
};
