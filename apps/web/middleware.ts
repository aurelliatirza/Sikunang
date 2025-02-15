import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    // Ambil cookies dari request
    const token = req.cookies.get("session")?.value;
    console.log("Token:", token);

    // Jika tidak ada token, redirect ke login
    if (!token) {
        console.log("Token tidak ditemukan. Redirect ke login.");
        const loginUrl = new URL("/auth/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Verifikasi token
    try {
        // Pastikan JWT_SECRET tidak undefined
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        // Dekode dan verifikasi token menggunakan `jose`
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        // Ambil jabatan dari payload dan normalisasi
        const { jabatan } = payload as { jabatan: string };
        const normalizedJabatan = jabatan.toLowerCase();
        console.log("Payload token:", payload);
        console.log("Normalized Jabatan:", normalizedJabatan);

        // Ambil path yang sedang diakses
        const pathname = req.nextUrl.pathname;

        // Atur hak akses berdasarkan jabatan
        const accessControl: Record<string, string[]> = {
            adminSlik: ["/dashboardAdminSlik", "/kreditAdminSlik"],
            hrd: ["/dashboardHRD", "/karyawan"],
            marketing: [
                "/dashboardMarketing",
                "/laporan",
                "/kreditMarketing",
            ],
            spv: [
                "/dashboardPejabat",
                "/marketing",
                "/nasabah",
                "/kreditPejabat",
            ],
            kabag: [
                "/dashboardPejabat",
                "/marketing",
                "/nasabah",
                "/kreditPejabat",
            ],
            direkturBisnis: [
                "/dashboardPejabat",
                "/marketing",
                "/nasabah",
                "/kreditPejabat",
            ],
        };

        // Periksa apakah jabatan memiliki akses ke URL yang diakses
        const allowedPaths = accessControl[normalizedJabatan];
        console.log("Allowed paths:", allowedPaths);

        if (
            !allowedPaths ||
            !allowedPaths.some((path) => pathname.startsWith(path))
        ) {
            // Jika tidak sesuai, arahkan ke halaman tidak diizinkan
            console.log("Akses tidak diizinkan. Redirect ke notAuthorized.");
            const unauthorizedUrl = new URL("/notAuthorized", req.url);
            return NextResponse.redirect(unauthorizedUrl);
        }

        // Jika lolos verifikasi, lanjutkan ke halaman tujuan
        return NextResponse.next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        // Jika token tidak valid, redirect ke login
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
