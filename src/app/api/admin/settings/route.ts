import { NextResponse } from "next/server";
import { readData, writeData, logActivity } from "@/lib/data";
import type { SiteConfig } from "@/lib/data";

export async function GET() {
    const config = readData<SiteConfig>("site.json");
    return NextResponse.json(config);
}

export async function PUT(req: Request) {
    const body = await req.json();
    writeData("site.json", body);
    logActivity("Updated", "site settings");
    return NextResponse.json({ ok: true });
}
