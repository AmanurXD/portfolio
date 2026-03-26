import { NextResponse } from "next/server";
import { readData, writeData, logActivity } from "@/lib/data";
import type { Testimonial } from "@/lib/data";

export async function GET() {
    const items = readData<Testimonial[]>("testimonials.json");
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    const body = await req.json();
    const items = readData<Testimonial[]>("testimonials.json");
    items.push(body);
    writeData("testimonials.json", items);
    logActivity("Created", `testimonial from "${body.name}"`);
    return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const idx = parseInt(searchParams.get("index") || "-1");
    const items = readData<Testimonial[]>("testimonials.json");
    if (idx < 0 || idx >= items.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    items[idx] = body;
    writeData("testimonials.json", items);
    logActivity("Updated", `testimonial from "${body.name}"`);
    return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const idx = parseInt(searchParams.get("index") || "-1");
    const items = readData<Testimonial[]>("testimonials.json");
    if (idx < 0 || idx >= items.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const removed = items.splice(idx, 1)[0];
    writeData("testimonials.json", items);
    logActivity("Deleted", `testimonial from "${removed.name}"`);
    return NextResponse.json({ ok: true });
}
