import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default-dev-secret-change-me"
);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes (except login)
    if (!pathname.startsWith("/admin")) {
        return NextResponse.next();
    }

    // Allow login page
    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    // Check for auth token
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }
}

export const config = {
    matcher: ["/admin/:path*"],
};
