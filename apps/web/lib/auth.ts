"use server";

import { FormState } from "./type";
import { RegisterSchema } from "./type";
import { redirect } from "next/navigation";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000"; // Ganti dengan URL backend-mu

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
