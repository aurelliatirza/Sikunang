"use server";

import { createSession } from "./session";
import { FormState, LoginSchema, RegisterSchema } from "./type";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"; // Ganti dengan URL backend-mu

export async function Register(
    state: FormState,
    formData: FormData
): Promise<FormState> {
    const validationFields = RegisterSchema.safeParse({
        nik: formData.get("nik"),
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if (!validationFields.success) {
        return {
            error: validationFields.error.flatten().fieldErrors,
        };
    }

    const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(validationFields.data),
    });

    if (response.ok) {
        redirect("/login"); // Redirect ke halaman login setelah registrasi berhasil
    } else {
        const errorData = await response.json();
        return {
            message: errorData.message || "Registrasi gagal",
        };
    }

    return {
        message: "Terjadi kesalahan",
    };
}


export async function login(state: FormState, formData: FormData): Promise<FormState> {
    const validateField = LoginSchema.safeParse({
        username: formData.get("username"),
        password: formData.get("password"),
    });

    if (!validateField.success) {
        return { error: validateField.error.flatten().fieldErrors };
    }

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validateField.data),
    });

    if (response.ok) {
        const result = await response.json();

        // ✅ Simpan session setelah login sukses
        await createSession({
            userId: result.id.toString(),
            username: result.name,
            jabatan: result.jabatan,  // Pastikan backend mengembalikan jabatan
        });

        // ✅ Redirect sesuai jabatan
        switch (result.jabatan) {
            case "marketing":
                redirect("/dashboardMarketing");
                break;
            case "adminSlik":
                redirect("/dashboardAdmin");
                break;
            case "hrd":
                redirect("/dashboardHRD");
                break;
            default:
                redirect("/dashboardPejabat");
                break;
        }


        return { message: "Login successful" };
    } else {
        return {
            error: {
                message: response.status === 401 ? "Invalid Credentials!" : response.statusText,
            },
        };
    }
}

// export const refreshToken = async (oldRefrechToken: string) => {
//     try {
//         const response = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
//             method: "POST",
//         body: JSON.stringify({ refreshToken: oldRefrechToken }),
//     })

//     if (!response.ok) {
//         throw new Error("Failed to refresh token");
//     } 

//     const {accessToken, refreshToken} = await response.json();
    
//     catch (error) {
        
//     }
// }
  