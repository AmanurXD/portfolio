import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const CHAT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "jb-chat-secret"
);
const ADMIN_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "jb-portfolio-secret-change-in-production"
);

const CHAT_COOKIE = "chat_session";
const ADMIN_COOKIE = "admin_token";

export interface ChatSessionPayload {
    userId: string;
    name: string;
    isGuest: boolean;
}

export interface CallerInfo {
    id: string;
    name: string;
    isAdmin: boolean;
    isGuest: boolean;
}

export async function createChatSession(payload: ChatSessionPayload) {
    const token = await new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("30d")
        .sign(CHAT_SECRET);

    return {
        name: CHAT_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
    };
}

// Unified caller: checks admin token first, then chat session
export async function getCaller(): Promise<CallerInfo | null> {
    const cookieStore = await cookies();

    // 1. Check admin token
    const adminToken = cookieStore.get(ADMIN_COOKIE)?.value;
    if (adminToken) {
        try {
            const { payload } = await jwtVerify(adminToken, ADMIN_SECRET);
            if (payload.email) {
                return {
                    id: "admin",
                    name: "James Benett",
                    isAdmin: true,
                    isGuest: false,
                };
            }
        } catch { }
    }

    // 2. Check chat session
    const chatToken = cookieStore.get(CHAT_COOKIE)?.value;
    if (chatToken) {
        try {
            const { payload } = await jwtVerify(chatToken, CHAT_SECRET);
            const p = payload as unknown as ChatSessionPayload;
            return {
                id: p.userId,
                name: p.name,
                isAdmin: false,
                isGuest: p.isGuest,
            };
        } catch { }
    }

    return null;
}

// Chat-only session (for contact page session check)
export async function getChatUser(): Promise<ChatSessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(CHAT_COOKIE)?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, CHAT_SECRET);
        return payload as unknown as ChatSessionPayload;
    } catch {
        return null;
    }
}
