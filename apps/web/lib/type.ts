import { z } from "zod";


export type FormState = {
    error?: {
        nik?: string[];
        username?: string[];
        password?: string[];
    };
    message?: string;
};



export const RegisterSchema = z.object({
    nik: z
        .string()
        .min(1, { message: "NIK tidak boleh kosong" }) // Harus ada isinya
        .regex(/^\d+$/, { message: "NIK harus berupa angka" }) // Harus angka
        .transform((val) => Number(val)), // Konversi ke number
    username: z
        .string()
        .min(4, { message: "username minimal memiliki 4 karakter" })
        .trim(),
    password: z
        .string()
        .min(8, { message: "password harus terdiri dari 8 karakter" })
        .regex(/[a-z]/, { message: "password harus mengandung huruf alfabet kecil" })
        .regex(/[A-Z]/, { message: "password harus mengandung huruf alfabet besar" })
        .regex(/[0-9]/, { message: "password harus mengandung angka di dalamnya" })
        .trim(),
});
