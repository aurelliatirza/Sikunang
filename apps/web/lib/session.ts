import { cookies } from "next/headers";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { redirect } from "next/navigation";

interface Session {
    userId: string;
    username: string;
    jabatan: string;  // Tambahkan jabatan untuk keperluan redirect
}

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari dalam milidetik

    const session = await new SignJWT(payload as unknown as JWTPayload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(expiredAt)
        .sign(encodedKey);

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiredAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function getSession(): Promise<Session | null> {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) return null;

    try {
        const { payload } = await jwtVerify(cookie, encodedKey, {
            algorithms: ["HS256"],
        });

        if (typeof payload === "object" && "userId" in payload && "username" in payload && "jabatan" in payload) {
            return payload as unknown as Session;
        } else {
            console.error("Payload tidak sesuai dengan tipe Session:", payload);
            return null;
        }
    } catch (err) {
        console.error("Gagal menjaga session", err);
        redirect("/auth/login");
        return null;
    }
}

