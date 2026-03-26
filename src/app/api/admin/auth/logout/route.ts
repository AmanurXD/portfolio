import { NextResponse } from "next/server";
import { getTokenCookieOptions } from "@/lib/auth";

export async function POST() {
    const cookieOptions = getTokenCookieOptions();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookieOptions.name, "", { ...cookieOptions, maxAge: 0 });
    return response;
}
