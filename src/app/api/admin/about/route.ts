import { NextResponse } from "next/server";
import { readData, writeData, logActivity } from "@/lib/data";
import type { AboutData } from "@/lib/data";

export async function GET() {
    const data = readData<AboutData>("about.json");
    return NextResponse.json(data);
}

export async function PUT(req: Request) {
    const body = await req.json();
    writeData("about.json", body);
    logActivity("Updated", "about page content");
    return NextResponse.json({ ok: true });
}
