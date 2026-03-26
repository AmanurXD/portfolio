import { NextResponse } from "next/server";
import { signToken, getTokenCookieOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
        return NextResponse.json(
            { error: "Admin credentials not configured" },
            { status: 500 }
        );
    }

    if (email !== adminEmail || password !== adminPassword) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }

    const token = await signToken({ email, role: "admin" });
    const cookieOptions = getTokenCookieOptions();

    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookieOptions.name, token, cookieOptions);

    return response;
}
